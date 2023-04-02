import React, { Fragment, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { deleteExpense } from '../utils';

const ExpenseList = ({ expenses, setExpenses, setId }) => {
  const [options, setOptions] = useState();

  const handleDelete = async (_id) => {
    /* send user action to controller
     *
     */
    const response = await deleteExpense(_id);
    if(response.status === 200) setExpenses(expenses.filter((expense) => expense.expense_id !== _id));
  };

  return (
    <List
      sx={{
        maxHeight: '60vh',
        overflow: 'auto',
      }}
    >
      {typeof expenses !== 'string' ? (
        //для каждой из трат мы создаем ListItem
        expenses.map(({ expense_id, title, price }) => (
          <ListItem key={expense_id}>
            <ListItemButton
              variant="text"
              onClick={() =>
                //при нажатии на кнопку состоянию options назначается expense_id, если до этого там был null и наоборт, своего рода переключатель
                setOptions(options === expense_id ? null : expense_id)
              }
            >
              <ListItemText primary={title} secondary={`$ ${price}`} />
              {/*если expense_id этой траты совпадает с тем что находится в состоянии option то выбран именно этот элемент списка для данной траты, то выводятся элементы изменения траты и ее удаления*/}
              {options === expense_id && (
                <Fragment>
                  <IconButton
                    edge="end"
                    aria-label="update"
                    onClick={() => {
                      setId(expense_id);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(expense_id)}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </Fragment>
              )}
            </ListItemButton>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary={expenses} />
        </ListItem>
      )}
    </List>
  );
};

export default ExpenseList;
