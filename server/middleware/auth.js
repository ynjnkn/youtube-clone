const { User } = require('../models/User');

// auth 미들웨어 구현 순서:
// 1. 쿠키에 저장된 token을 서버에서 가져와서 decode
// 2. decode된 user id로 유저DB에 저장된 유저를 찾은 후, 쿠키의 토큰과 유저DB의 토큰이 동일한지 확인
let auth = (req, res, next) => {
    console.log("auth() 실행");
    console.log("req", req.cookies.user);
    let token = req.cookies.user;
    console.log("오쓰 토큰", token);
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true });
        req.token = token;
        req.user = user;
        next();
    })
};


module.exports = { auth };