const request = require('request');
const { querydb } = require('../common/db-query')

function getWxOpenId(appID, appSecret, code) {
  const query = `appid=${appID}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
  const url = `https://api.weixin.qq.com/sns/jscode2session?${query}`;
  return new Promise((resolve, reject)=>{
    request.get({ url }, (error, response, body) => {
      if (response.statusCode === 200) {
        const param = {
          data: body,
          status: 200,
          message: 'openid获取成功'
        }
        resolve(param)
      }else {
        reject(error)
      }
    });
  })
}

function insertUser(param){
  const sql = `insert into user_info (openid,session_key,nick_name,gender,avatar_url,city,province,country) values ('${param.openid}','${param.session_key}','${param.nickName}','${param.gender}','${param.avatarUrl}','${param.city}','${param.province}','${param.country}')`
  return querydb(sql)
}

function insertUserWallet(param){
  const sql = `insert insert into user_wallet user_id ${param.user_id}`
  return querydb(sql)
}

function queryUser(param){
  const sql = `select * from user_info where openid = '${param.openid}'`
  return querydb(sql)
}

async function loginUser(param){
  const res = await queryUser(param)
  if(!res.length){
    const info = await insertUser(param)
    insertUserWallet({ user_id: info.insertId})
    return queryUser(param)
  }else {
    const updateSql = `update user_info set session_key = '${param.session_key}', nick_name = '${param.nickName}', avatar_url = '${param.avatarUrl}', gender = '${param.gender}' where user_id = ${res[0].user_id}`
    await querydb(updateSql)
    return queryUser(param)
  }
}

module.exports = {
  getWxOpenId,
  loginUser
};
