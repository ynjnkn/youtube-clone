const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

// auth 라우터의 기능
// 1. 페이지 이동 때마다 로그인 여부, 관리자 유저 여부 체크
// 2. 특정 기능들에 대한 권한이 있는지 여부 체크 (글 생성, 글 삭제 ...)

// auth 라우터
router.get('/auth', auth, (req, res) => {
    // auth 미들웨어에서 auth 검증 완료된 상태
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

// 회원가입 라우터
router.post('/register', (req, res) => {
    console.log(`${req.body.name} 회원가입 시작`);
    const user = new User(req.body);
    user.save((err, doc) => {
        console.log("save() 실행");
        if (err) {
            return res.json({ success: false, err });
        }
        console.log(`*** ${req.body.name} 회원가입 완료 ***`);
        return res
            .status(200)
            .json({
                success: true
            });
    })
});

// 로그인 라우터
router.post('/login', (req, res) => {
    // DB에서 요청한 이메일 찾기
    User.findOne({ email: req.body.email }, (err, user) => {
        console.log(`${req.body.email}에 대한 findOne() 실행`);
        if (!user) {
            console.log(`${req.body.email}에 해당하는 유저 없음`);
            return res.json({
                loginSucess: false,
                message: "입력된 이메일에 해당하는 유저가 없습니다."
            })
        }
        console.log(`${req.body.email}에 해당하는 유저 있음`);
        // 요청한 이메일이 DB에 있다면? 비밀번호가 같은지 확인
        user.comparePassword(req.body.password, (err, isMatched) => {
            console.log("콜백 comparePassword() 실행 완료");
            if (!isMatched) {
                console.log("비밀번호 일치하지 않음");
                return res.json({ loginSuccess: false, message: "잘못된 비밀번호 입니다." });
            };
            // 비밀번호가 같다면 토큰 생성
            console.log("비밀번호 일치함. 토큰 생성 시작");
            user.generateToken((err, user) => {
                console.log("콜백 generateToken() 실행 완료");
                if (err) {
                    console.log("토큰 생성 실패");
                    return res.status(400).send(err);
                };
                // 클라이언트에게 토큰 전달
                console.log("클라이언트에게 토큰 전달");
                res
                    .status(200)
                    .json({ loginSuccess: true, token: user.token });
            });
        });
    });
});


// 로그아웃 라우터
router.get('/logout', auth, (req, res) => {
    console.log("로그아웃 실행");
    User.findOneAndUpdate(
        { _id: req.user._id },
        { token: "" },
        (err, doc) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            });
        });
});

module.exports = router;