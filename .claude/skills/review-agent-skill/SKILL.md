---
name: review-agent-skill
description: Automated validation and review agent for Claude agent skills using comprehensive verification checklist with 50+ validation criteria
license: MIT
---

# Skill Review Agent - Validation Framework

A comprehensive skill review agent that validates agent skills against a standardized verification checklist. This skill provides automated quality assurance for agent skills, ensuring they meet production standards for documentation, architecture, code quality, accessibility, error handling, and more. Generates detailed validation reports with pass/fail status, observations, and recommendations.

## ⚠️ Critical Requirement: SKILL.md Format

**All skills MUST use the following format:**

- **Filename**: `SKILL.md` (uppercase, .md extension) ✅ REQUIRED
- **NOT**: `skill.yaml` or `skill.yml` ❌ INCORRECT
- **Location**: `.claude/skills/[skill-name]/SKILL.md`
- **Format**: Markdown file with YAML frontmatter
- **Frontmatter**: YAML block between `---` delimiters containing metadata
- **Body**: Markdown content with instructions and documentation

### Correct SKILL.md Structure

```markdown
---
name: skill-name-lowercase-with-hyphens
description: Clear description of what this skill does
license: MIT
---

# Skill Title

Markdown body with instructions, examples, and documentation...

## Section 1
Content here...

## Section 2
Content here...
```

### Common Mistakes ❌

- Using `skill.yaml` instead of `SKILL.md` - NOT DISCOVERABLE by Copilot CLI
- Using `SKILL.yaml` (wrong extension) - NOT DISCOVERABLE
- Using `skill.md` (lowercase) - NOT DISCOVERABLE
- Pure YAML without markdown body - INCORRECT FORMAT
- Missing YAML frontmatter - MISSING METADATA

### Why This Matters

- Copilot CLI specifically looks for `SKILL.md` files
- Skills in `skill.yaml` format are NOT discovered
- Markdown format is more readable and flexible
- YAML frontmatter keeps metadata structured
- This follows the Agent Skills open standard

## Key Features

- **SKILL.md Validation**: Validates well-formed SKILL.md manifest files (Markdown with YAML frontmatter)
- **Format Compliance**: Ensures skills use correct markdown format instead of YAML
- **README Verification**: Checks README.md structure and completeness (optional reference doc)
- **Documentation Review**: Ensures comprehensive documentation coverage
- **Architecture Analysis**: Validates data flow and component hierarchy
- **TypeScript Quality**: Checks type safety and code quality standards
- **State Management**: Verifies state management approach and patterns
- **File Structure**: Validates project file organization
- **Error Handling**: Checks for proper error scenarios and fallbacks
- **Accessibility**: Reviews accessibility and theme support
- **Testing Coverage**: Validates testing checklist completeness
- **Performance Analysis**: Reviews performance metrics and optimization
- **Browser Compatibility**: Checks supported browser list
- **Dependency Management**: Validates dependency declarations
- **Component Design**: Reviews component props and responsibilities
- **Route Configuration**: Validates route structure and mappings
- **Database Schema**: Reviews database models and relationships
- **Data Format Specification**: Checks format specifications with examples
- **Setup Instructions**: Validates environment setup documentation
- **Troubleshooting Guide**: Checks troubleshooting completeness
- **50+ Validation Checkpoints**: Comprehensive feature-agnostic criteria

## Verification Categories

### Documentation
- Comprehensive README.md exists (optional reference documentation)
- **SKILL.md file is required** with proper structure:
  - YAML frontmatter: `name`, `description`, optional `license`
  - Markdown body: Instructions, sections, code examples
- **Skill file naming**: Must be `SKILL.md` (uppercase, .md extension) - NOT `skill.yaml`
- **Skill directory naming**: Lowercase with hyphens (e.g., `my-skill-name`)
- Clear feature descriptions without feature-specific terminology
- Table of contents with proper linking
- Architecture overview diagram/description
- Component documentation with prop types
- Utility function documentation
- Route configuration documentation
- Data format specifications (if applicable)
- Setup and environment instructions

### Architecture
- Clear data flow description
- Component hierarchy documented
- State management approach identified
- Server vs client responsibility clear
- Separation of concerns evident
- Scalability considerations
- Database schema (if applicable)
- API/route structure

### TypeScript & Code Quality
- All files use .ts or .tsx
- Strict mode enabled
- Proper type annotations
- Interface definitions for props
- Generic types used appropriately
- No any types without justification
- Import statements clear and organized

### State Management
- Approach clearly defined (hooks, context, etc.)
- State organization documented
- Client vs server state separated
- Optional persistence mechanism
- Fallback handling for degradation

### File Structure
- Clear organizational hierarchy
- Follows project conventions
- Consistent naming patterns
- Logical component grouping
- Utilities properly separated
- Configuration files documented

### Error Handling
- Error scenarios identified
- Fallback mechanisms documented
- User-friendly error messages
- Graceful degradation
- Offline mode support (if applicable)
- Console logging for debugging

