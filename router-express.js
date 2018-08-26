var express = require('express')
var handler = require('./handler-express')
// 创建路由模块对象
var router = express.Router()

router.get('/',handler.getIndexPage)
      .get('/add',handler.getAddPage)
      .post('/add',handler.doAdd)
      .get('/edit',handler.getEditPage)
      .post('/edit',handler.doEdit)
      .get('/del',handler.delHeroById)
      .post('/fileUpload',handler.doFileUpload)
      .get('/login',handler.getLoginPage)
      .post('/login',handler.doLogin)

// 暴露成员
module.exports = router