# website
social media marketing

Changes from collaborators will appear in your local workspace after you run `git fetch` and `git pull` (or `git pull --rebase`). Your editor will reflect the updated files immediately once the pull completes and the working tree is updated.

Common commands:

```bash
# Fetch updates
git fetch origin

# Pull and rebase to integrate remote changes (keeps history linear)
git pull --rebase origin main

# If you have uncommitted work, stash it first:
# git stash push -m "WIP"
# git pull --rebase origin main
# git stash pop
```
