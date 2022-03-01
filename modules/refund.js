const { querydb } = require('../common/db-query');
const parseDate = require('../common/parseDate');
async function generateRefundOrder(param) {
  try {
    if (param.goods_id) {
      await refundGoods(param);
    } else {
      await cancelOrder(param);
    }
  } catch (e) {
    console.log(e);
  }
}

async function checkOrderStatus(param) {
  const sql = `select order_status from order_info where order_id = ${param.order_id}`;
  const [data] = await querydb(sql);
  if (data.order_status === 0) {
    return 'to-be-ship';
  } else {
    return 'is-delivered';
  }
}

async function refund(param){
  const queryGoodsSql = `select * from order_goods where order_id = ${param.order_id}`
  const data = await querydb(queryGoodsSql);
  let totalPrice = 0;
  data.forEach((item) => {
    totalPrice += item.goods_num * item.goods_price;
  });
  const refundNum =  parseFloat(totalPrice.toFixed(2));
  const queryBalanceSql = `select balance from user_wallet where user_id = ${param.user_id}`
  const [balanceData] = await querydb(queryBalanceSql)
  const newBalance = balanceData.balance + refundNum
  const updateBalanceSql = `update user_wallet set balance = ${newBalance}`
  await querydb(updateBalanceSql)
}

async function cancelOrder(param) {
  try {
    const dateTime = parseDate(new Date());
    const { order_id, user_id, refund_reason, refund_explain } = param;
    const insertRefundSql = `insert into refund_order (order_id, user_id, refund_reason, refund_explain) values ('${order_id}','${user_id}','${refund_reason}','${refund_explain}')`;
    const { insertId: refund_id } = await querydb(insertRefundSql);
    const queryOrderGoodsSql = `select * from order_goods where order_id = '${order_id}'`;
    const refundGoodsList = await querydb(queryOrderGoodsSql);
    for (let item of refundGoodsList) {
      let insertRefundGoodsSql = '';
      if ((await checkOrderStatus(param)) === 'to-be-ship') {
        insertRefundGoodsSql = `insert into refund_goods (order_id,goods_id,refund_num,goods_name,goods_num,goods_price,goods_cover,apply_time,refund_id,refund_status) values ('${item.order_id}','${item.goods_id}','${item.goods_num}','${item.goods_name}','${item.goods_num}','${item.goods_price}','${item.goods_cover}','${dateTime}','${refund_id}',1)`;
        // 未发货订单直接取消，直接改变订单状态为已取消，商品状态为已退款
        const changeOrderStatusSql = `update order_info set order_status = '3' where order_id = ${order_id}`
        const changeOrderGoodsStatusSql = `update order_goods set refund_status = '1' where order_id = ${order_id}`
        await querydb(changeOrderStatusSql);
        await querydb(changeOrderGoodsStatusSql);
        // 欠款返还
        refund({ order_id, user_id })
      } else {
        insertRefundGoodsSql = `insert into refund_goods (order_id,goods_id,refund_num,goods_name,goods_num,goods_price,goods_cover,apply_time,refund_id) values ('${item.order_id}','${item.goods_id}','${item.goods_num}','${item.goods_name}','${item.goods_num}','${item.goods_price}','${item.goods_cover}','${dateTime}','${refund_id}')`;
        // 更改订单商品退款状态
        const changeOrderGoodsStatusSql = `update order_goods set refund_status = '0' where order_id = ${order_id}`
        await querydb(changeOrderGoodsStatusSql);
      }
      await querydb(insertRefundGoodsSql);
      const updateSql = `update order_goods set is_refund = '1' where order_id = ${item.order_id}`;
      await querydb(updateSql);
    }
  } catch (e) {
    console.log(e);
  }
}

async function refundGoods(param) {
  const dateTime = parseDate(new Date());
  const { order_id, user_id, refund_reason, refund_explain, goods_id } = param;
  const insertRefundSql = `insert into refund_order (order_id, user_id, refund_reason, refund_explain) values ('${order_id}','${user_id}','${refund_reason}','${refund_explain}')`;
  const { insertId: refund_id } = await querydb(insertRefundSql);
  const queryGoodsSql = `select * from order_goods where order_id = '${order_id}' and goods_id = ${goods_id}`;
  const [refundGoods] = await querydb(queryGoodsSql);
  const insertRefundGoodsSql = `insert into refund_goods (order_id,goods_id,refund_num,goods_name,goods_num,goods_price,goods_cover,apply_time,refund_id) values ('${refundGoods.order_id}','${refundGoods.goods_id}','${refundGoods.goods_num}','${refundGoods.goods_name}','${refundGoods.goods_num}','${refundGoods.goods_price}','${refundGoods.goods_cover}','${dateTime}','${refund_id}')`;
  await querydb(insertRefundGoodsSql);
  const updateSql = `update order_goods set is_refund = '1' where order_id = ${refundGoods.order_id} and goods_id = ${goods_id}`;
  await querydb(updateSql);
}

module.exports = {
  generateRefundOrder
};
