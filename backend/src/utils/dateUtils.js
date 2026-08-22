const getDaysBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

module.exports = {
  getDaysBetweenDates,
  formatDate
};
