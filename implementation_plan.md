# Feature Implementation: Report Listing & API Restoration

## Goal Description
The goal is to finalize the frontend implementation of the "Report Listing" feature. During analysis, it was discovered that `client/src/lib/api.js` is incomplete, missing a base `api` helper and exports for `userAPI` and `cartAPI`. This blocks the report feature (and others). The plan includes restoring the API layer and verifying the reporting workflow.

## User Review Required
> [!IMPORTANT]
> `client/src/lib/api.js` requires reconstruction. I will infer the missing methods based on usage in `ListingDetail.jsx` and `Bookmarks.jsx`.

## Proposed Changes

### Client Shared Library
#### [MODIFY] [api.js](file:///f:/Business-Listing-Final/client/src/lib/api.js)
- Re-implement the `api` helper function using `fetch`.
- Restore `userAPI` with `toggleBookmark`, `getBookmarks` etc.
- Restore `cartAPI` with `addToCart`, `getCart` etc.
- Restore `authAPI` with `login`, `register`, `logout`, `getMe`.
- Ensure `listingAPI` remains correct.

### Frontend Components
#### [VERIFY] [ListingDetail.jsx](file:///f:/Business-Listing-Final/client/src/pages/ListingDetail.jsx)
- Verify `handleReport` uses `listingAPI.reportListing` correctly.
- Verify imports match the restored `api.js`.

## Verification Plan

### Manual Verification
1.  **Report Feature**: Navigate to listing, click Report, submit reason, verify success toast.
2.  **API Check**: Verify bookmark toggle works.
