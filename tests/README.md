# Studio Nullbyte - Test Scripts

This folder contains test scripts for various features of the Studio Nullbyte website.

## Available Tests

### 📝 test-slug.js
Tests the slug generation functionality for creating URL-friendly slugs from category names.

**Usage:**
```bash
node tests/test-slug.js
```

**Tests:**
- Basic slug generation from various input strings
- Unique slug generation to avoid conflicts
- Handling of special characters and spaces

---

### 🔍 test-featured-products.js
Basic test for the `getFeaturedProducts` function.

**Usage:**
```bash
node tests/test-featured-products.js
```

**Tests:**
- Fetches featured products from database
- Displays count and basic information
- Tests error handling

---

### 🔄 test-loading-fix.js
Tests the loading spinner fix for featured products.

**Usage:**
```bash
node tests/test-loading-fix.js
```

**Tests:**
- Performance timing of getFeaturedProducts function
- Error handling and fallback behavior
- Configuration validation

---

### 🎯 test-conditional-rendering.js
Tests the conditional rendering logic for the Featured Products section.

**Usage:**
```bash
node tests/test-conditional-rendering.js
```

**Tests:**
- Section visibility based on product availability
- Different states (loading, error, success, hidden)
- Behavior with and without featured products

---

### 🔍 featured-products-status.js
Comprehensive status check for Featured Products implementation.

**Usage:**
```bash
node tests/featured-products-status.js
```

**Checks:**
- Environment variables configuration
- Expected behavior documentation
- Database requirements
- Troubleshooting steps

## Running Tests

### Prerequisites
- Node.js installed
- Project dependencies installed (`npm install`)
- Environment variables configured (if testing database features)

### Running Individual Tests
```bash
# From project root
node tests/test-slug.js
node tests/test-featured-products.js
node tests/test-loading-fix.js
node tests/test-conditional-rendering.js
node tests/featured-products-status.js
```

### Running All Tests
```bash
# You can create a script to run all tests
for file in tests/*.js; do
  echo "Running $file..."
  node "$file"
  echo "---"
done
```

## Test Categories

### 🛠️ Utility Tests
- `test-slug.js` - Tests utility functions

### 🎨 UI Component Tests
- `test-conditional-rendering.js` - Tests UI behavior

### 🔌 Integration Tests
- `test-featured-products.js` - Tests database integration
- `test-loading-fix.js` - Tests loading states

### 📊 Status/Health Checks
- `featured-products-status.js` - Configuration and environment checks

## Contributing

When adding new tests:

1. Create test files in the `/tests` directory
2. Follow the naming convention: `test-[feature-name].js`
3. Include descriptive console output
4. Test both success and error scenarios
5. Update this README with test documentation

## Notes

- Tests use ES modules syntax (`import/export`)
- Some tests require Supabase configuration to run successfully
- Tests are designed to be run individually for specific feature testing
- All tests include helpful console output for debugging
