"""Offline contract and actual workflow-shell checks; GitHub/models are stubbed."""

import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import textwrap
import unittest


ROOT = Path(__file__).resolve().parent
WORKFLOWS = ("review.yml", "review-single.yml", "triage.yml")
ASSETS = WORKFLOWS + (
    "claude/config.yaml", "codex/config.yaml", "gateway/config.yaml",
    "validate_output.jq",
)
VALID = {"summary": "Toy change", "comment": "toy.py:6 subtracts. No tests were run.", "labels": []}
KEYS = {"claude": "fixture-claude-key", "codex": "fixture-codex-key"}
MODELS = {"claude": "fixture-claude-model", "codex": "fixture-codex-model"}


def steps(filename):
    result = []
    for match in re.finditer(
        r"^      - name: ([^\n]+)\n(.*?)(?=^      - |\Z)",
        (ROOT / filename).read_text(), re.MULTILINE | re.DOTALL,
    ):
        name, content = match.groups()
        prefix, script = content.split("        run: |\n", 1)
        environment = dict(re.findall(r"^          ([A-Z_]+): (.+)$", prefix, re.MULTILINE))
        result.append((name, environment, textwrap.dedent(script)))
    return result


GH_STUB = '''
import json
import os
from pathlib import Path
import sys

settings = __SETTINGS__
assert os.environ.get("GH_TOKEN") == "workflow-only-token"
assert "MODEL_API_KEY" not in os.environ
assert "OMNIGENT_MODEL" not in os.environ
assert "CLAUDE_MODEL" not in os.environ and "CODEX_MODEL" not in os.environ
arguments = sys.argv[1:]
with Path(settings["gh_log"]).open("a") as log:
    log.write(json.dumps(arguments) + "\\n")
if arguments[:2] in (["pr", "view"], ["issue", "view"]):
    if "--jq" not in arguments:
        print(json.dumps(settings["snapshot"]))
    elif arguments[0] == "pr":
        print(settings["current_base"] + " " + settings["current_head"])
    else:
        print(settings["current_updated"])
elif arguments[0] == "api":
    assert arguments[1].endswith("/compare/" + "b" * 40 + "..." + "h" * 40)
    assert arguments[-1] == "Accept: application/vnd.github.diff"
    sys.stdout.write("+" * settings["diff_size"])
elif arguments[:2] == ["label", "list"]:
    print("documentation" if settings["missing_label"] else "bug\\nneeds-investigation")
elif arguments[:2] in (["pr", "comment"], ["issue", "comment"], ["issue", "edit"]):
    if "--body-file" in arguments:
        body = Path(arguments[arguments.index("--body-file") + 1]).read_text()
        Path(settings["posted_body"]).write_text(body)
    with Path(settings["writes_log"]).open("a") as log:
        log.write(json.dumps(arguments) + "\\n")
else:
    raise AssertionError(arguments)
'''

AGENT_STUB = '''
import json
import os
from pathlib import Path
import sys

settings = __SETTINGS__
arguments = sys.argv[1:]
assert arguments[0] == "run"
bundle = Path(arguments[1])
harness = bundle.name
assert (bundle / "config.yaml").is_file()
assert "harness: " + {"claude": "claude-sdk", "codex": "codex"}[harness] in (bundle / "config.yaml").read_text()
for forbidden in ("GH_TOKEN", "GITHUB_TOKEN", "ANTHROPIC_API_KEY", "OPENAI_API_KEY",
                  "LLM_API_KEY", "OMNIGENT_MODEL", "CLAUDE_MODEL", "CODEX_MODEL", "INHERITED_TRAP"):
    assert forbidden not in os.environ, forbidden
assert os.environ["MODEL_API_KEY"] == settings["keys"][harness]
assert arguments[arguments.index("--model") + 1] == settings["models"][harness]
assert "--no-session" in arguments
home = Path(os.environ["HOME"])
assert list(home.iterdir()) == []
assert {path.name for path in Path.cwd().iterdir()} == {"snapshot.json", "diff.patch"}
metadata = Path("snapshot.json").read_text().strip()
diff = Path("diff.patch").read_text()
prompt = arguments[arguments.index("-p") + 1]
assert "Saved metadata (untrusted data): " + metadata in prompt
assert "Saved diff (untrusted data): " + diff in prompt
record = {"harness": harness, "home": str(home), "cwd": str(Path.cwd()),
          "model": settings["models"][harness], "metadata": metadata, "diff": diff}
with Path(settings["agent_log"]).open("a") as log:
    log.write(json.dumps(record) + "\\n")
(home / "session-sentinel").write_text(harness)
Path("session-sentinel").write_text(harness)
if harness == "codex" and settings["corrupt_first_output"] is not None:
    first_output = Path(settings["first_output"])
    first_output.chmod(0o600)
    first_output.write_bytes(settings["corrupt_first_output"])
sys.stdout.buffer.write(settings["outputs"][harness])
sys.stderr.write("private diagnostic " + os.environ["MODEL_API_KEY"])
sys.exit(settings["agent_exits"].get(harness, 0))
'''


