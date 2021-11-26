exports.success = (data) => {
  return {
    code: "0000",
    data: data
  };
};

exports.failure = (code, msg) => {
  return {
    code: code,
    message: msg
  };
};