const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        default: "https://www.pngfind.com/pngs/m/679-6795996_emoji-png-transparent-emojipng-images-pluspng-cool-emoji.png",
    },
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    }
})

// 회원가입 라우터에서 save() 실행 전의 동작들
userSchema.pre('save', function (next) {
    // 위의 userSchema에서 client로부터 입력받은 사용자 정보 불러오기
    var user = this;

    // password가 입력/변경됐을 경우에만 hashing 실행 (회원가입, 비밀번호 수정)
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                console.log(`${user.name}의 비밀번호 hashing 시작`);
                if (err) return next(err);
                user.password = hash;
                console.log(`${user.name}의 비밀번호 hashing 완료`);
                next();
                console.log(`next() 실행`);
            })
        });
    }
    // password에 변동사항 없으므로 다음 미들웨어 호출
    else {
        next();
    };
})

userSchema.methods.comparePassword = function (plainPassword, callback) {
    console.log("콜백 comparePassword() 실행");
    // 입력받은 plainPasswor와 DB의 hashing된 비밀번호가 같은지 비교
    bcrypt.compare(plainPassword, this.password, function (err, isMatched) {
        console.log("isMatched", isMatched);
        if (err) return callback(err);
        callback(null, isMatched);
    })
}

userSchema.methods.generateToken = function (callback) {
    console.log("콜백 generateToken() 실행");
    var user = this;
    console.log("userId", user._id);
    const payload = {
        userId: user._id,
    };
    // jsonwebtoken을 이용해서 토큰 생성
    var token = jwt.sign(payload, 'secretToken');
    console.log("token", token);
    // 해당 유저의 토큰 저장 1
    user.token = token;
    // 해당 유저의 토큰 저장 2 (왜 한 번 더 저장?)
    user.save(function (err, user) {
        if (err) return callback(err);
        callback(null, user);
    });
}

userSchema.statics.findByToken = function (token, callback) {
    var user = this;
    console.log("토큰 디코드 실행");
    jwt.verify(token, 'secretToken', function (err, decoded) {
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return callback(error);
            callback(null, user);
        })
    });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };