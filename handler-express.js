var fs = require('fs')
var template = require('art-template')
var formidable = require('formidable')
var path = require('path')
var queryString = require('querystring')
var myurl = require('url')

// var mymodule = require('./dataModule')
var mymodule = require('./module-express')

// 1.获取首页动态数据  req.url === '/' || req.url === '/index' mehtod === 'get'
exports.getIndexPage = (req, res) => {
    mymodule.getAllData((err, data) => {
        if (err) {
            res.end('err')
        } else {
            res.render(__dirname + "/views/index.html", data)
        }
    })
}
// 2.获取添加页面静态结构  req.url ==='/add'  method === 'get'
exports.getAddPage = (req, res) => {
    // render:它的作用就是能够实现模板引擎的渲染，并且将渲染结果自动返回
    // 渲染一般需要两个前提：一个是模板内容(路径),一个是数据
    // render(模板路径，数据)
    // 这个方法使用到了模板引擎，它需要再引入一个新的模板引擎模块，名字叫：express-art-template
    // 我们现在是使用了express-art-template.但是必须强调的是，这不是一个唯一的选择。只是你应该能够理解到，这个Render必须有模板引擎的参与
    // 所以它需要引入两个模板引擎模块：art-template  | express-art-template
    res.render(__dirname + "/views/add.html")
}
// 3.实现新增操作 req.url === '/add' method === 'post'
exports.doAdd = (req, res) => {
    mymodule.addhero(req.body, (err) => {
        if (err) {
            res.json({
                code: 100,
                msg: '添加失败'
            })
        } else {
            // json的作用就是将对象转换为json格式字符串并返回
            res.json({
                code: 200,
                msg: '添加成功'
            })
        }
    })
}
// 4.展示编辑动态页面 req.url === '/edit' method === 'get'
exports.getEditPage = (req, res) => {
    var url = req.url
    // 接收参数  /edit?id=2
    // parseQueryString <boolean> 如果为 true，则 query 属性总会通过 querystring 模块的 parse() 方法生成一个对象。
    var id = myurl.parse(url, true).query.id
    // 根据id号获取对应的数据对象
    mymodule.getHeroById(id, (err, data) => {
        if (err) {
            res.end('404')
        } else {
            var html = template(__dirname + "/views/edit.html", data)
            res.end(html)
        }
    })
}
// 5.实现编辑操作 req.url === '/edit?id=2' method ='post'
exports.doEdit = (req, res) => {
    mymodule.updateHero(req.body, (err) => {
        if (err) {
            var retValue = {
                code: 100,
                msg: '修改失败'
            }
            res.end(JSON.stringify(retValue))
        } else {
            var retValue = {
                code: 200,
                msg: '修改成功'
            }
            res.end(JSON.stringify(retValue))
        }
    })
}
// 6.实现删除操作：req.url === '/del?id=2' method === 'get'
exports.delHeroById = (req, res) => {
    console.log(myurl.parse(req.url, true).query)
    var id = myurl.parse(req.url, true).query.id
    mymodule.deleteHeroById(id, (err) => {
        if (err) {
            var retValue = {
                code: 100,
                msg: '删除失败'
            }
            res.end(JSON.stringify(retValue))
            // res.end()
        } else {
            var retValue = {
                code: 200,
                msg: '删除成功'
            }
            res.end(JSON.stringify(retValue))
            // res.end('<script>location.href="/"</script>')

            // 通过响应头来实现重定向
            // res.writeHead(301,{
            //     'Location':'/'
            // })
            // res.end()
            // res.redirect('/')
        }
    })
}
// 7.实现静态资源的加载 req.url === '/css/ | /images/'
exports.getStaticSource = (req, res) => {
    fs.readFile(__dirname + req.url, (err, data) => {
        if (err) {
            res.end('404')
        } else {
            res.end(data)
        }
    })
}
// 8.实现文件的上传操作 req.url === 'fileUpload' method === 'post'
exports.doFileUpload = (req, res) => {
    console.log(req.body)
    // 1.创建对象
    var form = new formidable.IncomingForm()
    // 2.设置编码：如果有普通键值对数据就最好设置
    form.encoding = 'utf-8'
    // 3.设置上传文件的存储目录
    form.uploadDir = __dirname + '/public/images'
    // 4.设置是否保留文件的扩展名
    form.keepExtensions = true
    // 5.上传文件会执行parse函数
    // req:因为req中请求报文，而传递的数据都存储在请求报文中
    // 上传完毕后触调用回调函数，这个里面有三个参数
    // err：上传如果失败的错误信息
    // fields：数据传递成功普通的键值对存储对象
    // files：文件上传成功，存储着文件信息
    form.parse(req, function (err, fields, files) {
        if (err) {
            var retValue = {
                code: 100,
                msg: '上传失败'
            }
            res.end(JSON.stringify(retValue))
        } else {
            // 'd:\\广州黑马前端与移动开发就业20期（20180521面授）\\node.js\\day3\\04-上课案例\\code2\\images\\upload_c14b3a6db12cac323bd7e749e70c1316.jpg'
            // basename:可以获取当前路径中的最后一个部分
            var filename = path.basename(files.img.path)
            var retValue = {
                code: 200,
                msg: '上传成功',
                myimg: filename
            }
            res.end(JSON.stringify(retValue))
        }
    });
}

// 9. 获取登陆静态页面
exports.getLoginPage = (req, res) => {
    res.render(__dirname + "/views/login.html")
}

// 10.实现登陆验证
exports.doLogin = (req, res) => {
    //获取输入数据
    var current = req.body
    //根据数据判断是否正确
    mymodule.validateLogin(current.username, (err, data) => {
        if (err) {
            res.json({
                code: 100,
                msg: '服务器异常'
            })
        } else {
            if (data) {
                if (data.password == current.userpwd) {
                    //将登录的状态保持到session中
                    req.session.isLogin = 'true'
                    req.session.current = req.body
                    res.writeHead(301, {
                        'Location': '/'
                    })
                    res.end()
                } else {
                    res.writeHead(301, {
                        'Location': '/'
                    })
                    res.end()
                }
            } else {
                res.writeHead(301, {
                    'Location': '/'
                })
                res.end()
            }
        }
    })
}