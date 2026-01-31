# Find Strategy Patterns

Reference for choosing the right `find:` strategy when creating bead context references. Landmarks over coordinates — always.

## Strategy Reference

| Strategy | Use When | Example |
|----------|----------|---------|
| Class definition | Referencing a class | `find: "class UserService"` |
| Method definition | Referencing a method | `find: "def upload"` |
| Module definition | Referencing a module | `find: "module Authentication"` |
| Constant | Referencing a constant | `find: "AVATAR_SIZES ="` |
| Error handling | Showing error pattern | `find: "rescue Aws::"` |
| Config block | Referencing config | `find: "Aws.config.update"` |
| Unique string | Config values, env vars | `find: "AWS_S3_BUCKET"` |
| Comment marker | Marked sections | `find: "# ERROR HANDLING"` |
| Import/require | Dependencies | `find: "require 'image_processing'"` |

## Scope Modifiers

| Scope | Meaning | When to Use |
|-------|---------|-------------|
| (none) | Just the line containing the find term | Checking if something exists |
| `"entire method"` | From method definition to end | Understanding a method's implementation |
| `"entire class"` | From class definition to end | Understanding class structure |
| `"entire file"` | Whole file as context | Small config files, short modules |
| `"block"` | Until matching end/brace | do..end blocks, if..end blocks |
| `"until blank line"` | Until next blank line | Constants, short declarations |

## Good vs Bad Find Terms

### Specificity

```
BAD:  find: "def initialize"           # Matches many classes
GOOD: find: "class S3Storage"          # Unique class name
GOOD: find: "class S3Storage", scope: "def initialize"  # Specific init
```

### Stability

```
BAD:  find: "# TODO: fix this"         # Temporary, will be removed
BAD:  find: "line 42"                   # Coordinates break
GOOD: find: "def upload"               # Method names are stable
GOOD: find: "class AvatarService"      # Class names are stable
```

### Uniqueness

```
BAD:  find: "def call"                  # Many services have #call
GOOD: find: "class AvatarUploadService" # Then scope: "def call"
```

## Anti-Patterns

- **Line numbers:** NEVER use `lines: "12-34"`. Always use `find:`.
- **Vague terms:** `find: "def"` matches everything. Be specific.
- **Comments as anchors:** Comments get deleted. Use code structure.
- **Temporary markers:** `# MARKER` or `# FIXME` are unreliable.
- **Content-dependent:** `find: "returns true"` changes with implementation.

## Combining Strategies

For precise targeting, combine find with scope:

```yaml
# Find the class, then look at a specific method
- file: "app/services/storage/s3_client.rb"
  find: "class S3Client"
  scope: "def upload"
  purpose: "How existing S3 upload works"

# Find the test describe block for a specific class
- file: "spec/services/storage/s3_client_spec.rb"
  find: "RSpec.describe S3Client"
  scope: "entire class"
  purpose: "Test structure to follow"
```
