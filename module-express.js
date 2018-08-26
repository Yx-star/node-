// 这个模块专门用来处理数据
// 数据操作一共有四种：增加，删除，修改，查询
var mysql = require('mysql')

// 所谓操作数据库在我们的业务中就是对表进行CUID

// 创建连接
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'localhost'
})

// 1. 获取所有数据
exports.getAllData = (callback) => {
    // .创建查询语句
    var sql = 'select id,name,gender,img from heros where isDelete = 0'
    // 执行查询命令
    // query: 可以在进行查询操作的时候，将表中查询的数据转换为实体类数组，数组中的每一个值都是一个对象
    connection.query(sql, (err, result) => {
        if (err) {
            callback(err)
        } else {
            callback(null, { heros: result })
        }
    })
}

// 添加用户
exports.addhero = (newobj, callback) => {
    var sql = `insert into heros values(null,'${newobj.name}','${newobj.gender}','${newobj.img}',default)`
    connection.query(sql, (err, result) => {
        if (err) {
            callback(err)
        } else {
            callback(null, result)
        }
    })
}

// 根据id获取对应的数据对象
exports.getHeroById = (id, callback) => {
    var sql = 'select * from heros where id = ? and isDelete = 0'
    connection.query(sql, [id], (err, result) => {
        if (err) {
            callback(err)
        } else {
            // 这里获取的是数组但是调用者需要的是对象，同时我们发现这个sql语句如果执行成功，只可能会有一条记录
            callback(null, result[0])
        }
    })
}

// 根据id号编辑用户数据
exports.updateHero = (upObj, callback) => {
    var sql = `update heros set ? where id = ?`
    connection.query(sql, [upObj, upObj.id], (err, result) => {
        if (err) {
            callback(err)
        } else {
            // 这里获取的是数组但是调用者需要的是对象，同时我们发现这个sql语句如果执行成功，只可能会有一条记录
            callback(null)
        }
    })
}

// 根据id删除数据
// 删除一般是软删除：只是设置一个删除的标记，并不会真正的将数据删除
exports.deleteHeroById = (id, callback) => {
    // var sql = `delete from heros where id = ?`
    var sql = `update heros set isDelete = 1 where id = ?`
    connection.query(sql, [id], (err, result) => {
        if (err) {
            callback(err)
        } else {
            // 这里获取的是数组但是调用者需要的是对象，同时我们发现这个sql语句如果执行成功，只可能会有一条记录
            callback(null)
        }
    })
}

//实现登录验证
exports.validateLogin = (nickname,callback)=>{
    var sql = 'select * from login where nickname = ?'
    connection.query(sql,[nickname],(err,result)=>{
        if(err){
            callback(errs)
        }else{
            callback(null,result[0])
        }
    })
}
