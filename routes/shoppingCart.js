const e = require('express');
const express = require('express');
const shoppingCartModule = require('../modules/shoppingCart');
const shoppingCart = express.Router();

shoppingCart.get('/add', async (req, res) => {
  const user_id = req.query.user_id;
  const goods_id = req.query.goods_id;
  try {
    const isRepeatition = await shoppingCartModule.checkRepeatition({
      user_id,
      goods_id,
    });
    if (isRepeatition) {
      const updateVal = await shoppingCartModule.addRepeatitionGoodsChangeNum({
        user_id,
        goods_id,
      });
      res.sendResult({}, 200, '添加购物车成功');
    } else {
      await shoppingCartModule.addGoods({ user_id, goods_id });
      res.sendResult({}, 200, '添加购物车成功');
    }
  } catch (e) {
    console.log(e);
    res.sendResult({}, 500, '添加购物车失败');
  }
});

shoppingCart.get('/query', async (req, res) => {
  const user_id = req.query.user_id;
  try {
    const shoppingCartList = await shoppingCartModule.queryCartList({
      user_id,
    });
    res.sendResult({ shoppingCartList }, 200, '查询购物车成功');
  } catch (e) {
    console.log(e);
    res.sendResult({}, 500, '查询购物车失败');
  }
});

shoppingCart.post('/changeSelectStatus', async (req, res) => {
  const user_id = req.body.user_id;
  const goods_id = req.body.goods_id;
  const status = req.body.status
  const checkAll = req.body.checkAll
  if(!req.body.selectAll){
    try{
      await shoppingCartModule.changeSelectStatus({ user_id, goods_id, status })
      res.sendResult({}, 200, '选择成功')
    }catch(e) {
      console.log(e)
      res.sendResult({}, 500, '选择失败')
    }
  }else{
    try{
      await shoppingCartModule.selectAll({ user_id, checkAll })
      res.sendResult({}, 200, '全选成功')
    }catch(e) {
      console.log(e)
      res.sendResult({}, 500, '全选失败')
    }
  }
})

shoppingCart.get('/isSelectAll',async (req, res)=>{
  const user_id = req.query.user_id
  try{
    const isSelectAll = await shoppingCartModule.isSelectAll({ user_id })
    res.sendResult({ isSelectAll }, 200, '获取选择状态成功')
  }catch(e) {
    res.sendResult({}, 500, '获取选择状态失败')
    console.log(e)
  }
})

shoppingCart.post('/changeGoodsNum',async (req, res) => {
  const user_id = req.body.user_id;
  const goods_id = req.body.goods_id;
  const goods_num = req.body.goods_num;
  try{
    await shoppingCartModule.changeGoodsNum({ user_id, goods_id, goods_num })
    res.sendResult({}, 200, '修改成功')
  }catch(e) {
    res.sendResult({}, 500, '修改失败')
  }
})

shoppingCart.post('/deleteGoods', async (req, res) => { 
  const user_id = req.body.user_id;
  const goods_id = req.body.goods_id;
  try{
    await shoppingCartModule.deleteGoods({ user_id, goods_id })
    res.sendResult({}, 200, '删除成功')
  }catch(e) {
    res.sendResult({}, 500, '删除失败')
  }
})

module.exports = shoppingCart;
