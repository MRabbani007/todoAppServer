// const getDate = () => {
//   const today = new Date();
//   const result =
//     today.getFullYear() + "-" + today.getMonth() + 1 + "-" + today.getDate();
//   return result;
// };

const getDate = (offset = 0) => {
  const today = new Date(new Date().getTime() + offset * 24 * 60 * 60 * 1000);

  // Format <"YYYY-MM-DD"> for mongoDb
  const result =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }) +
    "-" +
    today.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
  return result;
};

module.exports = { getDate };
