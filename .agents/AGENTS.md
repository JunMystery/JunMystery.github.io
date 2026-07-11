# Agent Rules - 8 Core Guidelines for Development

These 8 rules must be followed for every single command, file read, code edit, and implementation in this workspace:

1. **Context First**: Always call `task_pipeline` or `project_context` to gather optimized state BEFORE any file reads or edits.
2. **Standards Check**: Invoke `guidance(operation="search")` to check standards BEFORE writing code or answering design queries.
3. **Token Budget**: Keep interactions token-efficient. Prefer MCP tool summaries over reading large raw files.
4. **No Direct FS**: Never manually search or list files if the corresponding context can be loaded through MCP tools.
5. **Ground & Plan**: Verify file paths, functions, and symbols via search tools before proposing code changes. Never guess.
6. **300 LOC Cap**: Split any file exceeding 300 lines of code into modular files with clean separations.
7. **DRY & Reusability**: Never duplicate UI, style rules, logic configurations, or structures. Centralize shared systems.
8. **Surgical Changes**: Touch only what is strictly required to fulfill the request. Do not refactor adjacent working code.
