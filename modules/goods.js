const { querydb } = require('../common/db-query')

function queryGoodsList(typeId) {
  const sql = `select * from goods_info where goods_class = ${typeId}`;
  return querydb(sql)
}

function queryGoodsDetail(goodsId) {
  const sql = `select * from goods_info where goods_id = ${goodsId}`;
  return querydb(sql)
}

function queryGoodsSwiperImg(goodsId) {
  const sql = `select * from goods_swiper_img where goods_id = ${goodsId}`;
  return querydb(sql)
}

function queryTabList(){
  const sql = 'select * from goods_tabs'
  return querydb(sql)
}

module.exports = {
  queryGoodsList,
  queryGoodsDetail,
  queryGoodsSwiperImg,
  queryTabList
};