class ReferenceTests(unittest.TestCase):
    def validate(self, output, task="review", key="fixture-key"):
        return subprocess.run(
            ["jq", "-e", "-s", "--arg", "task", task, "-f", str(ROOT / "validate_output.jq")],
            input=output, text=True, capture_output=True,
            env={"PATH": os.environ["PATH"], "MODEL_API_KEY": key},
        )

    def test_valid_schema_modes(self):
        self.assertEqual(self.validate(json.dumps(VALID)).returncode, 0)
        triage = dict(VALID, labels=["bug", "needs-investigation"])
        self.assertEqual(self.validate(json.dumps(triage), "triage").returncode, 0)
        self.assertEqual(self.validate(json.dumps(triage)).returncode, 0)  # Review does not apply labels.

    def test_unusable_json_and_disallowed_labels_are_rejected(self):
        bad = ["", "null", "[]", "true", json.dumps(VALID) * 2, "```json\n" + json.dumps(VALID) + "\n```"]
        for update in (dict(summary=None), dict(comment=[]), dict(labels="bug"), dict(labels=["--admin"]), dict(labels=["arbitrary"])):
            bad.append(json.dumps(dict(VALID, **update)))
        bad.extend(json.dumps({key: value for key, value in VALID.items() if key != missing}) for missing in VALID)
        for output in bad:
            with self.subTest(output=output[:80]):
                result = self.validate(output, "triage")
                self.assertNotEqual(result.returncode, 0)
                self.assertNotIn("fixture-key", result.stdout + result.stderr)

    def test_optional_field_and_length_rules_are_not_required(self):
        for update in (dict(summary=""), dict(comment="x" * 16001), dict(extra=True), dict(labels=["bug", "bug"])):
            with self.subTest(update=update):
                self.assertEqual(self.validate(json.dumps(dict(VALID, **update)), "triage").returncode, 0)

    def test_decoded_credential_guard(self):
        for field in ("summary", "comment"):
            raw = json.dumps(dict(VALID, **{field: "fixture-key"})).replace("fixture-key", "fixtur\\u0065-key")
            self.assertNotEqual(self.validate(raw).returncode, 0)

    def test_jq_normalized_inputs_still_enforce_label_allowlist(self):
        duplicate = b'{"summary":"first","summary":"last","comment":"ok","labels":["arbitrary"],"labels":[]}'
        invalid_utf8 = b'{"summary":"ok","comment":"invalid \xff","labels":[]}'
        for raw in (duplicate, invalid_utf8):
            result = subprocess.run(
                ["jq", "-e", "-s", "--arg", "task", "review", "-f", str(ROOT / "validate_output.jq")],
                input=raw, capture_output=True,
            )
            self.assertEqual(result.returncode, 0)
        result = self.exercise(outputs={"codex": duplicate})
        self.assert_success(result)
        self.assertIn("last", result["body"])
        self.assertNotIn("first", result["body"])
        self.assertEqual(len(result["writes"]), 1)
        bad = b'{"summary":"ok","comment":"ok","labels":[],"labels":["arbitrary"]}'
        self.assert_failure(self.exercise("triage.yml", outputs={"claude": bad}))

    def exercise(
        self, filename="review.yml", *, outputs=None, agent_exits=None, keys=None, models=None,
        stale_head=False, stale_base=False, initial_head=False, initial_base=False,
        diff_size=100, metadata_size=0, missing_label=False, stale_issue=False,
        corrupt_first_output=None,
    ):
        triage = filename == "triage.yml"
        selected_keys = KEYS | (keys or {})
        selected_models = MODELS | (models or {})
        with tempfile.TemporaryDirectory() as temporary:
            directory = Path(temporary)
            binary_dir = directory / "bin"
            binary_dir.mkdir()
            bundle_dir = directory / ".github/omnigent"
            for asset in ASSETS:
                if asset.endswith("config.yaml") or asset == "validate_output.jq":
                    target = bundle_dir / asset
                    target.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(ROOT / asset, target)
            snapshot = {
                "number": 1, "title": "fixture",
                "body": "x" * metadata_size + 'untrusted $(touch injected) ${GITHUB_TOKEN} `touch injected` "',
                "baseRefOid": "changed-base" if initial_base else "b" * 40,
                "headRefOid": "changed-head" if initial_head else "h" * 40,
                "updatedAt": "2026-10-23T00:00:00Z", "labels": [],
            }
            settings = {
                "snapshot": snapshot, "diff_size": diff_size, "missing_label": missing_label,
                "current_base": "changed-base" if stale_base else "b" * 40,
                "current_head": "changed-head" if stale_head else "h" * 40,
                "current_updated": "changed" if stale_issue else snapshot["updatedAt"],
                "gh_log": str(directory / "gh.jsonl"), "writes_log": str(directory / "writes.jsonl"),
                "agent_log": str(directory / "agents.jsonl"), "posted_body": str(directory / "posted.md"),
                "keys": selected_keys, "models": selected_models, "agent_exits": agent_exits or {},
                "first_output": str(directory / "claude.json"), "corrupt_first_output": corrupt_first_output,
                "outputs": {
                    harness: json.dumps(dict(
                        VALID, summary=harness + " assessment", comment=harness + " finding. No tests were run.",
                        labels=["needs-investigation"] if triage else [],
                    )).encode() for harness in KEYS
                } | (outputs or {}),
            }
            for name, source in (("gh", GH_STUB), ("omnigent", AGENT_STUB)):
                executable = binary_dir / name
                executable.write_text("#!" + sys.executable + "\n" + source.replace("__SETTINGS__", repr(settings)))
                executable.chmod(0o700)
            expressions = {
                "github.token": "workflow-only-token", "github.event.pull_request.number": "1",
                "github.event.issue.number": "1", "github.event.pull_request.base.sha": "b" * 40,
                "github.event.pull_request.head.sha": "h" * 40,
                "secrets.ANTHROPIC_API_KEY": selected_keys["claude"], "secrets.OPENAI_API_KEY": selected_keys["codex"],
                "vars.CLAUDE_MODEL": selected_models["claude"], "vars.CODEX_MODEL": selected_models["codex"],
            }
            environment = {
                "PATH": str(binary_dir) + os.pathsep + os.environ["PATH"], "RUNNER_TEMP": str(directory),
                "GITHUB_WORKSPACE": str(directory), "GITHUB_REPOSITORY": "fixture/repo",
                "GITHUB_TOKEN": "inherited-token-trap", "INHERITED_TRAP": "must-not-reach-agent",
                "LLM_API_KEY": "inherited-model-key-trap", "HOME": str(directory / "old-home"),
            }
            Path(environment["HOME"]).mkdir()
            Path(environment["HOME"], "old-session").write_text("not a fresh home")
            results = []
            for name, step_environment, script in steps(filename)[1:]:
                resolved = {}
                for variable, value in step_environment.items():
                    expression = re.fullmatch(r"\$\{\{ (.+) \}\}", value)
                    resolved[variable] = expressions[expression[1]] if expression else value
                result = subprocess.run(
                    ["/bin/bash", "-c", script], env=environment | resolved,
                    capture_output=True, text=True,
                )
                results.append((name, result))
                if result.returncode:
                    break

            def records(filename):
                path = Path(settings[filename])
                return [json.loads(line) for line in path.read_text().splitlines()] if path.exists() else []

            posted = Path(settings["posted_body"])
            return {
                "results": results, "writes": records("writes_log"), "agents": records("agent_log"),
                "gh_calls": records("gh_log"), "body": posted.read_text() if posted.exists() else None,
            }

    def assert_success(self, result):
        for name, process in result["results"]:
            self.assertEqual(process.returncode, 0, (name, process.stderr))
        self.assertIsNotNone(result["body"])

    def assert_failure(self, result):
        self.assertNotEqual(result["results"][-1][1].returncode, 0)
        self.assertEqual(result["writes"], [])
        self.assertIsNone(result["body"])
        for name, process in result["results"]:
            for secret in (*KEYS.values(), "synthetic", "inherited-model-key-trap", "workflow-only-token"):
                self.assertNotIn(secret, process.stdout + process.stderr, name)

    def test_paired_end_to_end_independence_attribution_and_one_comment(self):
        result = self.exercise()
        self.assert_success(result)
        self.assertEqual([agent["harness"] for agent in result["agents"]], ["claude", "codex"])
        self.assertEqual([agent["model"] for agent in result["agents"]], list(MODELS.values()))
        for field in ("home", "cwd"):
            self.assertEqual(len({agent[field] for agent in result["agents"]}), 2)
        for field in ("metadata", "diff"):
            self.assertEqual(result["agents"][0][field], result["agents"][1][field])
        self.assertEqual([write[:2] for write in result["writes"]], [["pr", "comment"]])
        self.assertEqual(sum(call[0] == "api" for call in result["gh_calls"]), 1)
        self.assertEqual(sum(call[:2] == ["pr", "view"] for call in result["gh_calls"]), 2)
        self.assertEqual(result["body"].count("### Claude Code (claude-sdk)"), 1)
        self.assertEqual(result["body"].count("### Codex (codex)"), 1)
        for text in ("claude assessment", "claude finding", "codex assessment", "codex finding", "b" * 40, "h" * 40):
            self.assertIn(text, result["body"])
        self.assertLess(result["body"].index("claude finding"), result["body"].index("codex finding"))
        self.assert_review_footer(result["body"])
        repeated = self.exercise()
        self.assert_success(repeated)
        self.assertEqual(result["body"], repeated["body"])

    def test_single_end_to_end(self):
        result = self.exercise("review-single.yml")
        self.assert_success(result)
        self.assertEqual([agent["harness"] for agent in result["agents"]], ["claude"])
        self.assertEqual(result["agents"][0]["model"], MODELS["claude"])
        self.assertEqual([write[:2] for write in result["writes"]], [["pr", "comment"]])
        self.assert_review_footer(result["body"])

    def assert_review_footer(self, body):
        expected = f'_Advisory review of base `{"b" * 40}` and head `{"h" * 40}`; verify findings with repository checks._'
        self.assertTrue(body.rstrip().endswith(expected))
        self.assertNotIn("no PR code or tests were executed", body)

    def test_triage_end_to_end_allowlisted_labels(self):
        result = self.exercise("triage.yml")
        self.assert_success(result)
        self.assertEqual([write[:2] for write in result["writes"]], [["issue", "comment"], ["issue", "edit"]])
        self.assertEqual(result["writes"][1][-2:], ["--add-label", "needs-investigation"])
        self.assertEqual(result["agents"][0]["diff"], "")

    def test_either_harness_failure_prevents_publication(self):
        for harness in KEYS:
            with self.subTest(harness=harness):
                result = self.exercise(agent_exits={harness: 1})
                self.assert_failure(result)
                self.assertEqual(len(result["agents"]), 1 if harness == "claude" else 2)

    def test_either_output_validation_failure_prevents_publication(self):
        for harness in KEYS:
            for raw in (b"", b"not JSON", json.dumps(dict(VALID, summary=None)).encode(),
                        json.dumps(dict(VALID, comment=[])).encode(),
                        json.dumps(VALID).encode() * 2, json.dumps(VALID).encode() + b" " * 24000):
                with self.subTest(harness=harness, raw=raw[:65]):
                    self.assert_failure(self.exercise(outputs={harness: raw}))

    def test_second_reviewer_corruption_is_rejected_at_publication(self):
        valid = json.dumps(VALID).encode()
        for corruption in (
            json.dumps(dict(VALID, summary=None)).encode(),
            json.dumps(dict(VALID, comment=[])).encode(),
            valid + valid,
            valid + b" " * 24000,
        ):
            with self.subTest(corruption=corruption[:65]):
                result = self.exercise(corrupt_first_output=corruption)
                self.assertEqual([agent["harness"] for agent in result["agents"]], ["claude", "codex"])
                self.assertEqual(result["results"][-1][0], "Combine and post one validated review")
                self.assert_failure(result)

    def test_either_credential_is_rejected_literally_or_escaped(self):
        for harness, secret in KEYS.items():
            for field in ("summary", "comment"):
                raw = json.dumps(dict(VALID, **{field: secret})).encode()
                escaped = raw.replace(secret.encode(), "".join("\\u%04x" % ord(character) for character in secret).encode())
                for output in (raw, escaped, escaped[:-1] + b" invalid"):
                    with self.subTest(harness=harness, field=field, output=output[:70]):
                        self.assert_failure(self.exercise(outputs={harness: output}))

    def test_missing_or_multiline_keys_and_missing_models_fail_closed(self):
        for harness in KEYS:
            for invalid in ("", "synthetic\npaste"):
                with self.subTest(harness=harness, key=invalid):
                    self.assert_failure(self.exercise(keys={harness: invalid}))
            with self.subTest(harness=harness, model="missing"):
                self.assert_failure(self.exercise(models={harness: ""}))

    def test_pr_revision_guards_at_fetch_and_publication(self):
        for filename in ("review.yml", "review-single.yml"):
            for guard in ("initial_head", "initial_base", "stale_head", "stale_base"):
                with self.subTest(filename=filename, guard=guard):
                    result = self.exercise(filename, **{guard: True})
                    self.assert_failure(result)
                    if guard.startswith("initial"):
                        self.assertEqual(result["agents"], [])
                        self.assertFalse(any(call[0] == "api" for call in result["gh_calls"]))

    def test_input_bounds(self):
        for filename in ("review.yml", "review-single.yml"):
            for size in (0, 60001):
                with self.subTest(filename=filename, diff_size=size):
                    result = self.exercise(filename, diff_size=size)
                    self.assert_failure(result)
                    self.assertEqual(result["agents"], [])
            self.assert_success(self.exercise(filename, diff_size=60000))
        for filename in WORKFLOWS:
            with self.subTest(filename=filename, metadata_size=20000):
                result = self.exercise(filename, metadata_size=20000)
                self.assert_failure(result)
                self.assertEqual(result["agents"], [])

    def test_single_and_triage_failures_prevent_writes(self):
        for filename in ("review-single.yml", "triage.yml"):
            for changes in (
                {"agent_exits": {"claude": 1}}, {"keys": {"claude": "synthetic\npaste"}},
                {"outputs": {"claude": json.dumps(dict(VALID, comment=KEYS["claude"])).encode()}},
                {"outputs": {"claude": json.dumps(dict(VALID, summary=None)).encode()}},
            ):
                with self.subTest(filename=filename, changes=changes):
                    self.assert_failure(self.exercise(filename, **changes))
        self.assert_failure(self.exercise("triage.yml", outputs={"claude": json.dumps(dict(VALID, labels=["arbitrary"])).encode()}))
        self.assert_failure(self.exercise("triage.yml", stale_issue=True))
        self.assert_failure(self.exercise("triage.yml", missing_label=True))

    def test_triage_job_requires_trusted_issue_author_association(self):
        workflow = (ROOT / "triage.yml").read_text()
        condition = (
            "contains(fromJSON('[\"OWNER\",\"MEMBER\",\"COLLABORATOR\"]'), "
            "github.event.issue.author_association)"
        )
        self.assertEqual(
            re.findall(r"^([ \t]*)if: (.+)$", workflow, re.MULTILINE),
            [("    ", condition)],
        )
        self.assertIn(f"jobs:\n  triage:\n    if: {condition}\n    runs-on:", workflow)
        trigger = re.search(r"^on:\n(.*?)(?=^\S)", workflow, re.MULTILINE | re.DOTALL)
        self.assertIsNotNone(trigger)
        self.assertEqual(trigger.group(1), "  issues:\n    types: [opened]\n")

    def test_workflow_contracts_and_shell_syntax(self):
        for filename in WORKFLOWS:
            workflow = (ROOT / filename).read_text()
            run_steps = steps(filename)
            self.assertEqual(len(run_steps), 5 if filename == "review.yml" else 4)
            self.assertIn("persist-credentials: false", workflow)
            self.assertNotIn("continue-on-error", workflow)
            self.assertNotIn("always()", workflow)
            self.assertNotIn("Freeze", workflow)
            self.assertIn("Fetch issue input" if filename == "triage.yml" else "Fetch PR input", workflow)
            self.assertEqual(workflow.count("gh pr comment"), 0 if filename == "triage.yml" else 1)
            if filename != "triage.yml":
                self.assertIn("ref: ${{ github.event.pull_request.base.sha }}", workflow)
                self.assertIn("if: github.event.pull_request.head.repo.full_name == github.repository", workflow)
            for name, environment, script in run_steps:
                subprocess.run(["/bin/bash", "-n"], input=script, text=True, check=True)
                if name.startswith("Run "):
                    self.assertIn("env -i PATH=", script)
                    self.assertNotIn("GH_TOKEN", script)
                    self.assertNotIn("GH_TOKEN", environment)
                    self.assertIn("--no-session", script)
                    self.assertIn(': "${OMNIGENT_MODEL:?', script)
                    self.assertIn('--model "$OMNIGENT_MODEL"', script)
                    if filename != "review.yml":
                        self.assertEqual(environment, {
                            "MODEL_API_KEY": "${{ secrets.ANTHROPIC_API_KEY }}",
                            "OMNIGENT_MODEL": "${{ vars.CLAUDE_MODEL }}",
                            "TASK": "triage" if filename == "triage.yml" else "review",
                        })
            if filename == "review.yml":
                self.assertEqual(run_steps[-1][1], {
                    "GH_TOKEN": "${{ github.token }}", "PR_NUMBER": "${{ github.event.pull_request.number }}",
                })
                self.assertNotIn("MODEL_API_KEY", run_steps[-1][2])
                self.assertEqual(run_steps[2][1], {
                    "MODEL_API_KEY": "${{ secrets.ANTHROPIC_API_KEY }}", "OMNIGENT_MODEL": "${{ vars.CLAUDE_MODEL }}",
                })
                self.assertEqual(run_steps[3][1], {
                    "MODEL_API_KEY": "${{ secrets.OPENAI_API_KEY }}", "OMNIGENT_MODEL": "${{ vars.CODEX_MODEL }}",
                })
            self.assertNotIn("vars.OMNIGENT_MODEL", workflow)
        subprocess.run(["/bin/bash", "-n", str(ROOT / "sync-public.sh")], check=True)

    def test_public_downloads_are_byte_equal(self):
        public = ROOT.parents[1] / "public/examples/github-actions"
        actual = {path.relative_to(public).as_posix() for path in public.rglob("*") if path.is_file()}
        self.assertEqual(actual, set(ASSETS))
        for asset in ASSETS:
            with self.subTest(asset=asset):
                self.assertEqual((ROOT / asset).read_bytes(), (public / asset).read_bytes())

    def test_sync_script_copies_all_assets_and_is_repeatable(self):
        with tempfile.TemporaryDirectory() as temporary:
            example = Path(temporary) / "examples/github-actions"
            shutil.copytree(ROOT, example, ignore=shutil.ignore_patterns("__pycache__"))
            for _ in range(2):
                subprocess.run(["/bin/bash", str(example / "sync-public.sh")], check=True)
            public = Path(temporary) / "public/examples/github-actions"
            self.assertEqual({path.relative_to(public).as_posix() for path in public.rglob("*") if path.is_file()}, set(ASSETS))
            for asset in ASSETS:
                self.assertEqual((example / asset).read_bytes(), (public / asset).read_bytes())

    def test_documentation_links_mirrors_bundles_and_headings(self):
        page = (ROOT.parents[1] / "app/docs/programmatic/github-actions/page.mdx").read_text()
        prose = re.sub(r"(?ms)^```[^\n]*\n.*?^```[ \t]*(?:\n|$)", "", page)
        self.assertEqual(re.findall(r"^## (.*)$", prose, re.MULTILINE), [
            "How it works", "Before you start", "Set up Omnigent", "Connect inputs and outputs", "Examples", "Going further",
        ])
        setup = prose.split("## Set up Omnigent\n", 1)[1].split("## Connect inputs and outputs\n", 1)[0]
        self.assertEqual(re.findall(r"^### (.*)$", setup, re.MULTILINE), [
            "Install Omnigent", "Configure credentials", "Choose an agent", "Run a task",
        ])
        main, further = prose.split("## Going further\n", 1)
        main = re.sub(r"\s+", " ", main)
        further = re.sub(r"\s+", " ", further)
        for detail in ("job secrets", "files later steps trust", "Busy base branches", "write-token publisher"):
            self.assertNotIn(detail, main)
            self.assertIn(detail, further)
        examples = prose.split("## Examples\n", 1)[1].split("## Going further\n", 1)[0]
        self.assertEqual(re.findall(r"^### (.*)$", examples, re.MULTILINE), ["PR review by Claude Code and Codex", "Issue triage"])
        opening = prose.split("# Configure Omnigent in GitHub Actions", 1)[1].split("## How it works", 1)[0]
        self.assertIn("illustrates them with two examples: a pull request (PR) review by Claude Code\nand Codex, and issue triage.", opening)
        self.assertNotIn("/examples/github-actions/", page)
        for route in ("pr-review", "issue-triage"):
            self.assertIn("/docs/programmatic/github-actions/" + route, page)
        review = (ROOT.parents[1] / "app/docs/programmatic/github-actions/pr-review/page.mdx").read_text()
        triage = (ROOT.parents[1] / "app/docs/programmatic/github-actions/issue-triage/page.mdx").read_text()
        for asset in (*WORKFLOWS, "validate_output.jq"):
            self.assertIn('file="' + asset + '"', review + triage)
        for match in re.finditer(r'file="([^"]+)"', review + triage):
            self.assertTrue((ROOT / match[1]).is_file())
        publication = re.search(r'```bash\n(jq -n -r --slurpfile claude.*?)\n```', page, re.DOTALL)[1]
        source_script = steps("review.yml")[-1][2]
        render, post = publication.split('gh pr comment', 1)
        self.assertIn(render.rstrip(), source_script)
        self.assertIn('gh pr comment' + post, source_script)

        self.assertNotIn("validate_output.py", page)
        self.assertIn('omnigent run --harness codex --model "$CODEX_MODEL"', page)
        self.assertIn("workflow's own contract", page)
        self.assertIn("no model synthesizes the reviews", page)
        self.assertNotIn('<div className="note">', setup)
        for harness in ("claude", "codex", "gateway"):
            config = (ROOT / harness / "config.yaml").read_text()
            self.assertTrue(config.startswith("spec_version: 1\n"))
            self.assertIn("  cwd: .\n", config)
            self.assertNotIn("${CI_CONTEXT_DIR}", config)
            self.assertNotIn("state that no tests were run", config)
            self.assertIn("Do not run proposed code", config)
            self.assertIn("For review: cite file/changed-line evidence and leave labels empty.", config)
            self.assertIn("Do not approve or merge a change.", config)
            self.assertFalse((ROOT / (harness + ".yaml")).exists())
            self.assertIn('file="' + harness + '/config.yaml"', review)
        self.assertIn('labels={["Claude Code", "Codex"]}', page)
        self.assertNotIn("omnigent/claude.yaml", page)
        self.assertNotIn("omnigent/codex.yaml", page)


if __name__ == "__main__":
    unittest.main(verbosity=2)
