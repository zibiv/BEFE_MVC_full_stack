const formidable = require('formidable');//модуль для парсинга форм в том числе которые передают файлы 
const { endOfDay, startOfDay } = require('date-fns');
const pool = require('../models/database');//наша бд
const { fieldValidator } = require('../utils/index');//проверка наличия данных всех полей формы
//контроллер для добавления данных из формы в таблицу
exports.create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  //парсим форму передавая запрос и error first CB функцию 
  form.parse(req, async (err, fields) => {
    const { title, price, category, essential, created_at } = fields;
    // check for all fields
    if (fieldValidator(fields)) {
      return res.status(400).json(fieldValidator(fields));
    }
    try {
      const query = {
        text: 'INSERT INTO expenses (title, price, category, essential, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        values: [title, price, category, essential, created_at],
        rowMode: 'array',
      }
      //используем node-postgre для того что бы добавить запись в таблицу 
      const newExpense = await pool.query(query);
      return res.status(201).send(`User added: ${newExpense.rows}`);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  });
};

//обновление записи в таблице 
exports.update = (req, res) => {
  const form = new formidable.IncomingForm();
  //переводим в число параметр из запроса
  const id = Number(req.params.id);
  form.keepExtensions = true;
  form.parse(req, async (err, fields) => {
    // check for all fields
    const { title, price, category, essential, created_at } = fields;
    if (fieldValidator(fields)) {
      return res.status(400).json(fieldValidator(fields));
    }
    try {
      await pool.query(
        'UPDATE expenses SET title = $1, price = $2, category = $3, essential = $4, created_at = $5 WHERE expense_id = $6',
        [title, price, category, essential, created_at, id]
      );

      return res.status(200).send(`User modified with ID: ${id}`);
    } catch (error) {
      return res.status(400).json({
        error,
      });
    }
  });
};
//получение записи по id, проверка параметра в mw функции
exports.expenseById = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const expense = await pool.query(
      'SELECT * FROM expenses WHERE expense_id = $1',
      [id]
    );
    req.expense = expense.rows;
    return next();
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};
//mw функция для получения записей в вилке дат
exports.expenseByDate = async (req, res, next, dateParam) => {
  //позволяет указывать дату в параметре в виде 'yyyy-mm-dd'
  const date = Date.parse(dateParam);
  try {
    const expenseQuery = await pool.query(
      'SELECT * FROM expenses WHERE created_at BETWEEN $1 AND $2',
      [
        startOfDay(new Date(Number(date))).toISOString(),
        endOfDay(new Date(Number(date))).toISOString(),
      ]
    );
    const expenseList = expenseQuery.rows;
    //проверка есть ли записи удовлетворяющие данной вилке дат.
    req.expense =
      expenseList.length > 0
        ? expenseList
        : `No expenses were found on this date.`;
    return next();
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
//возврат найденных в mw значений id или по вилке дат
exports.read = (req, res) => res.json(req.expense);
//удаление данных из таблицы
exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await pool.query('DELETE FROM expenses WHERE expense_id = $1', [id]);
    return res.status(200).send(`User deleted with ID: ${id}`);
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};
