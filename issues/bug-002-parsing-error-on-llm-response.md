# BUG-002: Parsing error on LLM response

## Status

- [x] Open
- [ ] In Progress
- [ ] Resolved
- [ ] Won't Fix

## Details

- **Created**: 2025-02-26
- **Priority**: Low
- **Affects**:
  - `@lib/workflow-manager.ts`

## Description

When the LLM responds, a console error occurs on the frontend about a failure to parse something.
_Does not crash the app or cause any failures in document generation._
Needs investigation.

## Steps to Reproduce

1. Open the dev tools in the frontend
2. Answer one of the questions
3. Look at the console logs

## Expected Behavior

Parsing the response should not cause any errors.

## Possible Solution

<!-- Ideas on how to fix it (optional)... -->

## Notes

<!-- Additional context, thoughts, or related information... -->

## Resolution

<!-- When fixed, note how it was resolved... -->
