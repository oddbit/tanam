const isoDateToDatetime = isodate => {
  const d = new Date(isodate);
  const year = d.getFullYear();
  const m = (d.getMonth() + 1).toString();
  const month = m.length > 1 ? m : '0' + m;
  const dt = d.getDate().toString();
  const date = dt.length > 1 ? dt : '0' + dt;
  const time = d.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  return `${year}-${month}-${date} ${time}`;
};

export default isoDateToDatetime;
