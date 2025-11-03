const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const auth = require('../middleware/auth');
const xlsx = require('xlsx');

// Add Income
router.post('/add', auth, async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    const income = new Income({
      userId: req.user.userId,
      title,
      amount,
      category,
      date,
      description,
    });

    await income.save();
    res.status(201).json(income);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Income
router.get('/all', auth, async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Income
router.delete('/:id', auth, async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download Excel
router.get('/download', auth, async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.userId }).sort({ date: -1 });

    const data = incomes.map(income => ({
      Title: income.title,
      Amount: income.amount,
      Category: income.category,
      Date: new Date(income.date).toLocaleDateString(),
      Description: income.description || '',
    }));

    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Income');

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=income.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;