module.exports = (startDate, endDate) => {
  const date1 = new Date(startDate);
  const date2 = new Date(endDate);

  const date1utc = Date.UTC(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate()
  );
  const date2utc = Date.UTC(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate()
  );
  day = 1000 * 60 * 60 * 24;
  const timeDifference = (date2utc - date1utc) / day;

  if (timeDifference < 7 || timeDifference > 31) {
    return 1;
  } else {
    return 0;
  }
};
