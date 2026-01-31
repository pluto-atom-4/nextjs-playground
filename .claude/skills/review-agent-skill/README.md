# Review Agent Skill

An automated **skill validation agent** for reviewing agent skills against a comprehensive verification checklist. Ensures production-ready quality standards.

**Status:** ✅ Production Ready  
**Last Updated:** January 30, 2026

---

## Overview

The Review Agent Skill provides automated quality assurance for agent skills using a standardized, feature-agnostic verification checklist with 50+ validation criteria across 18 categories.

**Key Features:**
- ✅ 18 validation categories
- ✅ 50+ verification checkpoints  
- ✅ Feature-agnostic criteria
- ✅ Severity-based findings
- ✅ Actionable recommendations
- ✅ Detailed validation reports

---

## Quick Start

### Using the Review Agent

1. Prepare your skill with `SKILL.md` file (Markdown with YAML frontmatter)
2. Request validation: "Review my skill using the review-agent-skill checklist"
3. Review the validation report with findings and recommendations
4. Address issues by severity
5. Re-run review to verify fixes

⚠️ **Important**: Skills must use `SKILL.md` format (Markdown), NOT `skill.yaml` (YAML)

---

## Verification Criteria

The Review Agent validates 18 categories:

### Core Categories

1. **Documentation** - README.md, SKILL.md (Markdown with YAML frontmatter), architecture, components, setup
2. **Architecture** - Data flow, components, state management, separation of concerns
3. **TypeScript & Code Quality** - Typing, strict mode, interfaces, imports
4. **State Management** - Approach, organization, persistence, fallbacks
5. **File Structure** - Organization, naming, grouping, conventions
6. **Error Handling** - Scenarios, fallbacks, messages, graceful degradation
7. **Accessibility** - Dark mode, keyboard nav, mobile, ARIA, focus
8. **Testing** - Checklist, scenarios, edge cases, performance, browser matrix
9. **Performance** - Load time, memory, caching, optimization
10. **Browser Compatibility** - Supported browsers, versions, features
11. **Dependencies** - Listing, versions, required vs optional, security
12. **Component Design** - Props typing, responsibility, reusability
13. **Route Configuration** - Mapping, patterns, layouts, parameters
14. **Database Schema** - Models, fields, relationships, constraints
15. **Data Format** - Specification, examples, parsing, validation
16. **Setup & Environment** - Installation, configuration, variables
17. **Troubleshooting** - Issues, solutions, debug steps, FAQ
18. **General Quality** - Overall accuracy and completeness

---

## Validation Report Structure

Reports include:

- **Validation Status** - ✅ Valid / ⚠️ Issues / ❌ Critical
- **Strengths** - What's working well
- **Observations** - Low-severity findings
- **Verification Checklist** - Results for 50+ items
- **Recommendations** - Actionable improvements by severity
- **Conclusion** - Production readiness assessment

### Severity Levels

| Level | Action | Timeline |
|-------|--------|----------|
| 🔴 Critical | Fix before release | Immediate |
| 🟠 High | Address before release | This sprint |
| 🟡 Medium | Consider next iteration | Next sprint |
| 🔵 Low | Nice-to-have improvements | When possible |
| ⚪ Info | For awareness | As needed |

---

## How It Works

### Validation Pipeline

```
Skill Files → Parse → Apply Checklist → Categorize → Generate Report
                       (50+ criteria)    (Severity)
```

### Process Steps

1. **Preparation** - Prepare SKILL.md file (Markdown with YAML frontmatter) with clear descriptions
2. **Request Review** - Ask agent to validate using this skill
3. **Receive Report** - Get detailed findings with recommendations
4. **Address Issues** - Fix critical and high-severity items
5. **Iterate** - Re-validate to verify improvements

---

## Key Principles

### 1. Feature-Agnostic Validation
Criteria apply to any skill regardless of technology, use case, or domain.

### 2. Production-Focused
Emphasizes production readiness: documentation, error handling, performance, compatibility.

### 3. Severity-Based
Not all findings equally important - prioritize by severity level.

