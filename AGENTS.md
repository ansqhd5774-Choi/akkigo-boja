# GitHub write discipline

- Permission, capability, existence, and branch-state checks must be read-only. Do not create temporary branches, refs, files, commits, or workflow runs as probes.
- Before a direct branch write, read the target branch HEAD once immediately before building the commit. Update the branch with an expected-SHA lease; if the lease fails, refresh the HEAD and rebuild instead of forcing or retrying the stale commit.
- A source push owns exactly one Verify path. Do not manually dispatch Verify after a push that already triggers `verify.yml`.
- A successful Verify owns Worker deployment through `workflow_run`. Do not manually dispatch Deploy from staging workflows when the automatic chain applies.
- Publish-request-only commits should reuse the verified source parent through the existing reuse logic instead of scheduling another full Verify.
- Do not add extra validators solely for these rules. Prefer removing duplicate mutation or orchestration paths at their source.
