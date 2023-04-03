const express = require('express');
require('dotenv').config();
const expenseRoutes = require('./routes/expense');
const cors = require('cors');

// Running express server
const app = express();
const port = process.env.PORT || 8000;
app.use(cors({
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"]
}));
// route middlewares
app.use('/api', expenseRoutes);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
