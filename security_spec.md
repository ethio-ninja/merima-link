# Security Specification: Dubai Job Connect

## Data Invariants
1. A **User** profile must have a valid role ('seeker' or 'employer').
2. A **Job** must be linked to the `employerId` of the creator.
3. An **Application** must link a valid `jobId` and `seekerId`.
4. Role-based access:
   - Only 'seeker' users can apply for jobs.
   - Only 'employer' users can post jobs.
   - Employers can only see applications for jobs they posted.

## The "Dirty Dozen" Payloads (Denial Tests)
1. **Identity Spoofing**: Attempt to create a user profile with `uid` that doesn't match `request.auth.uid`.
2. **Role Escalation**: A 'seeker' trying to post a job.
3. **Ghost Job Update**: A user trying to update a job they didn't post.
4. **Shadow Field Injection**: Adding an `isVerified: true` field to a job posting to trick the UI.
5. **Cross-User Application Access**: A seeker trying to read another seeker's applications.
6. **Illegal Status Transition**: A seeker trying to change their application status to 'Accepted'.
7. **Junk ID Attack**: Using a 2KB string as a `jobId`.
8. **PII Leak**: An unauthorized user trying to list all user profiles and their emails.
9. **Creation Timestamp Spoof**: Sending a `postedAt` date from the future.
10. **Employer Impersonation**: A seeker trying to update a job's `employerId`.
11. **Application Forgery**: Creating an application for a different user.
12. **Deleted Resource Orphan**: Trying to apply to a job that has `isActive: false`.

## Conflict Report
- Identity Spoofing: Blocked by `auth.uid` checks in `isValidUser` and `match` blocks.
- State Shortcutting: Blocked by `affectedKeys().hasOnly()` status checks for applications.
- Resource Poisoning: All string inputs restricted via `.size()` checks.
