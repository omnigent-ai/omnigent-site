export const githubActionsFlow = `flowchart LR
    T["Event"] --> C["Workflow gathers context"]
    C --> A["Omnigent · headless agent execution"]
    A --> O["Workflow validates output"]
    O --> G["Workflow acts on GitHub"]
    style A fill:#dbeafe,stroke:#2563eb,stroke-width:3px,color:#111827
  `;
