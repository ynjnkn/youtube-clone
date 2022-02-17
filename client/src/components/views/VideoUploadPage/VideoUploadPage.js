import React, { useState } from 'react'
import { Typography, Button, Form, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Dropzone from 'react-dropzone';
import axios from "axios";
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Title } = Typography;

const privacyOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" },
];

const categoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
];

function VideoUploadPage() {
    const userId = useSelector((state) => state.user.user?.userId);
    console.log("로그인된 userId", userId);

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [privacy, setPrivacy] = useState(0);
    const [category, setCategory] = useState(0); // 초기값 "Film & Animation" 일지도 ...
    const [filePath, setFilePath] = useState("");
    const [duration, setDuration] = useState("");
    const [thumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (e) => {
        setTitle(e.currentTarget.value);
    };

    const onDescChange = (e) => {
        setDesc(e.currentTarget.value);
    };

    const onPrivacyChange = (e) => {
        setPrivacy(e.currentTarget.value);
    };

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value);
    };

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0]);
        axios.post('http://localhost:5000/api/video/uploadfiles', formData, config)
            .then((response) => {
                if (response.data.success) {
                    console.log("비디오 업로드 성공", response.data);
                    setFilePath(response.data.url);

                    let thumbnailReqBody = {
                        url: response.data.url,
                        fileName: response.data.fileName,
                    }

                    axios.post('http://localhost:5000/api/video/thumbnail', thumbnailReqBody)
                        .then(response => {
                            if (response.data.success) {
                                console.log("썸네일 생성 성공", response.data);
                                setDuration(response.data.fileDuration);
                                setThumbnailPath(response.data.thumbnailFilePath);
                            }
                            else {
                                alert("썸네일 생성에 실패 했습니다.");
                            }
                        })
                }
                else {
                    alert('비디오 업로드를 실패했습니다.');
                };
            })
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!userId) {
            alert("로그인이 필요한 기능입니다.");
            window.location.href = "/login";
        }

        const videoUploadReqBody = {
            writer: userId,
            title: title,
            description: desc,
            privacy: privacy,
            filePath: filePath,
            category: category,
            duration: duration,
            thumbnail: thumbnailPath,
        }

        console.log("videoUploadReqBody", videoUploadReqBody);

        axios.post('http://localhost:5000/api/video/uploadVideo', videoUploadReqBody)
            .then((response) => {
                if (response.data.success) {
                    console.log("비디오 업로드 성공", response.data);
                    message.success("성공적으로 비디오를 업로드했습니다.");
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 500);
                }
                else {
                    alert("비디오 업로드에 실패했습니다.");
                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title>비디오 업로드</Title>
            </div>
            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={800000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <PlusOutlined type="plus" style={{ fontSize: '3rem' }} />
                            </div>
                        )}
                    </Dropzone>
                    {/* Thumbnail */}
                    {thumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${thumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                </div>
                <br /><br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={title}
                />
                <br /><br />
                <label>Description</label>
                <TextArea
                    onChange={onDescChange}
                    value={desc}
                />
                <br /><br />
                <select onChange={onPrivacyChange}>
                    {privacyOptions.map((item, index) => (
                        <option key={index} value={item.value} >{item.label}</option>
                    ))}
                </select>
                <br /><br />
                <select onChange={onCategoryChange}>
                    {categoryOptions.map((item, index) => (
                        <option key={index} value={item.value} >{item.label}</option>
                    ))}
                </select>
                <br /><br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    업로드
                </Button>
            </Form>

        </div>
    )
}

export default VideoUploadPage