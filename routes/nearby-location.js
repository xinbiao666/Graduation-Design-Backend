const express = require('express');
const location = express.Router();
const locationModule = require('../modules/self-take-location');

location.post('/queryNearbyShop', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const nearbyShopList = await locationModule.queryNearbyShopList({
      latitude,
      longitude,
    });
    res.sendResult({ nearbyShopList }, 200, '查询成功');
  } catch (e) {
    console.log(e);
    res.sendResult({}, 200, '查询失败');
  }
});

location.get('/getCurrentLocation', async (req, res) => {
  try {
    const { user_id } = req.query;
    const currentLocationInfo = await locationModule.queryUserCurrentSelfTakeLocation({ user_id });
    res.sendResult({ currentLocationInfo }, 200, '获取成功');
  } catch (e) {
    console.log(e);
    res.sendResult({}, 500, '获取失败');
  }
});

location.post('/changeCurrentLocation', async (req, res) => {
  try {
    const { user_id, current_location_id } = req.body;
    await locationModule.changeCurrentSelfTakeLocation({ user_id, current_location_id });
    res.sendResult({}, 200, '修改成功');
  } catch (e) {
    console.log(e);
    res.sendResult({}, 500, '修改失败');
  }
})

module.exports = location;
