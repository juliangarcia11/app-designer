# BUG-001: Answering clarifications may not update documents

## Status

- [x] Open
- [ ] In Progress
- [ ] Resolved
- [ ] Won't Fix

## Details

- **Created**: 2025-02-26
- **Priority**: High
- **Affects**:
  - `@/components/design-document-view.tsx`
  - `@/lib/config.ts`
  - `@/lib/workflow-manager.ts`

## Description

Occasionally clarifying questions are added to the requirements by the LLM but answering them does not always trigger
the regeneration of the documents that rely on that clarification.

## Steps to Reproduce

1. Use the `@/mocks/answers.ts` to answer the requirement questions
2. Redo the above until more than 5 questions end up in the requirements (meaning the LLM added some)
3. View the generated documents before finishing the questions
4. Answer the final questions
5. View the genrated documents again and note how they haven't changed & some are still stuck in a "Needs Clarification" state

## Expected Behavior

When a clarification question is asked & answered, the related inner document should be regenerated/updated.
The state badge should be updated to "complete" afterwards.

## Actual Behavior

Inner documents stay stuck in the "needs clarification" state.

## Possible Solution

<!-- Ideas on how to fix it (optional)... -->

## Notes

<!-- Additional context, thoughts, or related information... -->

## Resolution

<!-- When fixed, note how it was resolved... -->
