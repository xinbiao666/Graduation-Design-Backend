const express = require('express');
const walletModule = require('../modules/wallet')
const wallet = express.Router();

wallet.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    const [data] = await walletModule.getBalance({ user_id });
    res.sendResult({ data }, 200, '获取成功');
  } catch (e) {
    console.log(e)
    res.sendResult({}, 500, '获取失败');
  }
});

module.exports = wallet;
