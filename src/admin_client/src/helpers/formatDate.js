import format from 'date-fns/format';

const formatDate = timestamp => format(timestamp, 'YYYY-MM-DD HH:mm A');

export default formatDate;
