const express = require('express');
const order = express.Router();
const orderModule = require('../modules/order');

order.post('/generateOrder', async (req, res) => {
  try {
    const goods_num = req.body.goods_num;
    const goods_id = req.body.goods_id;
    const user_id = req.body.user_id;
    if (
      Object.keys(req.body).includes('goods_id') &&
      Object.keys(req.body).includes('goods_num')
    ) {
      const orderInfo = await orderModule.generateAloneGoodsOrder({
        goods_num,
        goods_id,
        user_id,
      });
      res.sendResult(orderInfo, 200, '下单成功');
    } else if (
      !Object.keys(req.body).includes('goods_id') &&
      !Object.keys(req.body).includes('goods_num')
    ) {
      const orderInfo = await orderModule.generateShoppingCartOrder({ user_id });
      res.sendResult(orderInfo, 200, '下单成功');
    } else {
      res.sendResult({}, 500, '参数错误');
    }
  } catch (e) {
    res.sendResult({}, 500, '下单失败');
  }
});

order.get('/query',async (req, res) => {
  try{
    const user_id = req.query.user_id
    const order_status = req.query.order_status
    const orderList = await orderModule.queryOrderList({user_id, order_status})
    res.sendResult({ orderList }, 200, '查询成功')
  }catch(e) {
    console.log(e)
    res.sendResult({}, 500, '查询失败')
  }
})

order.get('/queryOrderDetail',async (req, res) => {
  try{
    const order_id = req.query.order_id
    const orderDetail = await orderModule.queryOrderDetail({order_id})
    res.sendResult({ orderDetail }, 200, '查询成功')
  }catch(e) {
    console.log(e)
    res.sendResult({}, 500, '查询失败')
  }
})

order.get('/queryRefundDetail', async (req, res) => {
  try{
    const goods_id = req.query.goodsId
    const refund_id = req.query.refundId
    const refundOrderDetail = await orderModule.queryRefundOrderDetail({ goods_id, refund_id })
    res.sendResult({ refundOrderDetail }, 200, '查询成功')
  }catch(e) {
    console.log(e)
    res.sendResult({}, 500, '查询失败')
  }
})

module.exports = order;
