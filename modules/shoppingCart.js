const { querydb } = require('../common/db-query');

async function addGoods(param) {
  const searchSql = `select goods_id,goods_price,goods_name,goods_cover from goods_info where goods_id = '${param.goods_id}'`;
  const goodsInfo = await querydb(searchSql);
  const sql = `insert into user_shopping_cart (goods_id,user_id,status,num,goods_price,goods_name,goods_cover) values ('${param.goods_id}','${param.user_id}', '0','1','${goodsInfo[0].goods_price}','${goodsInfo[0].goods_name}','${goodsInfo[0].goods_cover}')`;
  return querydb(sql);
}

function queryCartList(param) {
  const sql = `select * from  user_shopping_cart where user_id = '${param.user_id}'`;
  return querydb(sql);
}

async function checkRepeatition(param) {
  const sql = `select * from user_shopping_cart where (goods_id = '${param.goods_id}' and user_id = '${param.user_id}')`;
  const res = await querydb(sql);
  if (res.length) {
    return true;
  } else {
    return false;
  }
}

async function addRepeatitionGoodsChangeNum(param) {
  const sherchSql = `select * from user_shopping_cart where (goods_id = '${param.goods_id}' and user_id = '${param.user_id}')`;
  const res = await querydb(sherchSql);
  const newVal = ++res[0].num;
  const updateSql = `update user_shopping_cart set num = ${newVal} where (goods_id = '${param.goods_id}' and user_id = '${param.user_id}')`;
  await querydb(updateSql);
  return querydb(sherchSql);
}

async function changeSelectStatus(param) {
  const status = param.status ? 1 : 0;
  const sql = `update user_shopping_cart set status = ${status} where (goods_id = '${param.goods_id}' and user_id = '${param.user_id}')`;
  return querydb(sql);
}

function selectAll(param) {
  const updateSql = `update user_shopping_cart set status = '${param.checkAll}' where user_id = '${param.user_id}'`;
  return querydb(updateSql);
}

async function isSelectAll(param) {
  const sql = `select * from user_shopping_cart where user_id = '${param.user_id}'`;
  const data = await querydb(sql);
  for (let item of data) {
    if (!item.status) {
      return false;
    }
  }
  return true;
}

function changeGoodsNum(param){
    const updateSql = `update user_shopping_cart set num = '${param.goods_num}' where (goods_id = '${param.goods_id}' and user_id = '${param.user_id}')`;
    return querydb(updateSql);
}

function deleteGoods(param){
  const delSql = `delete from user_shopping_cart where user_id = '${param.user_id}' and goods_id = '${param.goods_id}'`
  return querydb(delSql);
}

module.exports = {
  addGoods,
  queryCartList,
  checkRepeatition,
  changeGoodsNum,
  addRepeatitionGoodsChangeNum,
  changeSelectStatus,
  selectAll,
  isSelectAll,
  deleteGoods
};
