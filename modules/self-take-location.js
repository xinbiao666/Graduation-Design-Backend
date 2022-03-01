const { querydb } = require('../common/db-query');
const getFlatternDistance = require('../common/getFlatternDistance')

async function queryNearbyShopList(param) {
  const sql = `select * from self_take_location`;
  const shopList = await querydb(sql);
  const nearbyShopList = [];
  shopList.forEach((item) => {
    const distance = getFlatternDistance(
      param.latitude,
      param.longitude,
      item.latitude,
      item.longitude
    );
    if (distance < 300.0) {
      nearbyShopList.push(item);
    }
  });
  return nearbyShopList;
  // return shopList
}

async function queryUserCurrentSelfTakeLocation(param){
  const queryCurrentLocationIdSql = `select current_location_id from user_info where user_id = '${param.user_id}'`
  const [data] = await querydb(queryCurrentLocationIdSql)
  const queryCurrentLocationInfoSql = `select * from self_take_location where id = '${data.current_location_id}'`
  const [currentLocationInfo] = await querydb(queryCurrentLocationInfoSql)
  return currentLocationInfo
}

async function changeCurrentSelfTakeLocation(param){
  console.log(param)
  const updateSql = `update user_info set current_location_id = ${param.current_location_id} where user_id = ${param.user_id}`
  return querydb(updateSql)
}

module.exports = {
  queryNearbyShopList,
  queryUserCurrentSelfTakeLocation,
  changeCurrentSelfTakeLocation
};