### Accessibility
- Theme/dark mode support mentioned
- Keyboard navigation considered
- Mobile responsiveness addressed
- ARIA considerations
- Color contrast awareness
- Focus management

### Testing
- Testing checklist provided
- Test scenarios comprehensive
- Edge cases covered
- Performance testing criteria
- Browser testing matrix

### Performance
- Load time metrics
- Rendering performance
- Memory usage estimates
- Caching strategy
- Database query optimization
- Bundle size considerations

### Browser Support
- Supported browser list
- Version compatibility
- Feature detection
- Polyfill notes (if applicable)

### Dependencies
- All external dependencies listed
- Version constraints specified
- Required vs optional noted
- Known compatibility issues
- Security considerations

### Component Design
- Props properly typed
- Component responsibilities clear
- Reusability demonstrated
- Default props documented
- Event handlers clear
- Children support (if applicable)

### Route Configuration
- Routes clearly mapped
- URL patterns documented
- Layout structure
- Nested routes (if applicable)
- Query parameter handling
- Dynamic routes (if applicable)

### Database Schema
- Models/tables documented
- Field types specified
- Relationships documented
- Constraints noted
- Indices documented
- Migration strategy

### Data Format Specification
- Format specification clear
- Examples provided
- Parsing logic documented
- Validation rules
- Error handling for malformed data

### Setup & Environment
- Step-by-step installation
- Dependency installation
- Configuration files
- Environment variables
- Database initialization
- Running/testing verification

### Troubleshooting
- Common issues listed
- Solutions provided
- Debug steps documented
- FAQ section (if applicable)
- Support links

## Validation Report Structure

### Report Sections

1. **Validation Status**
   - ✅ Valid / ⚠️ Issues Found / ❌ Critical Issues

2. **Strengths**
   - Positive findings and well-implemented areas

3. **Minor Observations**
   - Low severity findings

4. **Required Items**
   - Pass/fail for each required element

5. **Verification Checklist**
   - Itemized results of 50+ checks

6. **Recommendations**
   - Actionable next steps

7. **Conclusion**
   - Summary of overall quality

## Severity Levels

- **Critical**: Blocks production use
- **High**: Should be addressed before release
- **Medium**: Should be considered for next iteration
- **Low**: Nice to have improvements
- **Info**: Informational findings

## Usage Guide

1. **Prepare** SKILL.md file (required) and README.md (optional) in skill directory
2. **Run** review agent with skill directory path
3. **Agent validates** against comprehensive checklist
4. **Generates** validation report (JSON/Markdown)
5. **Review** findings and recommendations
6. **Address** issues according to severity
7. **Re-run** review to verify fixes

## Customization Points

- Add feature-specific criteria
- Adjust severity levels per organization
- Modify report formatting
- Add custom validation rules
- Integrate with CI/CD pipelines

## Setup Instructions

1. **Skill requires access to:**
   - `SKILL.md` file (required - Markdown with YAML frontmatter)
   - `README.md` file (optional - reference documentation only)
   - Project structure for context

2. **SKILL.md format requirements:**
   - Filename: `SKILL.md` (uppercase, .md extension)
   - YAML frontmatter with: `name`, `description`, optional `license`
   - Markdown body with instructions and sections
   - NOT yaml format (skill.yaml is incorrect)

3. **Optional resources:**
   - Component files for deeper analysis
   - package.json for dependency checking
   - tsconfig.json for TypeScript validation

## Output Format

- **Validation Report**: Markdown format
- **Detailed Findings**: Issue descriptions and severity
- **Pass/Fail Summary**: Quick status overview
- **Metrics Dashboard**: Optional quality metrics

## Testing Checklist

- [ ] Validates well-formed SKILL.md (Markdown with YAML frontmatter)
- [ ] Detects incorrect skill.yaml format (should be SKILL.md)
- [ ] Checks file naming is `SKILL.md` (uppercase, .md extension)
- [ ] Checks directory naming is lowercase with hyphens
- [ ] Verifies YAML frontmatter has required fields (name, description)
- [ ] Detects missing README.md (optional but recommended)
- [ ] Checks documentation completeness
- [ ] Verifies architecture description
- [ ] Validates component documentation
- [ ] Checks prop typing
- [ ] Verifies file structure
- [ ] Validates error handling patterns
- [ ] Checks accessibility considerations
- [ ] Verifies testing checklist
- [ ] Validates performance metrics
- [ ] Checks browser support matrix
- [ ] Verifies setup instructions
- [ ] Checks troubleshooting guide
- [ ] Validates against all 50+ criteria

## Performance Notes

- **File validation**: O(n) where n = lines in files
- **Report generation**: <1 second for typical skills
- **Memory**: Minimal, processes files sequentially
- **No external API calls required**

## Browser Support

- Not applicable (server-side validation)
- Report generation works in all modern browsers

## Example Validation Report

