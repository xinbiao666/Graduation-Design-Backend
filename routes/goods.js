const express = require('express');
const goods = express.Router();
const goodsModule = require('../modules/goods');
// const { querydb } = require('../common/db-query');

goods.get('/query', async (req, res) => {
  const goodsId = req.query.id;
  try {
    const goodsInfo = await goodsModule.queryGoodsDetail(goodsId);
    const goodsSwiperImg = await goodsModule.queryGoodsSwiperImg(goodsId);
    res.sendResult({ goodsInfo, goodsSwiperImg }, 200, '获取成功');
  } catch (e) {
    console.log(e)
    res.sendResult({}, 500, '获取数据失败');
  }
});

goods.get('/queryTabList',async (req, res)=>{
  try {
    const goodsTabsList = await goodsModule.queryTabList()
    res.sendResult({ goodsTabsList }, 200, '获取成功');
  } catch (e) {
    console.log(e)
    res.sendResult({}, 500, '获取数据失败');
  }
})

goods.get('/queryGoodsList',async (req,res) => {
  try{
    const typeId = req.query.typeId
    const goodsList = await goodsModule.queryGoodsList(typeId)
    res.sendResult({ goodsList }, 200, '获取成功');
  } catch(e){
    console.log(e)
    res.sendResult({}, 500, '获取数据失败');
  }
})

// 添加商品临时接口
// goods.post('/addGoods',async (req,res) => {
//   const { goods_name,goods_price,goods_reference_price,goods_number,goods_producing_area,goods_class,goods_cover } = req.body
//   const sql = `insert into goods_info (goods_name,goods_price,goods_reference_price,goods_number,goods_producing_area,goods_class,goods_cover) values ('${goods_name}','${goods_price}','${goods_reference_price}','${goods_number}','${goods_producing_area}','${goods_class}','${goods_cover}')`
//   console.log(await querydb(sql))
//   res.send('ok')
// })

module.exports = goods;
