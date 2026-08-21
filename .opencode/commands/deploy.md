\---

description: Deploy approved DOJ MEDIA portfolio changes to GitHub and Vercel.

agent: build

\---



Deploy the current DOJ MEDIA portfolio changes.



Follow these steps:



1\. Run `git status` to inspect the current changes.

2\. Run `git diff` to review the changes.

3\. If there are no changes, report that there is nothing to deploy.

4\. Do not modify unrelated files.

5\. Do not commit `.env`, `.env.local`, API keys, passwords, access tokens, or other secrets.

6\. Stage the intended changes with `git add`.

7\. Create a clear commit message describing the changes.

8\. Commit the changes.

9\. Push the commit to the `main` branch using `git push origin main`.

10\. Confirm that the push succeeded.

11\. Tell the user that Vercel should automatically deploy the new commit.

