import React, { useState } from 'react'
import { actionCreators as userActions } from "../../../redux/modules/user";
import { useDispatch } from "react-redux";
import axios from 'axios';

function RegisterPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const onChangeEmail = (event) => {
    setEmail(event.currentTarget.value);
  }

  const onChangeNickname = (event) => {
    setNickname(event.currentTarget.value);
  }

  const onChangePassword = (event) => {
    setPassword(event.currentTarget.value);
  }

  const onChangePasswordCheck = (event) => {
    setPasswordCheck(event.currentTarget.value);
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (password !== passwordCheck) {
      return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
    };

    let registerRequestBody = {
      email,
      name: nickname,
      password,
    }

    axios.post('http://localhost:5000/api/users/register', registerRequestBody)
      .then((response) => {
        window.location.href = "/login"
      })
      .catch((error) => {
        alert(error.response);
      })

  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        onSubmit={onSubmitHandler}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label>이메일</label>
        <input type="email" value={email} onChange={onChangeEmail} />

        <label>닉네임</label>
        <input type="text" value={nickname} onChange={onChangeNickname} />

        <label>비밀번호</label>
        <input type="password" value={password} onChange={onChangePassword} />

        <label>비밀번호 확인</label>
        <input type="password" value={passwordCheck} onChange={onChangePasswordCheck} />
        <br />
        <button type="submit">회원가입</button>
      </form>
    </div>
  )
}

export default RegisterPage