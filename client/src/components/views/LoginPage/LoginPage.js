import React, { useState } from 'react'
import { actionCreators as userActions } from "../../../redux/modules/user";
import { useDispatch } from "react-redux";

import { Typography } from 'antd';
const { Title } = Typography;

function LoginPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = (event) => {
    setEmail(event.currentTarget.value);
  }

  const onChangePassword = (event) => {
    setPassword(event.currentTarget.value);
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();
    let loginRequestBody = {
      email,
      password,
    }
    // console.log("loginRequestBody", loginRequestBody);
    dispatch(userActions.loginMiddleware(loginRequestBody));
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title>로그인</Title>
      </div>
      <form
        onSubmit={onSubmitHandler}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label>이메일</label>
        <input type="email" value={email} onChange={onChangeEmail} />
        <label>비밀번호</label>
        <input type="password" value={password} onChange={onChangePassword} />
        <br />
        <button style={{ marginBottom: "5px" }} type="submit">로그인</button>
        <button onClick={() => {
          window.location.href = "/register";
        }}
        >
          회원가입
        </button>
      </form>
    </div>
  )
}

export default LoginPage