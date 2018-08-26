var express = require('express')
var fs = require('fs')

var router = require('./router-express')
// 创建服务器
var app = express()

// 托管静态资源文件
app.use(express.static('public'))
// app.use('/images', express.static('images'));
// app.use('/css', express.static('css'));

// 添加端口的监听
app.listen(3000, () => {
    console.log('http://127.0.0.1:3000')
})

app.get('/', (req, res) => {
    fs.readFile(__dirname + "/views/test.html", (err, data) => {
        if (err) {
            res.end('err')
        } else {
            res.end(data)
        }
    })
})