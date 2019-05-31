exports.getOneDayMilliseconds = () => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1);

  return expirationDate.getTime();
};
