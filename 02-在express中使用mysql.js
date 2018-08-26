// 1.引入
var mysql = require('mysql')
// 2.创建数据库连接:这里定义一个变量接收是因为后期的sql执行方法中需要使用到这个连接对象
var connection = mysql.createConnection({
    // 主机名
    host:'localhost',
    // 用户名
    user:'root',
    // 密码
    password:'root',
    // 你想操作的数据库名称
    database:'ershiqi'
})
// 3.打开连接：连接也可以不打开，后期的操作会默认打开最近创建的连接对象

// 4.创建查询命令
// 4.1 执行一个新增语句
// var sql = "insert into heros values(null,'班长','女','4.jpg')"
// var sql = "select id,name,gender,img from heros"
// 接收到一个对象
var obj = {
    id:5,
    name:'赵四123',
    gender:'男',
    img:'3.jpg'
}
// var sql = "insert into heros values(null,'"+obj.name+"','女','4.jpg')"
// 使用反引号：可以创建多行文本   可以解析变量  可以解析转义字符
// var sql = `insert into heros values(null,'${obj.name}','${obj.gender}','${obj.img}')`
// var sql = `update heros set name='${obj.name}',gender='${obj.gender}',img='${obj.img}' where id='${obj.id}'`

// ?称为占位符，系统会自动的生成赋值语句
var sql = `update heros set ? where id=?`


// 5.执行Sql命令
// 结果一般有两种：
// 1.如果是对于增加删除和修改：返回一个对象，里面包含着受影响的行数 effectedRows
// 2.如果是查询，就返回结果集，它是一个数组
// connection.query(sql语句,(错误信息对象，执行的结果，查询返回的字段信息) => {

// })
connection.query(sql,[obj,obj.id],(err,result,fields) => {
    if(err){
        console.log(err)
    }else{
        console.log(result)
        console.log(fields)
    }
})

// connection.query(sql,(err,result,fields) => {
//     if(err){
//         console.log(err)
//     }else{
//         console.log(result)
//         console.log(fields)
//     }
// })
