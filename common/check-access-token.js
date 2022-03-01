module.exports = function (req, res, next) {
  if(req.header.access_token){
    next();
  }else {
    res.sendResult({}, 403, '请先登录')
  }
};
