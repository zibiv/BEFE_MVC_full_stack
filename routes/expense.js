// require express and it's router component
const express = require('express');

const router = express.Router();

// require the middlewares and callback functions from the controller directory
const { create, expenseById, read, update, remove, expenseByDate  } = require('../controllers')
router.param('expenseDate',expenseByDate)
// Create POST route to create an expense
router.post('/expense/create', create);
// Create PUT route to update an expense
router.put('/expense/:id', expenseById, update);
// Create DELETE route to remove an expense
router.delete('/expense/:id', expenseById, remove)
// Create GET route to read an expense
router.get('/expense/:id', expenseById, read);
// Create GET route to read a list of expenses
//получение всех записей за определенный промежуток дат
router.get('/expense/list/:expenseDate', read);

module.exports = router;
