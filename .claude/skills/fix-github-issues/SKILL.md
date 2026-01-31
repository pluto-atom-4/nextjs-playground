---
name: fix-github-issues
description: End-to-end GitHub issue fixing workflow - checkout main, sync remote, create feature branch, analyze issues, implement fixes, commit changes, and create pull requests
license: MIT
---

# Fix GitHub Issues - Automated Workflow

Automates the complete GitHub issue resolution workflow for the nextjs-playground project. Checks out main branch, syncs with remote, retrieves open issues, creates appropriately-named fix branches, analyzes issues, implements fixes, handles pre-commit hooks, pushes commits, and creates pull requests with GitHub CLI.

## Key Features

- **Branch Management**: Checkout and sync main branch with remote automatically
- **Issue Retrieval**: List and retrieve open GitHub issues from repository
- **Issue Selection**: Select specific issue or batch of issues to address
- **Fix Branches**: Create fix branches with proper naming convention (`fix/*`)
- **Code Analysis**: Analyze issue requirements and relevant source code
- **Implementation**: Implement minimal, focused fixes addressing issue requirements
- **Pre-commit Handling**: Intelligently handle pre-commit hook errors
- **Git Workflow**: Stage, commit, and push changes to remote
- **PR Creation**: Create pull requests with detailed descriptions via GitHub CLI
- **Batch Support**: Handle multiple related issues in single PR

## Workflow Steps

1. **Checkout and sync** main branch with remote
2. **Retrieve** list of open GitHub issues
3. **Select** issue(s) to fix (single or batch)
4. **Create** appropriately-named fix branch
5. **Analyze** issue requirements and code
6. **Implement** minimal fixes addressing requirements
7. **Stage** changes using git add
8. **Commit** with descriptive message referencing issues
9. **Inspect** pre-commit phase errors
10. **Resolve** pre-commit issues (bypass if pre-existing)
11. **Push** branch to remote
12. **Create** pull request with full description

## Usage Patterns

### Basic Usage
```
/fix-github-issues
```
Interactively select issue(s) to fix.

### Single Issue
```
/fix-github-issues Issue #14
```
Fix specific issue number 14.

### Multiple Issues
```
/fix-github-issues Issue #14,#15
```
Fix related issues 14 and 15 in single branch and PR.

### Batch Issues
```
/fix-github-issues Issue #14,#15,#16
```
Fix multiple related issues together.

## Branch Naming Convention

- **Format**: `fix/[descriptive-name]`
- **Derived From**: Issue title or primary issue scope
- **Examples**:
  - `fix/quiz-card-positioning`
  - `fix/navbar-responsive-layout`
  - `fix/authentication-flow`
  - `fix/database-connection-timeout`
- **Rules**:
  - Lowercase letters only
  - Hyphens separate words
  - Concise but descriptive
  - References issue content

## Commit Message Format

```
fix: [brief description of changes]

- [Detailed change 1]
- [Detailed change 2]
- Fixes #14
- Fixes #15
```

- **Summary**: Brief description prefixed with `fix:`
- **Body**: Detailed list of changes
- **References**: Include issue number(s) with `Fixes` keyword

## Pull Request Content

- **Summary**: Explanation of fixes addressing issue(s)
- **Issue Links**: Link to GitHub issue(s) being resolved
- **Changes Made**: List of files modified and changes made
- **Testing Verification**: How the fix was tested
- **Related Considerations**: Any related concerns or notes

## Git Workflow Commands

### Checkout and Sync
```bash
git checkout main
git pull origin main
```

### Create Fix Branch
```bash
git checkout -b fix/[descriptive-name]
```

### Stage Files
```bash
git add [modified files]
```

### Commit
```bash
git commit -m "[descriptive message]"
```

### Push to Remote
```bash
git push origin fix/[descriptive-name]
```

### Create Pull Request
```bash
gh pr create --title "[title]" --body "[description]"
```

## Pre-commit Hook Handling

### Strategy
Analyze pre-commit errors to determine origin:
1. Check if errors are related to current changes
2. If errors are pre-existing (not caused by changes):
   - Use `--no-verify` flag to bypass hooks
   - Document in commit that pre-existing issues exist
3. If errors are caused by changes:
   - Fix the issues
   - Re-commit without `--no-verify`

### Bypass Command
```bash
git commit -m "message" --no-verify
```

## GitHub CLI Commands

### List Open Issues
```bash
gh issue list --state open
```

### View Issue Details
```bash
gh issue view [issue_number]
```

