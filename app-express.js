// 使用express来实现创建服务器和响应用户请求
var express = require('express')
var session = require('express-session')
// 创建服务器
var app = express()
// 添加端口的监听
app.listen(3000,() =>{
    console.log('http://127.0.0.1:3000')
})

var router = require('./router-express')

app.use(session({
    secret:'加密字符串',// 对session id 相关的cookie 进行签名 -- 加盐
    resave:false,//不管session数据是否发生改变，都会自动保存
    saveUninitialized:false,// 是否保存未初始化的会话
}));
//没有挂载路径的中间件，应用的每个请求都会执行中间件
app.use(function (req,res,next) {
    console.log(req.session.isLogin)
    if(req.session.isLogin ==='true' || req.url ==='/login'){
        next()
    }else{
        res.writeHead(301,{
            'Location':'/login'
        })
        res.end()
    }
})
// 引入body-parse：它的作用是通过以中间件的方式设置参数的解析和传递方式
var bodyParser = require('body-parser')
// 进行参数传递时的配置
var bodyurl = bodyParser.urlencoded({ extended: false })
app.use(bodyurl)
app.use(bodyParser.json())

// 下面这个中间件就是用来告诉当前应用要使用express-art-template来进行模板的渲染
// art:是指能够用于解析的文件的扩展名，我们可以修改其为html
app.engine('html', require('express-art-template'));
// 下面这个配置是指定在什么环境下使用这个渲染方式
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});

// 静态资源的托管
app.use(express.static('public'));


// 这句代码一定要放在最后
// 让当前应用使用我们制定的路由规则
// 挂载--use
// 注入路由
app.use(router)


