import React, { useEffect, useState } from 'react';
import axios from 'axios';


function SideVideo() {

    const [sideVideos, setSideVideos] = useState([]);

    useEffect(() => {
        // 비디오 목록 조회
        axios.get('http://localhost:5000/api/video/getVideos')
            .then((response) => {
                if (response.data.success) {
                    console.log("사이드 비디오 목록 조회", response.data);
                    setSideVideos(response.data.videos);
                }
                else {
                    alert("비디오 목록 조회 실패");
                }
            })
    }, [])


    const renderSideVideos = sideVideos.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return (
            <div
                key={video._id}
                style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem' }}
            >
                <div
                    style={{ width: "40%", marginRight: "1rem" }}
                >
                    <a
                        href
                        style={{
                            color: 'gray'
                        }}
                    >
                        <img
                            style={{ width: "100%", height: "100%" }}
                            src={`http://localhost:5000/${video.thumbnail}`}
                            alt="thumbnail"
                        />
                    </a>
                </div>
                <div style={{ width: "50%" }}>
                    <a >
                        <span style={{ fontSize: '1rem', color: 'black' }}>{video.title}</span><br />
                        <span>{video.writer?.name}</span><br />
                        <span>{video.views} views</span><br />
                        <span>{minutes} : {seconds}</span><br />
                    </a>
                </div>
            </div>)
    })

    return (
        <React.Fragment>
            <div
                style={{ marginTop: '3rem' }}
            />
            {renderSideVideos}

        </React.Fragment>



    )
}

export default SideVideo