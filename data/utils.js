const getDate = () => {
  const today = new Date();
  const result =
    today.getFullYear() + "-" + today.getMonth() + 1 + "-" + today.getDate();
  return result;
};

module.exports = { getDate };
