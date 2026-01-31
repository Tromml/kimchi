---
name: simplicity-enforcement
description: Use when designing solutions, implementing features, or considering abstractions. Enforces YAGNI, minimal code, and preferring duplication over wrong abstraction.
---

# Simplicity Enforcement

## Overview

Complexity is the enemy. Every abstraction, configuration option, and "extensible" pattern is a cost. Pay it only when you must.

**Core principle:** Prefer simple solutions over clever ones. Always.

**Violating the letter of these rules is violating the spirit of simplicity.**

## When This Applies

Every implementation decision. No exceptions.

## The Iron Law

```
THE RIGHT AMOUNT OF COMPLEXITY IS THE MINIMUM NEEDED FOR THE CURRENT TASK
```

Three similar lines of code is better than a premature abstraction.

## Principles

### Prefer Duplication Over Wrong Abstraction

If you're not sure an abstraction is right:
- Duplicate the code
- Wait until you have 3+ similar cases
- Then extract with full understanding

<Good>
```ruby
# Duplication when pattern unclear
class AvatarUploadService
  def upload(file)
    validate_size(file)
    validate_type(file)
    store_in_s3(file)
  end
end

class DocumentUploadService
  def upload(file)
    validate_size(file)
    validate_type(file)
    store_in_s3(file)
  end
end
```
Two cases. Let it sit. Extract when you see the third.
</Good>

<Bad>
```ruby
# Premature abstraction
class GenericUploadService
  def initialize(validator:, storage:, processor: nil)
    @validator = validator
    @storage = storage
    @processor = processor
  end

  def upload(file)
    @validator.validate(file)
    processed = @processor&.process(file) || file
    @storage.store(processed)
  end
end
```
Over-engineered for two use cases
</Bad>

### YAGNI: You Aren't Gonna Need It

Don't build for hypothetical future requirements.

<Good>
```ruby
# Build what's needed now
class ImageResizer
  def resize(file, dimensions)
    ImageProcessing::Vips
      .source(file)
      .resize_to_fill(*dimensions)
      .call
  end
end
```
</Good>

<Bad>
```ruby
# Hypothetical future support
class ImageResizer
  STRATEGIES = {
    vips: VipsStrategy,
    imagemagick: ImageMagickStrategy,
    cloudinary: CloudinaryStrategy,  # "in case we switch"
  }

  def initialize(strategy: :vips)
    @strategy = STRATEGIES[strategy].new
  end
end
```
</Bad>

### Hardcode First, Configure Later

If a value won't change soon, hardcode it.

<Good>
```ruby
AVATAR_SIZES = [32, 128, 512].freeze
BUCKET = 'avatars'
```
</Good>

<Bad>
```ruby
config.avatar_sizes = [32, 128, 512]  # In YAML config
config.avatar_bucket = ENV['AVATAR_BUCKET']  # When it's always 'avatars'
```
</Bad>

### One Way to Do It

Don't provide multiple ways to accomplish the same thing.

<Good>
```ruby
user.avatar_url(:medium)
```
</Good>

<Bad>
```ruby
user.avatar_url
user.get_avatar_url
user.fetch_avatar(size: :medium)
Avatar.url_for(user)
```
</Bad>

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "We might need this later" | Build it later. YAGNI. |
| "It's more flexible this way" | Flexibility you don't need is complexity you pay for now. |
| "DRY says extract it" | DRY applies at 3+ repetitions with clear pattern, not 2. |
| "Enterprise patterns are best practice" | Factory/Strategy/Observer for one use case is anti-practice. |
| "Configuration makes it reusable" | Configuration for fixed values is noise. |
| "What if requirements change?" | They will. Refactor then, with full context. Cheaper than guessing now. |
| "It's only a little more complex" | Complexity compounds. Every "little" addition adds up. |

## Red Flags — STOP and Simplify

- Writing a class with "Generic", "Base", or "Abstract" in the name for a single use
- Adding constructor parameters for "flexibility"
- Creating config files for values that won't change
- Writing a "factory" or "strategy" pattern
- Building plugin/extension points
- Adding feature flags for unrequested features
- Creating helpers/utilities for one-time operations
- Designing for hypothetical future requirements

**ALL of these mean: STOP. Delete. Write the simple version.**

## Verification

Before completing:
- [ ] No abstractions without 3+ uses
- [ ] No configuration for fixed values
- [ ] No "pluggable" or "extensible" patterns for single use
- [ ] No multiple ways to do the same thing
- [ ] Could a junior developer understand this in 5 minutes?

## Anti-Patterns

### FORBIDDEN: "Enterprise" patterns for small features

Factory, Strategy, Observer, Visitor patterns are rarely needed. If you have one implementation, you don't need a pattern.

### FORBIDDEN: Future-proofing

"What if we need to support X later?" — Build it later. You'll have more context then.

### FORBIDDEN: DRY at all costs

Duplication is better than wrong abstraction. Two similar functions are fine. Extract at three.

### FORBIDDEN: Backwards-compatibility shims

If something is unused, delete it. Don't rename to `_var`, re-export, or add `# removed` comments.
