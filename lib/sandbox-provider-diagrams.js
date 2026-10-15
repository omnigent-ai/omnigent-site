export const managedSandboxLifecycle = `sequenceDiagram
    actor User
    participant Core as Omnigent server
    participant Provider as Provider launcher
    participant Sandbox as Remote sandbox

    User->>Core: Request managed session
    Core->>Provider: prepare()
    Provider-->>Core: Preflight ready
    Core->>Provider: provision(name)
    Provider-->>Core: sandbox_id
    Note over Provider,Sandbox: If creation fails, the provider cleans any partial allocation
    Core->>Core: Register host identity and launch token
    Core->>Provider: start_host(sandbox_id, token, ...)
    Provider->>Sandbox: Start omnigent host

    alt Host connects before timeout
        Sandbox->>Core: Register with host identity and token
        Core-->>User: Host online — session runs

        alt Provider idle-stops the sandbox
            Provider->>Sandbox: Stop compute and retain workspace
            User->>Core: Send the next message
            Core->>Provider: resume(sandbox_id)
            Provider->>Sandbox: Restore the same sandbox and workspace
            Core->>Core: Re-arm launch token
            Core->>Provider: start_host(..., repos=())
            Provider->>Sandbox: Restart omnigent host
            Sandbox->>Core: Reconnect
            Note over Core,Sandbox: A failed wake preserves the sandbox and workspace for another retry
        else Session deleted or stale reaper runs
            Core->>Core: Revoke token and delete or detach generation
            Core->>Provider: terminate(sandbox_id)
            Provider->>Sandbox: Release compute
        end
    else Startup fails or online wait times out
        Core->>Core: Revoke token and delete failed generation
        Core->>Provider: terminate(sandbox_id)
        Provider->>Sandbox: Release compute
    end

    Note over Core,Provider: terminate() is idempotent — transient failures remain pending and retry later`;
