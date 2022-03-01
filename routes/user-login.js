const express = require('express');
const userLogin = require('../modules/user-login');
const wxConfig = require('../config/weapp-config');
const login = express.Router();

login.get('/', async (req, res) => {
  try {
    const { AppID, AppSecret } = wxConfig;
    const { code, userInfo } = req.query;
    const { data, status } = await userLogin.getWxOpenId(
      AppID,
      AppSecret,
      code
    );
    const userInfoPaser = JSON.parse(userInfo);
    const wxParam = JSON.parse(data);
    const newUser = await userLogin.loginUser({ ...wxParam, ...userInfoPaser });
    if (status === 200) {
      res.sendResult({ ...newUser[0] }, 200, 'openid获取成功');
    } else {
      res.sendResult({}, 500, 'openid获取失败');
    }
  } catch (e) {
    console.log(e)
    res.sendResult({}, 500, 'openid获取失败');
  }
});

module.exports = login;
