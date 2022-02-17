import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from "react-router-dom";
import { Row, Col, List, Avatar } from 'antd';

import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';


function VideoDetailPage() {
    const params = useParams();
    let videoId = params.videoId;

    const [videoDetail, setVideoDetail] = useState([])

    const videoDetailReqBody = {
        videoId,
    }

    useEffect(() => {
        axios.post('http://localhost:5000/api/video/getVideoDetail', videoDetailReqBody)
            .then((response) => {
                if (response.data.success) {
                    console.log("상세페이지 로딩 성공", response.data);
                    setVideoDetail(response.data.videoDetail);
                }
                else {
                    alert("상세페이지 로딩 실패");
                }
            })
    }, []);

    // videoDetail의 가장 마지막 레벨의 데이터가 불러와지기 전에 렌더링이 된 경우
    if (videoDetail.writer) {
        return (
            <Row gutter={16, 16}>
                <Col lg={18} xs={24}>
                    <div style={{ width: "100%", padding: "3rem, 4rem" }}>
                        <video
                            style={{ width: '100%' }}
                            src={`http://localhost:5000/${videoDetail.filePath}`}
                            controls />
                        <List.Item
                            actions={[<Subscribe userTo={videoDetail.writer._id} />]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={'https://www.pngfind.com/pngs/m/679-6795996_emoji-png-transparent-emojipng-images-pluspng-cool-emoji.png'} />}
                                title={videoDetail.writer.name}
                                description={videoDetail.description}
                            />
                        </List.Item>
                        {/* Comments */}
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    }
    else {
        return (
            <div>
                LOADING...
            </div>)
    }

}

export default VideoDetailPage