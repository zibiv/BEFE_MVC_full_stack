export const fetchExpenses = async (date) => {
  const selectDate = new Date(date).getTime() || new Date().getTime();
  console.log(selectDate, `http://localhost:4001/api/expense/list/${selectDate}`);
  const res = await fetch(`http://localhost:4001/api/expense/list/${selectDate}`);
  const resJson = await res.json();
  console.log(resJson);
  return resJson;
};
//проверка статуса ответа на соответствие параметру + проверка тела запроса на наличие сообщение о пропущенных свойствах в теле запроса см код в controllers
export const resHandler = async (res, status) => {
  if (res.status === status) {
    return null;
  }
  //получение тела ответа
  const data = await res.json();
  if (data && data.emptyFields) {
    return data.emptyFields;
  }
  return null;
};

//отправка запроса на создание траты
export const createExpense = async (data) => {
  const res = await fetch(`/api/expense/create`, {
    method: 'POST',
    body: data,
  });
  return resHandler(res, 201);
};

export const updateExpense = async (_id, data) => {
  const res = await fetch(`/api/expense/${_id}`, {
    method: 'PUT',
    body: data,
  });
  return resHandler(res, 200);
};

export const fetchExpense = async (_id) => {
  const res = await fetch(`api/expense/${_id}`);
  return res.json();
};

export const deleteExpense = async (_id) =>
  fetch(`api/expense/${_id}`, {
    method: 'DELETE',
  });

export const formSetter = (data, form) => {
  //получаем массив свойств объекта form для каждого из них 
  Object.keys(form).forEach((key) => {
    data.set(key, form[key]);
  });
};

export const expenseByCategory = (expenses) => {
  //необходимо суммировать траты по категориям, функция получает массив состоящий из объектов трат
  //каждый объект имеет следующую структуру
  /**
   * {
      category: 'work',
      created_at: '2023-03-29T08:40:00.000Z',
      essential: true,
      expense_id: 54,
      price: '2000.12',
      title: 'someTitle',
    };
     */
  const categoryBreakdown = expenses.reduce((total, num) => {
    //используется функция reducer которая будет совершать определенные в функции действия с каждым элементом массива и общим результатом этих действий
    //при первом запуске редъюсера берется пустой объект
    const curTotal = total;
    console.log(Object.keys(total));
    //дальше перебираются его ключи в поисках названия категории и проверяется присутствует ли ключ с называнием категории в объекте total и значение содержащиеся в свойстве category в очередном объекте 
    if (Object.keys(total).includes(num.category)) {
      //если содержит создаем свойство с названием категории и складываем то что содержится под тем же свойством в total + то что содержится в свойстве price объекта траты
      curTotal[`${num.category}`] =
        Number(total[`${num.category}`]) + Number(num.price);
    } else {
      //если такого ключа нет то создаем его и передаем туда price траты
      curTotal[`${num.category}`] = Number(num.price);
    }
    // возвращаем обновленный объект в следующей итерации он станет total
    return curTotal;
  }, {});
  //в результате работы reducer'а мы получим объект в котором будут категории их сумма среди всех объектов трат
  const data = Object.keys(categoryBreakdown).map((category) => ({
    //создаем объект для VictoryPie где каждый ключ из объекта categoryBreakdown будет представлять собой объект в следующей форме :
    x: category,
    y: categoryBreakdown[category],
  }));
  //получаем массив таких объектов
  return data;
};
