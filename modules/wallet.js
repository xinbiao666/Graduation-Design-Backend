const { querydb } = require('../common/db-query')

function getBalance(param){
    const sql = `select * from user_wallet where user_id = ${param.user_id}`
    return querydb(sql)
}

module.exports = {
    getBalance
}