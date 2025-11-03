const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Get Dashboard Data
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all incomes and expenses
    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });

    // Calculate totals
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpense;

    // Get recent transactions (last 5)
    const recentIncomes = await Income.find({ userId }).sort({ date: -1 }).limit(5);
    const recentExpenses = await Expense.find({ userId }).sort({ date: -1 }).limit(5);

    // Combine and sort recent transactions
    const recentTransactions = [...recentIncomes, ...recentExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Get last 30 days expenses
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30DaysExpenses = await Expense.find({
      userId,
      date: { $gte: thirtyDaysAgo },
    });

    // Get last 60 days income
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const last60DaysIncome = await Income.find({
      userId,
      date: { $gte: sixtyDaysAgo },
    });

    // Group expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Group income by category
    const incomeByCategory = incomes.reduce((acc, income) => {
      acc[income.category] = (acc[income.category] || 0) + income.amount;
      return acc;
    }, {});

    res.json({
      totalIncome,
      totalExpense,
      balance,
      recentTransactions,
      expensesByCategory,
      incomeByCategory,
      last30DaysExpenses,
      last60DaysIncome,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;