import Link from "next/link";

export const metadata = { title: "Custom Policies" };

export default function Page() {
  return (
    <>
      <h1>Custom Policies</h1>

      <p>
        When the <Link href="/docs/policies/builtin">builtin policies</Link> don&apos;t cover your
        use case, you can write your own in Python, register them on the server, and your omnigent
        can use them just like builtins.
      </p>

      <h2>1. Write a policy function</h2>

      <p>
        A policy is a Python function that receives an event and returns <code>ALLOW</code>,{" "}
        <code>ASK</code>, <code>DENY</code>, or <code>None</code> (no opinion):
      </p>

      <pre>
        <code>
          {`from omnigent.policies.schema import PolicyEvent, PolicyResponse

def my_policy(event: PolicyEvent) -> PolicyResponse | None:
    if event["type"] != "tool_call":
        return None
    if event["data"]["name"] == "dangerous_tool":
        return {"result": "DENY", "reason": "Blocked."}
    return {"result": "ALLOW"}`}
        </code>
      </pre>

      <p>
        If your policy needs parameters, use the factory pattern. The function takes config and
        returns the evaluator:
      </p>

      <pre>
        <code>
          {`def block_domains(blocked_domains: list[str]) -> callable:
    blocked = frozenset(d.lower() for d in blocked_domains)

    def evaluate(event: PolicyEvent) -> PolicyResponse | None:
        if event["type"] != "tool_call":
            return None
        url = event["data"]["arguments"].get("url", "")
        for domain in blocked:
            if domain in url.lower():
                return {"result": "DENY", "reason": f"Domain {'{'}domain{'}'} blocked."}
        return {"result": "ALLOW"}

    return evaluate`}
        </code>
      </pre>

      <h2>2. Register on the server</h2>

      <p>
        To make your policy discoverable by your omnigent and visible in the UI, do two things:
      </p>

      <p>
        <strong>Export a <code>POLICY_REGISTRY</code></strong> from your module:
      </p>

      <pre>
        <code>
          {`# myorg/policies.py

POLICY_REGISTRY = [
    {
        "handler": "myorg.policies.block_domains",
        "kind": "factory",
        "name": "Block Domains",
        "description": "Block web access to specific domains.",
        "params_schema": {
            "type": "object",
            "properties": {
                "blocked_domains": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Domains to block"
                }
            },
            "required": ["blocked_domains"]
        }
    }
]`}
        </code>
      </pre>

      <p>
        <strong>Add the module to your server config:</strong>
      </p>

      <pre>
        <code>
          {`# config.yaml
policy_modules:
  - myorg.policies`}
        </code>
      </pre>

      <p>
        Once registered, your custom policies appear alongside the builtins. Your omnigent can
        select them when you ask it to add a policy in chat, and they show up in the UI settings
        panel.
      </p>

      <h2>3. Use it</h2>

      <p>
        Once registered, your custom policy works the same as any builtin. See{" "}
        <Link href="/docs/policies/overview#adding-a-policy">Adding a policy</Link> for all the
        ways to apply it (chat, omnigent YAML, or server config).
      </p>

      <h2>Reference: PolicyEvent</h2>

      <p>
        Every policy receives a <code>PolicyEvent</code> dict. Use the <code>type</code> field to
        filter which events you care about:
      </p>

      <table>
        <thead>
          <tr>
            <th>Event type</th>
            <th>When it fires</th>
            <th>Key data fields</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>tool_call</code></td>
            <td>Omnigent is about to call a tool</td>
            <td><code>name</code>, <code>arguments</code></td>
          </tr>
          <tr>
            <td><code>llm_request</code></td>
            <td>Omnigent is about to send a message to the LLM</td>
            <td><code>messages</code>, <code>model</code></td>
          </tr>
        </tbody>
      </table>

      <p>
        Return <code>None</code> for event types you don&apos;t handle.
      </p>
    </>
  );
}
