const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const multer = require("multer");
// const { auth } = require("../middleware/auth");
// const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfprobePath(ffprobePath);

// *** STORAGE MULTER CONFIG ***
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
})
var upload = multer({ storage: storage }).single("file")


// *** 드롭존에 추가된 비디오 파일 저장 라우터 ***
router.post('/uploadfiles', (req, res) => {

    // 클라이언트로 넘겨받은 비디오를 서버에 저장 (feat. multer)
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({
            success: true,
            url: res.req.file.path,
            fileName: res.req.file.filename,
        })
    })
})


// *** 비디오 썸네일 생성 라우터 ***  
router.post('/thumbnail', (req, res) => {
    let filePath = "";
    let fileDuration = "";

    // 비디오 재생 시간 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir("metadata", metadata);
        console.log("metadata.format.duration", metadata.format.duration);

        fileDuration = metadata.format.duration;
    })

    // 비디오 썸네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function (fileNames) {
            console.log('Will generate ' + fileNames.join(', '))
            console.log(fileNames)

            thumbnailFilePath = "uploads/thumbnails/" + fileNames[0];
        })
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ success: true, thumbnailFilePath: thumbnailFilePath, fileDuration: fileDuration })
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x240',
            // %b input basename ( filename w/o extension )
            filename: 'thumbnail-%b.png'
        });

})


// *** 비디오 업로드 라우터 ***
router.post('/uploadVideo', (req, res) => {
    // 넘겨받은 비디오 정보를 DB에 저장
    const video = new Video(req.body)
    video.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            success: true
        });
    });
});


// *** 랜딩 페이지 조회 라우터 ***
router.get('/getVideos', (req, res) => {
    // 비디오 목록을 DB에서 가져와서 클라이언트에게 보내기
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if (err) {
                return res
                    .statusMessage(400)
                    .json({ msg: "DB에서 비디오 목록 조회 실패" });
            }
            return res
                .status(200)
                .json({
                    success: true,
                    videos
                })
        })
})


// *** 상세 페이지 조회 라우터 ***
router.post('/getVideoDetail', (req, res) => {
    Video.findOne({ "_id": req.body.videoId })
        .populate("writer")
        .exec((err, videoDetail) => {
            if (err) {
                return res
                    .statusMessage(400)
                    .json({ msg: `DB에서 상세 페이지 정보 조회 실패 (ID: ${req.body.videoId})` });
            }
            return res
                .status(200)
                .json({
                    success: true,
                    videoDetail
                })
        })
})


module.exports = router;