export const githubActionsFlow = `flowchart LR
    E["PR event"] --> C["Collect diff"]
    C --> A["Run Omnigent"]
    A --> V["Check for credentials"]
    V --> P["Post review"]
  `;
