exports.parseFloat = (val) => (typeof val === 'number') ? val : parseFloat(val.replace(/,/g, ""));

exports.addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

exports.sleep = (f, delay) =>{
  return new Promise((res, rej) => {
     setTimeout(() => res(f), delay)
  });
}
