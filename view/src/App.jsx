import React, { useState, useEffect } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import { Container, Grid, TextField, Button, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { VictoryPie, VictoryTooltip } from 'victory';
//компоненты
import Modal from './components/Modal';
import ExpenseList from './components/ExpenseList';
// import functions to interact with controller.
import { fetchExpenses, expenseByCategory } from './utils';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [modal, setModal] = useState(false);
  const [id, setId] = useState(false);
  //состояние используется как значение по умолчанию в календаре
  const [selectDate, setSelectDate] = useState(new Date());

  useEffect(() => {
    // update view from model w/ controller
    fetchExpenses().then((res) => setExpenses(res));
  }, []);

  return (
    <Container className="App">
      <h1>Expense Tracker</h1>
      <Grid container>
        <Grid
          container
          direction="row"
          sx={{
            justifyContent: 'space-between',
            padding: '1rem',
          }}
          id="panel"
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Дата траты"
              value={selectDate}
              minDate={new Date('2023-01-01')}
              onChange={(newValue) => {
                setSelectDate(newValue);
                // update view from model w/ controller
                //передаем новую дату переведя ее в мс в функция которая отпарвит запрос на сервер. Получая решенный промис обновляем список трат. Траты будут за эту конкретную дату 
                fetchExpenses(newValue.getTime()).then((res) => setExpenses(res));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Button
            variant="outlined"
            onClick={() => {
              setId(null);
              setModal(!modal);
            }}
          >
            <AddCircleOutlineIcon />
          </Button>
        </Grid>
        {/* Если список трат массив и содержит элементыт то добавляем грид */}
        {Array.isArray(expenses) && expenses.length > 0 && (
          <Grid item xs={12} sm={6} md={6}>
            <Typography>Spending by Category</Typography>
            <VictoryPie
              colorScale="qualitative"
              labelComponent={<VictoryTooltip />}
              innerRadius={100}
              data={expenseByCategory(expenses)}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={6}>
          <Typography>Expenses on This Date</Typography>
          {/** компонент списка трат */}
          <ExpenseList
            setExpenses={(expensesList) => setExpenses(expensesList)}
            expenses={expenses}
            setId={(expenseId) => {
              setId(expenseId);
              setModal(!modal);
            }}
          />
        </Grid>
      </Grid>
      {/*всплывающее окно при нажатии кнопки с +*/}
      {modal && (
        <Modal
          modal
          expenses={expenses}
          setExpenses={(expensesList) => setExpenses(expensesList)}
          _id={id}
          handleClose={() => {
            setModal(!modal);
            setId(null);
          }}
        />
      )}
    </Container>
  );
}

export default App;
