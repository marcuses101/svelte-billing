# Accounting

This accounting system follows the [Double Entry Bookeeping](https://en.wikipedia.org/wiki/Double-entry_bookkeeping) method of accounting
Specifically the "Accounting Equation" or "American" approach.

## Ledgers

## Ledger Types

| Ledger Type | Debit    | Credit   |
| ----------- | -------- | -------- |
| Asset       | Increase | Decrease |
| Liability   | Decrease | Increase |
| Capital     | Decrease | Increase |
| Revenue     | Decrease | Increase |
| Expense     | Increase | Decrease |

| Ledger              | Ledger Type |
| ------------------- | ----------- |
| Accounts Receivable | Asset       |
| Invoicing Liability | Liability   |
| Accounts Payable    | Liability   |
| Invoicing HST       | Liability   |
| Coach HST           | Liability   |
| Commision Revenue   | Revenue     |
| Cash                | Asset       |

| Action         | Debit Ledger        | Credit Ledger       | Notes                                                |
| -------------- | ------------------- | ------------------- | ---------------------------------------------------- |
| Client Invoice | Accounts Receivable | Invoicing Liability |                                                      |
|                | Accounts Receivable | Invoicing HST       |                                                      |
| Client Payment | Cash                | Accounts Receivable |                                                      |
| Coach PaySlip  | Invoicing Liability | Accounts Payable    |                                                      |
|                | Invoicing Liability | Commision Liability | Applicable if the coach is configured with commision |
|                | Invoicing HST       | Coach HST           |                                                      |
|                | Coach HST           | Accounts Payable    |                                                      |
| Coach Payment  | Accounts Payable    | Cash                |                                                      |

## Account Transactions

These accounts are viewed from the perspective of the client/coach,
as such _Credit_ represents the amount owed by the client/coach, and _Debit_ represents the amount they are owed.

Account transactions will always have at least one associated ledger transaction

| Action         | Transaction Type | Account Type |
| -------------- | ---------------- | ------------ |
| Client Invoice | Credit           | Client       |
| Client Payment | Debit            | Client       |
| Coach PaySlip  | Debit            | Coach        |
| Coach Payment  | Credit           | Coach        |