### Create Pull Request
```bash
gh pr create --title "title" --body "body"
```

### View Pull Request
```bash
gh pr view [pr_number]
```

## Error Handling

### TypeScript Errors
- **Type**: Pre-existing (usually)
- **Action**: Bypass with `--no-verify`
- **Reason**: Not caused by current changes

### Linting Errors
- **Type**: Depends on error source
- **Action**: Fix if caused by changes, bypass if pre-existing
- **Reason**: Verify error origin first

### Git Conflicts
- **Type**: Blocking
- **Action**: Resolve manually before proceeding
- **Reason**: Must be fixed before pushing

### Branch Already Exists
- **Action**: Delete local/remote branch first
- **Command**: `git branch -D [branch] && git push origin :[branch]`

### Cannot Create PR - Branch Not on Remote
- **Action**: Push branch first
- **Command**: `git push origin [branch]`

### Pre-commit Hook Blocks Commit
- **Action**: Check if error is from current changes
- **Solution**: Use `--no-verify` if pre-existing

### No GitHub CLI Authentication
- **Action**: Authenticate GitHub CLI
- **Command**: `gh auth login`

### Cannot Checkout Main - Local Changes
- **Action**: Stash or commit local changes first
- **Commands**: `git stash` or `git commit`

## Success Criteria

- ✅ Branch created with proper naming
- ✅ Changes committed with descriptive message
- ✅ Commit pushed to remote
- ✅ Pull request created successfully
- ✅ PR includes links to resolved issues
- ✅ No uncommitted changes remain
- ✅ Code quality passes pre-commit checks

## Edge Cases

### No Open Issues Found
- **Message**: "No open issues found in repository"
- **Action**: Prompt user to check GitHub

### Multiple Issues
- **Message**: "Multiple issues can be fixed in single PR"
- **Action**: Create combined fix branch and PR

### Pre-commit Failures
- **Message**: "Pre-commit hook may block commit"
- **Action**: Analyze error origin and use `--no-verify` if appropriate

## Best Practices

- ✅ Always sync main before creating fix branch
- ✅ Use descriptive branch names derived from issue content
- ✅ Keep commits focused on single issue or related issues
- ✅ Write detailed commit messages with issue references
- ✅ Review PR description before submission
- ✅ Test fixes locally before pushing
- ✅ Use pull request template if available
- ✅ Link related issues in PR description
- ✅ Keep changes minimal and focused
- ✅ Document any pre-existing issues bypassed

## Setup Instructions

1. **Authenticate GitHub CLI:**
   ```bash
   gh auth login
   ```

2. **Verify Git configuration:**
   ```bash
   git config --list
   ```

3. **Verify repository access:**
   ```bash
   gh issue list
   ```

4. **Confirm branch permissions:**
   ```bash
   git branch -a
   ```

## Verification Checklist

- [ ] Main branch checked out and synced
- [ ] GitHub credentials valid
- [ ] Fix branch created with proper naming
- [ ] Code changes minimal and focused
- [ ] Commit message descriptive
- [ ] Changes pushed to remote
- [ ] Pull request created
- [ ] PR includes issue references
- [ ] No uncommitted changes

## Known Limitations

- Cannot autonomously decide fix approach (requires analysis)
- Pre-commit hook bypass requires developer judgment
- Some fixes may require manual intervention
- Large diffs may need careful review
- Network connectivity required for remote operations

## Troubleshooting

**Branch already exists**
- Delete local/remote branch first: `git branch -D [branch] && git push origin :[branch]`

**Cannot create PR - branch not on remote**
- Push branch first: `git push origin [branch]`

**Pre-commit hook blocks commit**
- Check if error is from current changes
- Use `--no-verify` if pre-existing: `git commit --no-verify -m "message"`

**No GitHub CLI authentication**
- Authenticate: `gh auth login`

**Cannot checkout main - local changes**
- Stash or commit: `git stash` or `git commit`

## Future Enhancements

- Automated fix suggestions based on issue analysis
- Pre-commit hook customization
- Batch processing multiple issues
- Automated testing before PR creation
- PR review assignment automation
- Issue template parsing for better context
- Conflict resolution assistance
- Automatic code review based on issue type

## Integration Notes

- Works with existing GitHub CLI tools
- Compatible with Git workflow
- Respects pre-commit hooks
- Integrates with PR templates
- Compatible with branch protection rules

## Related Documentation

- GitHub CLI docs: https://github.com/cli/cli
- Git documentation: https://git-scm.com/docs
- Project instructions: `.github/copilot-instructions.md`