### 4. Actionable Recommendations
Every finding includes what to do and why it matters.

### 5. Continuous Improvement
Review is iterative - identify gaps, improve, verify, repeat.

---

## Troubleshooting

### Validation fails on well-formed SKILL.md
- Verify YAML frontmatter syntax (must be between --- delimiters)
- Check file is named `SKILL.md` (uppercase SKILL, .md extension)
- Check Markdown heading format
- Ensure UTF-8 file encoding
- No special characters in section titles

### Validation detects skill.yaml format
- ⚠️ **ERROR**: Skills must use `SKILL.md` (Markdown), not `skill.yaml` (YAML)
- Rename file from `skill.yaml` to `SKILL.md`
- Convert YAML structure to Markdown with YAML frontmatter
- Move metadata to frontmatter, instructions to markdown body

### Report incomplete
- Verify SKILL.md and README.md exist (SKILL.md required, README.md optional)
- Check files have all required sections
- Ensure files are complete and readable
- Verify file permissions

### Generic validation not specific enough
This skill validates universal standards. For domain-specific validation, create custom criteria extensions.

---

## Tips for Passing Review

### Documentation
✅ Write for unfamiliar users  
✅ Include examples and use cases  
✅ Explain why each component exists  

### Code Quality
✅ Use proper TypeScript typing  
✅ Follow naming conventions  
✅ Organize files logically  

### Robustness
✅ Handle errors gracefully  
✅ Test edge cases  
✅ Provide fallback mechanisms  

### User Experience
✅ Consider dark mode support  
✅ Design for mobile responsiveness  
✅ Enable keyboard navigation  

---

## File Structure

```
.claude/skills/review-agent-skill/
├── SKILL.md                      # Skill manifest (Markdown with YAML frontmatter)
└── README.md                     # Documentation (this file)

Your skill being reviewed:
.claude/skills/your-skill-name/
├── SKILL.md                      # File being validated (Markdown format, REQUIRED)
└── README.md                     # File being validated (optional reference doc)
```

### File Format Requirements
- **SKILL.md**: Complete skill documentation (Markdown with YAML frontmatter)
  - YAML frontmatter: name, description, optional license
  - Markdown body: Instructions and documentation
  - ⚠️ **MUST be named SKILL.md** (uppercase, .md extension)
- **README.md**: Quick reference guide (optional but recommended)
- ❌ **DO NOT use skill.yaml** - Skills use Markdown (SKILL.md), not YAML

---

## Example Usage

### Before Review
```yaml
# Incomplete skill.yaml
name: my-feature
description: Does something
```

### Review Request
> "Please review my skill at .claude/skills/my-feature/ using review-agent-skill"

### After Review - Address Issues
- Add missing components documentation
- Complete setup instructions
- Add troubleshooting guide
- Document error handling

### Re-validate
> "Please review my skill again to confirm improvements"

---

## Validation Metrics

- **18 Categories** covering all skill aspects
- **50+ Checkpoints** for comprehensive review
- **Applicable to all skills** regardless of type
- **Severity levels** for prioritization
- **Actionable recommendations** for improvement

---

## Future Enhancements

- Automated fix suggestions
- Code quality metrics
- Documentation coverage percentage
- GitHub Actions integration
- Batch skill validation
- Custom rule configuration
- Historical quality tracking
- Scoring system

---

## Related Resources

### Example Skills
- `.claude/skills/feature-joy-quiz/` - Well-formed example

### Documentation
- README.md documentation (quick reference guide)
- Review SKILL.md for detailed criteria
- See troubleshooting section for common issues

---

## Performance

- Quick validation with no external tools
- Severity levels for prioritization
- Supports iterative improvement
- Produces clear, actionable reports

---

## Browser Support

Not applicable (server-side validation). Reports can be viewed in any browser.

---

## Dependencies

- Markdown parsing capability (for SKILL.md)
- YAML frontmatter parsing capability (for SKILL.md metadata)
- No external tools required

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 30, 2026 | Initial release |

---

**Last Updated:** January 30, 2026  
**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Maintained By:** Claude Copilot
