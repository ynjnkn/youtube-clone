import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from "axios";

function Subscribe(props) {
    const userId = useSelector(state => state.user.user?.userId);
    const [subscribeNumber, setSubscribeNumber] = useState(0);
    const [mySubscriptionStatus, setMySubscriptionStatus] = useState(false);

    useEffect(() => {
        const subScriberNumberReqBody = {
            userTo: props.userTo,
        };

        // 현재 상세페이지의 구독자 수 가져오기
        axios.post("http://localhost:5000/api/subscribe/subscriberNumber", subScriberNumberReqBody)
            .then((response) => {
                if (response.data.success) {
                    console.log("구독자 수 불러오기 성공", response.data);
                    setSubscribeNumber(response.data.subscriberNumber);
                }
                else {
                    alert("구독자 수를 불러오기 실패");
                }
            })

        const mySubscriptionStatusReqBody = {
            userTo: props.userTo,
            userFrom: userId,
        };

        axios.post("http://localhost:5000/api/subscribe/mySubscriptionStatus", mySubscriptionStatusReqBody)
            .then((response) => {
                if (response.data.success) {
                    console.log("구독 상태 확인 성공", response.data);
                    setMySubscriptionStatus(response.data.mySubscriptionStatus);
                }
                else {
                    alert("구독 상태 확인 실패");
                }
            })
    }, [])

    return (
        <div>
            <button
                style={{
                    backgroundColor: `${mySubscriptionStatus ? '#AAAAAA' : '#CC0000'}`,
                    border: "None",
                    borderRadius: "4px",
                    color: "white",
                    padding: "10px 16px",
                    fontWeight: "500",
                    fontSize: "1rem",
                    textTransform: "uppercase",
                }}
                onClick
            >
                {mySubscriptionStatus ? "구독 중" : "구독"}
            </button>
        </div>
    )
}

export default Subscribe