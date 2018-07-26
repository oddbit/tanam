export default (state, fieldsArr) => {
  const fieldKey = Object.keys(state).filter(key => fieldsArr.includes(key));
  let fieldsObj = {};
  fieldKey.map(field => (fieldsObj[field] = state[field]));
  return fieldsObj;
};
