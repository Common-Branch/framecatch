# Contributing

## Setup

Currently there are no files to install. This section will get updated when the tech stack is chosen.

## Branches

Branch names use the format `type/short-description`.

The type is one of the following prefixes:

- `feat`: add something the user can see or use
- `fix`: repair a bug
- `docs`: change only documentation
- `refactor`: restructure code without changing what it does
- `chore`: do maintenance such as dependencies, config, build setup

The part after the prefix needs to be short and lowercase, with words joined by hyphens.

Examples: `fix/hotkey-crash`, `feat/screen-capture`, `docs/readme`.

## Commits

Commit messages use the format `type: short description`.

- Use the same prefixes as branches.
- Write the description in lowercase.
- Write it as a command: "add", not "added" or "adds".
- Do not end it with a period.

Examples:

```
feat: add full-screen capture hotkey
fix: stop crash when no monitor is detected
docs: add contributing guidelines
```

## Pull requests

- Pushing to `main` is not allowed. All work happens on a branch.
- Every pull request is reviewed by the other person, not by its author.
- After approval, the author merges it using squash merge.
- The branch is deleted after merging.

## Code style

To be decided when the tech stack is chosen.

## Docs

Docs are updated in the same pull request as the code they describe.

Writing rules:

- English only. Short, plain sentences. No em dashes, no emojis, no badges.
- One `#` title per file. Sections use `##`, subsections use `###`.
- Headings use sentence case: "Building from source", not "Building From Source".
- Bullets use `-`. Numbered lists are only for steps that happen in order.
- Commands and code go in code blocks. File names and commands inside a sentence go in backticks.
- The project is written "Framecatch" in sentences and `framecatch` in commands and paths.
- Links to other files in the repo are relative.