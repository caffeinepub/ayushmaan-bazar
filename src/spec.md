# Specification

## Summary
**Goal:** Fix the build/deploy failure by removing deprecated admin actor initialization usage and ensuring the frontend actor calls match the deployed backend candid interface.

**Planned changes:**
- Replace all non-immutable imports/usages of `frontend/src/hooks/useActor.ts` with `frontend/src/hooks/useAppActor.ts` for actor creation across the frontend.
- Remove any non-immutable references to the URL parameter `caffeineAdminToken` and any calls to `actor._initializeAccessControlWithSecret(...)`.
- Align frontend actor interface usage with methods that exist in `backend/main.mo` so the frontend compiles cleanly and does not call missing backend methods at runtime.
- Verify authenticated flows continue working (save profile, submit lead, request callback, view rewards) without any admin/access-control secret initialization from the frontend.
- Confirm clean production frontend build and clean canister build/deploy succeed with the updated codebase.

**User-visible outcome:** The app deploys successfully and runs without admin-token initialization, while anonymous and authenticated user flows continue to work normally.
