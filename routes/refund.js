const express = require('express');
const refund = express.Router();
const refundModule = require('../modules/refund');

refund.post('/cancelOrder',async (req, res) => {
    try{
        const { order_id, user_id, refund_reason, refund_explain, goods_id } = req.body;
        await refundModule.generateRefundOrder({ order_id, user_id, refund_reason, refund_explain, goods_id })
        res.sendResult({}, 200, '申请成功')
    }catch(e) {
        console.log(e)
        res.sendResult({}, 500, '申请失败')
    }
})

module.exports = refund;
