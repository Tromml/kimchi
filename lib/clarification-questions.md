# Clarification Question Patterns

Reference library of effective clarification questions organized by category. Use these patterns when generating questions in the clarify stage.

## Functional Questions

### User Actions
- "What happens when a user [action]? Walk me through the flow."
- "Should [action] be available to all users or specific roles?"
- "What should the user see after [action] succeeds? After it fails?"

### Business Rules
- "Is [value] always [constraint], or are there exceptions?"
- "When [condition], should we [option A] or [option B]?"
- "What's the expected behavior when [edge case]?"

### Input/Output
- "What formats are acceptable for [input]? (e.g., JPEG, PNG, WebP)"
- "What's the maximum size for [input]? (e.g., 5MB)"
- "What does the success response look like? The error response?"

## Data Questions

### Storage
- "Does [data] need to persist, or is it transient?"
- "What existing model/table does this relate to?"
- "Do we need to track history/changes for [data]?"

### Validation
- "What validation rules apply to [field]?"
- "Should [field] be unique? Within what scope?"
- "Are there format requirements for [field]? (e.g., email format)"

### Migration
- "Does existing data need to be migrated or backfilled?"
- "Can this be a non-breaking schema change?"

## Integration Questions

### System Boundaries
- "Does this touch existing [system/service]? How?"
- "What external APIs does this need? Are they already integrated?"
- "Does this affect any existing API contracts?"

### Authentication/Authorization
- "Who can perform [action]? Any logged-in user, or specific roles?"
- "Does this need a new permission or does an existing one apply?"

## Constraint Questions

### Performance
- "What's the expected load? (requests/sec, concurrent users)"
- "What's an acceptable response time for [action]?"
- "Is there data that could grow unbounded?"

### Security
- "Does [data] contain PII or sensitive information?"
- "Are there compliance requirements? (GDPR, SOC2, etc.)"

### Compatibility
- "Does this need to work on mobile/tablet?"
- "Are there browser compatibility requirements?"

## Scope Questions

### Boundaries
- "Is [related feature] in scope or should it be v2?"
- "What's the minimum viable version of this?"
- "Are there similar features we should be aware of but NOT build?"

### Polish
- "What level of error handling is expected? Basic validation or comprehensive?"
- "Do we need admin tooling for this, or just the user-facing side?"
- "Is i18n/localization needed for v1?"
