# Slurping requires exactly one JSON object; jq rejects parse failures.
# Check the strings used to render Markdown and prevent decoded key disclosure.
def no_secret:
  . as $text | [env.MODEL_API_KEY, env.LLM_API_KEY]
  | all(. == null or . == "" or (. as $key | $text | contains($key) | not));
length == 1 and (.[0] |
  type == "object"
  and (.summary | type == "string") and (.comment | type == "string")
  and (.summary | no_secret) and (.comment | no_secret)
  and (if $task == "triage" then
    .labels | type == "array"
    and all(. == "bug" or . == "documentation" or . == "needs-investigation")
  else $task == "review" end)
) | if . then true else error("Invalid agent output; nothing will be posted") end
