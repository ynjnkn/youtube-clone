import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setCookie, getCookie, deleteCookie } from "../../../utils/cookie";
import { actionCreators as userActions } from "../../../redux/modules/user";
import moment from 'moment';

import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Title } = Typography;


function LandingPage() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user?.userId);

  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    // 비디오 목록 조회 @ 메인페이지
    axios.get('http://localhost:5000/api/video/getVideos')
      .then((response) => {
        if (response.data.success) {
          console.log("비디오 목록 조회 @ 메인페이지", response.data);
          setVideoList(response.data.videos);
        }
        else {
          alert("비디오 목록 조회 실패");
        }
      })
  }, [])

  const renderCards = videoList.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col
        key={video._id}
        lg={6} md={8} xs={24}>
        <div style={{ position: 'relative' }}>
          <a href={`/video/${video._id}`} >
            <img style={{ width: '100%' }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
            <div className="duration"
              style={{
                bottom: 0, right: 0, position: 'absolute', margin: '4px',
                color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8,
                padding: '2px 4px', borderRadius: '2px', letterSpacing: '0.5px', fontSize: '12px',
                fontWeight: '500', lineHeight: '12px'
              }}>
              <span>{minutes} : {seconds}</span>
            </div>
          </a>
        </div><br />
        <Card.Meta
          avatar={
            <Avatar src={video.writer.image} />
          }
          title={video.title}
        />
        <span>{video.writer.name} </span><br />
        <span style={{ marginLeft: '3rem' }}>
          {video.views} views -
        </span>
        <span> {moment(video.createdAt).format("MMM Do YY")} </span>
      </Col>)
  })

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Title level={2} > Recommended </Title>
      <hr />

      <Row gutter={16}>
        {renderCards}
      </Row>
    </div>
  )
}

export default LandingPage