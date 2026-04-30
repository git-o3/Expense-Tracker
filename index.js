#!/usr/bin/env node

import fs from "fs";
import path, { parse } from "path";
import { fileURLToPath } from "url";


// setup paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_PATH = path.join(__dirname, "expenses.json");

// data structure layer
const readExpenses = () => {
    try {
        if (!fs.existsSync(FILE_PATH)) return [];
        const content = fs.readFileSync(FILE_PATH, "utf-8");
        return JSON.parse(content || "[]");

    } catch (err) {
        console.error("Error reading data file:", err);
        return [];
    }
};

const writeExpenses = (data) => {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing data file:", err.message);
    }
}

// utitlities 
const getArgs = () => {
    const args = process.argv.slice(2);
    const  command = args[0];
    const params = {};

    args.forEach((arg, i) => {
        if (arg.startsWith("--")) {
            const key = arg.replace("--", "");
            params[key] = args[i + 1];
        }
    });
    return { command, params };
};

const formatMonth = (monthNumber) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1] || "Unknown"
};

// main logic 
const { command, params } = getArgs();
let expenses = readExpenses();

const calculateCurrentMonthTotal = (expenses) => {
    const now = new Date();
    const currentMonth = now.getMonth(); 
    const currentYear = now.getFullYear();

    return expenses
        .filter(e => {
            const date = new Date(e.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, e) => sum + e.amount, 0);
};

switch (command) {
    case "add":
        if(!params.description || !params.amount) {
            console.log("Usage: add --description <text> --amount <number>");
            break;
        }

        const newAmount = parseFloat(params.amount);
        const budgetLimit = 500;
        const currentMonthTotal = calculateCurrentMonthTotal(expenses);

        if (currentMonthTotal + newAmount > budgetLimit) {
            console.log(`Warning: This expense will exceed your monthly budget of $${budgetLimit}! )`);
            console.warn(`Current total: $${(currentMonthTotal + newAmount).toFixed(2)}`);
        }
        const newExpense = {
            id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1: 1,
            date: new Date().toISOString().split("T")[0],
            description: params.description,
            amount: parseFloat(params.amount)
        };
        expenses.push(newExpense);
        writeExpenses(expenses)
        console.log(`Expense added successfully (ID: ${newExpense.id})`);
        break;

        case "list": 
          let listExpenses = expenses;

            if (params.month) {
            const monthNum = parseInt(params.month);
            listExpenses = expenses.filter(e => {
            const expenseMonth = new Date(e.date).getMonth() + 1;
            return expenseMonth === monthNum;
            });
             console.log(`--- Expenses for ${formatMonth(monthNum)} ---`);
            }

           if (listExpenses.length === 0) {
            console.log("No expenses found for this period.");
           break;

          }

            console.log("ID   Date         Description   Amount");
            listExpenses.forEach(e => {
            console.log(`${e.id.toString().padEnd(4)} ${e.date}   ${e.description.padEnd(13)} $${e.amount}`);
        }); 
           break;

        case "delete":
            const idToDelete = parseInt(params.id)
            const initialLength = expenses.length
            expenses = expenses.filter(e => e.id !== idToDelete);

            if (expenses.length === initialLength) {
                console.log(`Error: Expense ID ${idToDelete} not found`);  
            } else {
                writeExpenses(expenses)
                console.log("Expense deleted successfully");
            }
            break;

        case "summary": 
          if (params.month) {
            const monthNum = parseInt(params.month);
            const monthlyTotal = expenses
              .filter(e => new Date(e.date).getMonth() + 1 === monthNum)
              .reduce((sum, e) => sum + e.amount, 0);
             
              console.log(`Total expenses for ${formatMonth(monthNum)}: $${monthlyTotal}`);
          } else {
            const total = expenses.reduce((sum, e) => sum + e.amount, 0);
            console.log(`Total expenses: $${total}`);
          }
          break;

        case "update": 
            const updateId = parseInt(params.id);
            const index = expenses.findIndex(e => e.id === updateId);
            if (index === -1 ) {
                console.log(`Error: Expense ${updateId} not found`);
            } else {
                if (params.description) expenses[index].description = params.description;
                if (params.amount) expenses[index].amount = parseFloat(params.amount);
                writeExpenses(expenses);
                console.log("Expense updated successfully");
            }
            break;

            case "export":
                if (expenses.length === 0) {
                    console.log("Nothing to export.");
                  break;
                }


                // create CSV format: header first, then rows
                const csvHeader = "ID,Date,Description,Amount\n";
                const csvRows = expenses
                     .map(e => `${e.id},${e.date},${e.description},${e.amount}`)
                     .join("\n");

                const EXPORT_PATH = path.join(__dirname, "expenses_export.csv");

                try {
                     fs.writeFileSync(EXPORT_PATH, csvHeader + csvRows);
                     console.log(`Success: Expenses exported to ${EXPORT_PATH}`);

                } catch (err) {
                    console.error("Failed to export file:", err.message);
                }
                break;

               default:
            
                console.log("Available commands: add, list, delete, summary, update");
}