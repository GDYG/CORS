const express = require('express');
const app = express();
// const multer = require('multer');
const path = require('path')
const bodyParser = require('body-parser');
const fs = require('fs');

// const upload = multer({
    // dest: path.join(__dirname, './payUpLoad/')
// })

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: path.join(__dirname, './payUpLoad/')});

//使用body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//设置跨域
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin','http://localhost:3000'); //当允许携带cookies此处的白名单不能写’*’
    res.header('Access-Control-Allow-Headers','content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With'); //允许的请求头
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT'); //允许的请求方法
    res.header('Access-Control-Allow-Credentials',true);  //允许携带cookies
    next();
})

app.get('/axios', (req, res)=>{
    console.log(req)
    res.send({
        data: '请求成功'
    })
})

app.post('/load', multipartMiddleware, (req, res)=> {
    console.log(JSON.stringify(req.files.img) + '-----' + JSON.stringify(req.body))
    let prevName = Math.floor((Math.random() * 90 + 10)).toString() + req.files.img.originalFilename
    let prevPath = req.files.img.path
    let nextPath = path.join(__dirname, './payUpLoad/') + prevName
    console.log(nextPath)
    fs.rename(prevPath, nextPath, (err) =>{
        if(err) {
            fs.unlink(nextPath, (err) => {
                if(err) {
                    console.log(err)
                    return false
                }
                res.send({
                    status: 1,
                    msg: '上传图片失败'
                })
            })
        }else {
            res.send({
                status: 0,
                msg: '上传图片成功'
            })
        }
    })
})

app.listen(5000, (err)=>{
    if(err) {
        console.log(err);
    }else {
        console.log('服务器已启动!');
    }
})