```
# Skill Validation Report

## Status: ⚠️ Issues Found

### Strengths
- ✅ Well-structured README.md
- ✅ Comprehensive YAML frontmatter
- ✅ Clear feature descriptions
- ✅ Good component documentation

### Minor Observations
- ⚠️ Missing performance metrics section
- ⚠️ Browser compatibility matrix incomplete

### Required Items
- ✅ name field present
- ✅ description field present
- ✅ Architecture documented
- ✅ Components documented

### Verification Results

**Documentation**: 18/20 checks passed
**Architecture**: 8/8 checks passed
**Code Quality**: 7/7 checks passed
**State Management**: 5/5 checks passed
...

### Recommendations

1. Add performance metrics section
2. Document browser compatibility versions
3. Add example data format specifications

### Conclusion

Skill is production-ready with minor documentation enhancements recommended.
```

## Troubleshooting

**Validation fails on well-formed SKILL.md**
- Check YAML frontmatter syntax (must be between --- delimiters)
- Verify file is named `SKILL.md` (uppercase, .md extension)
- Ensure Markdown headings use proper format (# # ## etc.)
- Verify file encoding (UTF-8)
- Check for required fields: `name` and `description` in frontmatter

**Validation detects skill.yaml format**
- ⚠️ ERROR: Skills must use `SKILL.md` (Markdown), not `skill.yaml` (YAML)
- Rename file from `skill.yaml` to `SKILL.md`
- Convert YAML structure to Markdown with YAML frontmatter
- Move metadata to frontmatter, instructions to markdown body

**Report incomplete**
- Verify SKILL.md and README.md files are readable
- Check files exist and are complete
- Ensure proper Markdown formatting
- Verify YAML frontmatter is valid

**False positives on checks**
- Review check logic
- Adjust criteria if feature-specific
- Document exceptions if necessary

## Validation Philosophy

This review agent follows these principles:
- **Generic criteria** applicable to all skills
- **Focus on documentation quality** as key indicator
- **Emphasis on production readiness** standards
- **Severity-based findings** for prioritization
- **Actionable recommendations** for improvement
- **Non-prescriptive approach** - guides not enforces
- **Supports iterative improvement** process

## Future Enhancements

- Automated fix suggestions
- Code quality metrics
- Documentation coverage percentage
- Integration with GitHub Actions
- Batch skill validation
- Comparison against similar skills
- Custom rule configuration
- Historical tracking of skill quality
- Interactive validation dashboard
- Skill scoring system

## Known Limitations

- Validates structure, not implementation correctness
- Cannot test running code
- Generic validation (not feature-specific)
- Requires well-formatted YAML and Markdown
- No context about project-specific requirements

## Integration Notes

- Framework agnostic
- Language agnostic validation
- Works with any project structure
- Complements existing CI/CD
- Pairs with skill development workflow

## Related Documentation

- Agent Skills standard: https://github.com/agentskills/agentskills
- GitHub Copilot docs: https://docs.github.com/en/copilot/concepts/agents/about-agent-skills
- Best practices guide: Review adjacent skills for patterns

## SKILL.md Format Reference

### Required Metadata Fields (YAML Frontmatter)

```yaml
---
name: skill-identifier          # Required: lowercase, hyphens for spaces
description: What the skill does # Required: clear, concise description
license: MIT                    # Optional: license type
---
```

### Markdown Body Structure

Standard sections to include:

```markdown
# [Skill Name]

One-paragraph description of what the skill does.

## Key Features
- Bullet list of main features
- Each feature as a separate line

## How It Works / Architecture
- Overview of approach
- Components or steps

## Usage Guide
1. First step
2. Second step
3. Third step

## Examples
Code examples or usage patterns

## Configuration
Any configuration options

## Troubleshooting
Common issues and solutions

## Related Links
Links to documentation
```

### Skills Discovery

- ✅ **Correct**: `.claude/skills/my-skill/SKILL.md` → Discovered by Copilot CLI
- ❌ **Wrong**: `.claude/skills/my-skill/skill.yaml` → NOT discovered
- ❌ **Wrong**: `.claude/skills/my-skill/SKILL.yaml` → NOT discovered
- ❌ **Wrong**: `.claude/skills/my-skill/skill.md` → NOT discovered (lowercase)

### Validation Checklist for SKILL.md Files

- [ ] File named exactly `SKILL.md` (uppercase SKILL, .md extension)
- [ ] Located in `.claude/skills/[skill-name]/` directory
- [ ] YAML frontmatter between `---` delimiters
- [ ] Required fields: `name` and `description`
- [ ] `name` is lowercase with hyphens (no spaces)
- [ ] Directory name matches skill name format
- [ ] Markdown body uses proper heading hierarchy
- [ ] Content is readable natural language (not YAML data)
- [ ] Includes practical examples
- [ ] Includes troubleshooting section
- [ ] No extraneous YAML fields outside frontmatter
- [ ] UTF-8 encoding
