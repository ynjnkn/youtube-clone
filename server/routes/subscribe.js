const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

// *** 구독자 수 불러오기 라우터 ***
router.post("/subscriberNumber", (req, res) => {
    Subscriber
        .find({ 'userTo': req.body.userTo })
        .exec((err, subscriptionCases) => {
            if (err) {
                return res
                    .status(400)
                    .json({ msg: "구독자 수 불러오기 실패" });
            }
            return res
                .status(200)
                .json({ success: true, subscriberNumber: subscriptionCases.length })
        })
})

// *** 나의 구독 상태 확인 라우터 ***
router.post("/mySubscriptionStatus", (req, res) => {
    Subscriber
        .find({
            'userTo': req.body.userTo,
            'userFrom': req.body.userFrom
        })
        .exec((err, subscriptionCases) => {
            if (err) {
                return res
                    .status(400)
                    .send(err)
                    .json({ msg: "구독 상태 확인 실패" });
            }
            let mySubscriptionStatus = false;
            if (subscriptionCases.length !== 0) {
                mySubscriptionStatus = true;
            }
            return res
                .status(200)
                .json({ success: true, mySubscriptionStatus })
        })
})

module.exports = router;