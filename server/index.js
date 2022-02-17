const express = require('express');
const app = express();
const port = 5000;
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const path = require('path');

const { User } = require('./models/User');

const corsOption = {
    origin: "http://localhost:3000",
    credentials: true,
};

app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/users', require('./routes/users'));
app.use('/api/video', require('./routes/video'));

let uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

const mongoose = require('mongoose');
mongoose
    .connect(config.mongoURI)
    .then(() => {
        console.log("MongoDB 연결");
    })
    .catch((err) => {
        console.log(err);
    })


app.get("/", (req, res) => {
    res.send("보일러 플레이트 튜토리얼");
});


app.listen(port, () => {
    console.log(`서버 실행 @ 포트 ${port}번`);
});