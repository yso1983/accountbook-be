exports.parseFloat = (val) => (typeof val === 'number') ? val : parseFloat(val.replace(/,/g, ""));
