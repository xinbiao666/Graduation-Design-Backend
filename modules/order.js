const { querydb } = require('../common/db-query');
const randomOrderId = require('../common/randomOrderId');
const parseDate = require('../common/parseDate');

// 计算总额
function computePrice(param) {
  let totalPrice = 0;
  param.forEach((item) => {
    totalPrice += item.num * item.goods_price;
  });
  return parseFloat(totalPrice.toFixed(2));
}

// 获取购物车信息
async function getShoppingCartList(param) {
  const { user_id } = param;
  const sql = `select * from user_shopping_cart where (user_id = '${user_id}' and status = 1)`;
  return querydb(sql);
}

// 购物车订单提交
async function generateShoppingCartOrder(param) {
  const orderGoodsList = await getShoppingCartList({ user_id: param.user_id });
  const totalPrice = computePrice(orderGoodsList);
  const order = generateOrder({
    totalPrice,
    orderGoodsList,
    user_id: param.user_id,
  });
  const querySql = `select balance from user_wallet where user_id = '${param.user_id}'`;
  const data = await querydb(querySql);
  const updateBalance = parseFloat(data[0].balance - totalPrice).toFixed(2);
  const updateSql = `update user_wallet set balance = '${updateBalance}' where user_id = ${param.user_id}`;
  await querydb(updateSql);
  return order;
}

// 单个商品订单提交
async function generateAloneGoodsOrder(param) {
  const user_id = param.user_id;
  const goods_num = param.goods_num;
  const goods_id = param.goods_id;
  const querySql = `select * from goods_info where goods_id = '${goods_id}'`;
  const queryPriceData = await querydb(querySql);
  const totalPrice = computePrice([
    { goods_price: queryPriceData[0].goods_price, num: goods_num },
  ]);
  const order = generateOrder({
    totalPrice,
    orderGoodsList: queryPriceData,
    num: goods_num,
    user_id,
  });
  const queryBalanceSql = `select balance from user_wallet where user_id = '${user_id}'`;
  const balanceData = await querydb(queryBalanceSql);
  const updateBalance = parseFloat(balanceData[0].balance - totalPrice).toFixed(
    2
  );
  const updateSql = `update user_wallet set balance = '${updateBalance}' where user_id = ${user_id}`;
  await querydb(updateSql);
  return order;
}

// 生成订单
async function generateOrder(param) {
  try {
    const orderId = randomOrderId();
    const confirmTime = parseDate(new Date());
    const paymentType = 0;
    const orderStatus = 0;
    const insertOrderInfoSql = `insert into order_info (order_id,order_confirm_time,payment_type,goods_total_price,total_real_cost,order_status,user_id) values ('${orderId}','${confirmTime}','${paymentType}','${param.totalPrice}','${param.totalPrice}','${orderStatus}','${param.user_id}')`;
    await querydb(insertOrderInfoSql);
    param.orderGoodsList.forEach(async (item) => {
      const insertOrderGoodsSql = `insert into order_goods (order_id,goods_id,goods_num,goods_name,goods_price,goods_cover) values ('${orderId}','${
        item.goods_id
      }','${item.num || param.num}','${item.goods_name}','${
        item.goods_price
      }','${item.goods_cover}')`;
      await querydb(insertOrderGoodsSql);
    });
    const queryOrderSql = `select * from order_info where order_id = '${orderId}'`;
    const queryOrderGoodsSql = `select * from order_goods where order_id = '${orderId}'`;
    const orderInfo = await querydb(queryOrderSql);
    const orderGoods = await querydb(queryOrderGoodsSql);
    const order = { ...orderInfo[0], goodsList: orderGoods };
    return order;
  } catch (e) {
    console.log(e);
  }
}

// 获取订单列表
async function queryOrderList(param) {
  try {
    let queryOrderInfoSql = '';
    if (param.order_status === 'all') {
      queryOrderInfoSql = `select * from order_info where user_id = '${param.user_id}'`;
    } else {
      if (param.order_status === 'wait-send') {
        queryOrderInfoSql = `select * from order_info where (user_id = '${param.user_id}' and order_status = '0')`;
      } else if (param.order_status === 'wait-receive') {
        queryOrderInfoSql = `select * from order_info where (user_id = '${param.user_id}' and order_status = '1')`;
      } else if(param.order_status === 'refund'){
        const refundOrderInfoList = await queryRefundList({ user_id: param.user_id })
        refundOrderInfoList
        return refundOrderInfoList;
      }
    }
    const orderList = await querydb(queryOrderInfoSql);
    for (let item of orderList) {
      const queryOrderGoodsSql = `select * from order_goods where order_id = '${item.order_id}'`;
      const goodsList = await querydb(queryOrderGoodsSql);
      item.orderGoodsList = goodsList;
    }
    return orderList;
  } catch (e) {
    console.log(e);
  }
}

// 获取退款订单列表
async function queryRefundList(param){
  const queryRefundOrderSql = `select * from refund_order where user_id = '${param.user_id}'`
  const refundOrderList = await querydb(queryRefundOrderSql)
  for(let item of refundOrderList){
    let refundTotalPrice = 0
    const queryRefundGoodsSql = `select * from refund_goods where refund_id = '${item.refund_id}'`
    const queryOrderInfoSql = `select total_real_cost from order_info where order_id = '${item.order_id}'`
    const refundGoodsList = await querydb(queryRefundGoodsSql)
    const [orderTotalRealCost] = await querydb(queryOrderInfoSql)
    item.orderTotalRealCost = orderTotalRealCost.total_real_cost
    item.refundGoodsList = refundGoodsList
    refundGoodsList.forEach(item => {
      refundTotalPrice += parseFloat((item.goods_price * item.refund_num).toFixed(2))
    })
    item.refundTotalPrice = refundTotalPrice
  }
  return refundOrderList
}

// 订单详情
async function queryOrderDetail(param) {
  const queryOrderInfoSql = `select * from order_info where order_id = '${param.order_id}'`;
  const queryOrderGoodsSql = `select * from order_goods where order_id = '${param.order_id}'`;
  const orderDetail = (await querydb(queryOrderInfoSql))[0];
  const goodsList = await querydb(queryOrderGoodsSql);
  orderDetail.goodsList = goodsList
  return orderDetail
}

// 退款订单详情
async function queryRefundOrderDetail(param) {
  const queryRefundOrderSql = `select * from refund_order where refund_id = ${param.refund_id}`
  const queryRefundGoodsSql = `select * from refund_goods where refund_id = ${param.refund_id} and goods_id = ${param.goods_id}`
  const [refundOrder] = await querydb(queryRefundOrderSql);
  const [refundGoods] = await querydb(queryRefundGoodsSql);
  const refund_price = parseFloat((refundGoods.goods_num * refundGoods.goods_price).toFixed(2))
  const refundOrderDetail = { ...refundOrder, ...refundGoods, refund_price }
  return refundOrderDetail
}

module.exports = {
  generateShoppingCartOrder,
  generateAloneGoodsOrder,
  queryOrderList,
  queryOrderDetail,
  queryRefundOrderDetail
};
