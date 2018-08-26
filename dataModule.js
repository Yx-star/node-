// 这个模块专门用来处理数据
// 数据操作一共有四种：增加，删除，修改，查询

var fs = require('fs')

// 1. 获取所有数据
exports.getAllData = (callback) => {
    // 1.读取指定的数据文件
    fs.readFile(__dirname + "/data/data.json", (err, data) => {
        if (err) {
            // 如果有错误，就将错误通过回调的方式返回--处理
            callback(err)
        } else {
            // 让用户直接使用到它想用的数据类型
            callback(null, JSON.parse(data.toString()))
        }
    })
    // 2.将获取的内容转换为用户需要的类型
}

// 添加用户
// { name: 'asdasd',
//   gender: '女',
//   img: 'upload_2bfb2991c51bbe5df15ca00d23dce7fc.jpg' }
// json文件处理：读取>转换>操作>转换>存储
// 读取和写入json文件都只能是字符串，但是操作的时候我们需要对象
exports.addhero = (newobj, callback) => {
    // 0.读取文件
    fs.readFile(__dirname + "/data/data.json", (err, data) => {
        if (err) {
            callback(err)
        } else {
            // 1.读取json文件转换为对象或数组
            var dataObj = JSON.parse(data.toString())
            // 2.获取最后一个元素的id号 + 1
            if(dataObj.heros.length == 0){
                newobj.id = 1
            }else{
                newobj.id = dataObj.heros[dataObj.heros.length - 1].id + 1
            }
            // 3.将新数据添加到数组中
            dataObj.heros.push(newobj)
            // 4.再将添加了新数据的数组重新写入到文件
            fs.writeFile(__dirname + "/data/data.json", JSON.stringify(dataObj, null, ' '), (err) => {
                if (err) {
                    callback(err)
                } else {
                    callback(null)
                }
            })
        }
    })
}

// 根据id获取对应的数据对象
exports.getHeroById = (id, callback) => {
    // 调用之前封装的方法获取所有数据
    this.getAllData((err, data) => {
        if (err) {
            callback(err)
        } else {
            // 说明我们已经成功的获取数据，并且数据的格式是一个对象
            data.heros.forEach((value, index) => {
                // 在进行id比较的时候不能添加类型的判断
                if (value.id == id) {
                    callback(null, value)
                }
            })
        }
    })
}

// 根据id号编辑用户数据
exports.updateHero = (upObj, callback) => {
    this.getAllData((err, data) => {
        if (err) {
            callback(err)
        } else {
            // 在使用forEach的时候，value值只是原始值的副本。所以对副本进行修改，原始值不变
            data.heros.forEach((value, index) => {
                // 如果条件成立，这就是我需要修改的对象
                if (value.id == upObj.id) {
                    // value = upObj
                    value.name = upObj.name
                    value.gender = upObj.gender
                    value.img = upObj.img
                    // 将数据重新写入到文件
                    fs.writeFile(__dirname + "/data/data.json", JSON.stringify(data), (err) => {
                        if (err) {
                            callback(err)
                        } else {
                            callback(null)
                        }
                    })
                }
            })
        }
    })
}

// 根据id删除数据
exports.deleteHeroById =(id,callback) => {
    this.getAllData((err,data) => {
        if(err){
            callback(err)
        }else{
           for(var i=0;i<data.heros.length;i++){
                if(data.heros[i].id == id){
                    data.heros.splice(i,1)
                    break
                }
           }
            //  将数据重新写入到文件
            fs.writeFile(__dirname+"/data/data.json",JSON.stringify(data,null," "),(err) => {
                if(err){
                    callback(err)
                }else{
                    callback(null)
                }
            })
        }
    })
}