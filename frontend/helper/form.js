export const getValueFormSubmit = ({ eventForm, formValues }) => {
  let values = {};
  let fieldsForm = eventForm ? eventForm.target : [];
  Array.from(fieldsForm).forEach(target => {
    let fieldName = target['name'];
    if(fieldName) {
      values[fieldName] = formValues[fieldName];
    }
  })
  
  return values;
}
