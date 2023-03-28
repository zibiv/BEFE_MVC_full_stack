//проверка получения всех данных, если какое-то из свойств пустое то возвращаем сообщение и перечень пустых полей
exports.fieldValidator = (fields) => {
  const { title, price, category, essential, created_at } = fields;
  //essential содержит булево значение и если содержит false пройдет следующее условие и вернет ошибку, хотя само значение и данное свойство присутствует, тоже самое касается price, если цена будет указана 0 то мы пройдем проверку и вернем ошибку.
  if (!title || typeof price === 'undefined' || !category || typeof essential === 'undefined' || !created_at) {
    const emptyFields = [];
    Object.keys(fields).forEach((field) => {
      if (fields[field].length <= 0) {
        emptyFields.push(field);
      }
    });
    return {
      error: 'All fields are required',
      emptyFields,
    };
  }
  return null;
};
