# Task Seed Data Generator

Simple console-based utility to generate sample task data for development and testing.

## Usage

1. Open your task management app in the browser
2. Open browser console (F12)
3. Copy and paste the contents of `seed-script.js`
4. Run: `seedSampleData()`
5. Refresh the page to see the new tasks

## Available Functions

```javascript
// Generate 6 sample tasks
seedSampleData();

// Clear all existing data
clearExistingData();
```

## Sample Data Generated

The script creates 6 diverse sample tasks:

- **Complete project documentation** (High priority, due in 2 days)
- **Review pull requests** (Normal priority, due today)
- **Buy groceries** (Normal priority, due tomorrow)
- **Schedule team meeting** (Low priority, completed)
- **Fix navigation bug** (High priority, due in 3 days)
- **Plan weekend trip** (Low priority, due in a week)

## Features

- ✅ Mixed priorities (low, normal, high)
- ✅ Various due dates (today, tomorrow, future, none)
- ✅ Completed and pending tasks
- ✅ Detailed descriptions
- ✅ Proper localStorage format
- ✅ Category management (default category)

## Troubleshooting

**Tasks not showing up?**

- Make sure to refresh the page after generating data
- Check browser console for any errors
- Verify localStorage has the data: `localStorage.getItem('categories_index')`

**Want to start fresh?**

- Use `clearExistingData()`
- Or manually clear localStorage in browser dev tools
