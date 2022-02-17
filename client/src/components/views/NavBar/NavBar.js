import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators as userActions } from '../../../redux/modules/user';
import { deleteCookie } from "../../../utils/cookie";


import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';


function NavBar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const logOut = () => {
    deleteCookie("user");
    dispatch(userActions.logOut());
  };

  useEffect(() => {
    console.log("user 상태 변경", user);
  }, []);

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand href="/">Navbar</Navbar.Brand>
        <Nav
          className="justify-content-end flex-grow-1"
        >
          <div
            style={{
              cursor: "pointer",
              paddingRight: "20px",
            }}
            onClick={() => {
              window.location.href = "/video/upload";
            }}
          >
            업로드
          </div>
          {
            !user ?
              <div
                style={{
                  cursor: "pointer"
                }}
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                로그인
              </div>
              :
              <div
                style={{
                  cursor: "pointer"
                }}
                onClick={logOut}
              >
                로그아웃
              </div>
          }
        </Nav>
      </Container>
    </Navbar>
  )
}

export default NavBar