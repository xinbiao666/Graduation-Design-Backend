// 响应封装
module.exports = function (req, res, next) {
  res.sendResult = function (data, code, message) {
    res.json({
      ...data,
      meta: {
        msg: message,
        status: code,
      },
    });
  };
  next();
};
