# Expense Tracker CLI

A simple command-line tool to track your daily expenses, set a monthly budget, and export your data to CSV.


Project URL: https://roadmap.sh/projects/expense-tracker

## Installation

Clone the repo and install globally:

```bash
git clone https://github.com/git-o3/Expense-Tracker.git
cd expense-tracker
npm install -g .
```

Once installed, the `expense-tracker` command is available anywhere on your machine.

## Usage

### Add an Expense

```bash
expense-tracker add --description "Lunch" --amount 12
expense-tracker add --description "Netflix" --amount 15.99
```

Output:  .
```
Expense added successfully (ID: 1)
```

### List All Expenses

```bash
expense-tracker list
```

Output:
```
ID   Date         Description   Amount
1    2026-04-30   Lunch         $12
2    2026-04-30   Netflix       $15.99
```

### List Expenses by Month

```bash
expense-tracker list --month 4
```

Output:
```
--- Expenses for April ---
ID   Date         Description   Amount
1    2026-04-30   Lunch         $12
```

### Delete an Expense

```bash
expense-tracker delete --id 1
```

Output:
```
Expense deleted successfully
```

### Update an Expense

```bash
expense-tracker update --id 1 --description "Dinner" --amount 20
```

Output:
```
Expense updated successfully
```

### Summary

View your total expenses:

```bash
expense-tracker summary
```

View total for a specific month:

```bash
expense-tracker summary --month 4
```

Output:
```
Total expenses for April: $27.99
```

### Export to CSV

```bash
expense-tracker export
```

Exports all expenses to `expenses_export.csv` in the project directory.

Output:
```
Success: Expenses exported to /path/to/expenses_export.csv
```

## Monthly Budget & Warnings

The app has a built-in monthly budget of **$500**. Every time you add an expense, it checks your current month's total. If adding the new expense would exceed the budget, you will see a warning:

```bash
expense-tracker add --description "New shoes" --amount 460
```

Output:
```
Warning: This expense will exceed your monthly budget of $500!
Current total: $512.99
```

The expense is still saved — the warning is just to keep you informed. To change the budget limit, open `index.js` and update this line:

```js
const budgetLimit = 500; // change this to your preferred limit
```

## Available Commands

| Command | Description |
|---|---|
| `add --description <text> --amount <number>` | Add a new expense |
| `list` | List all expenses |
| `list --month <1-12>` | List expenses for a specific month |
| `delete --id <number>` | Delete an expense by ID |
| `update --id <number> --description <text> --amount <number>` | Update an expense |
| `summary` | Show total of all expenses |
| `summary --month <1-12>` | Show total for a specific month |
| `export` | Export all expenses to CSV |

## Requirements

- Node.js v18+

## License

MIT

