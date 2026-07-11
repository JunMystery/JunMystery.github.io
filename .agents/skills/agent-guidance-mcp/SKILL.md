---
name: agent-guidance-mcp-rules
description: Enforcement workflow for the 8 core development rules in this workspace.
---

# 8 Core Development Rules Enforcement

Ensure that every single step of execution checks off these 8 rules:

1. **Context First**:
   - Run `task_pipeline` or `project_context` before reading files.
2. **Standards Check**:
   - Run `guidance(operation="search")` before implementing features.
3. **Token Budget**:
   - Rely on high-level MCP outputs rather than parsing raw codeblocks.
4. **No Direct FS**:
   - Utilize MCP server lookup tools for codebase searches.
5. **Ground & Plan**:
   - Verify every file and folder exist prior to drafting implementation plans.
6. **300 LOC Cap**:
   - Any file exceeding 300 LOC must be modularly split immediately.
7. **DRY & Reusability**:
   - Eliminate duplicated copies or visual styling assets.
8. **Surgical Changes**:
   - Edit exclusively requested lines of code.
