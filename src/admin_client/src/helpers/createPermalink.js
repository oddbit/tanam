const yymmddDate = () => {
  const d = new Date();
  const fullYear = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString();
  const date = d.getDate().toString();
  const YY = fullYear.slice(2);
  const MM = month.length > 1 ? month : '0' + month;
  const DD = date.length > 1 ? date : '0' + date;
  return YY + MM + DD;
};

const createPermalink = str => {
  const title = str.replace(/\s+/g, '-').toLowerCase();
  console.log(title);
  return `${yymmddDate()}-${title}`;
};

export default createPermalink;
