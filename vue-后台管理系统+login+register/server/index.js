const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
app.use(bodyParser.json())

const cors = require('cors');
app.use(cors())

const mysql = require('mysql');
var db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'kw31'
});

// 引入bcryptjs加密模块，用于注册密码时加密
var bcrypt = require('bcryptjs');

// token
const mySecret = "Life is short, you need front-end";
const jwt = require('jsonwebtoken');

let responseData = {
    code: 0,
    message: ""
};

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/home', (req, res) => {
    let mytoken = req.headers['authorization'];
    if (mytoken) {
        try {
            let result = jwt.verify(mytoken, mySecret);
            console.log(result);
            //{ user_id: 2, user_name: 'huhu', iat: 1602763041, exp: 1602849441 }
            let { exp = 0 } = result, current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                console.log('没过期');
                res.json(result)
            } else {
                console.log('过期了');
                res.json({ code: '999', msg: 'token过期了，请登录' })
            }
        } catch (error) {
            console.log(error);
            res.json({ code: '999', msg: '权限验证失败,你无权访问用户列表' })
        }
    } else {
        res.json({ code: '999', msg: 'token为空，请登录！' })
    }
})

// 获取链接列表接口
app.get('/get-article', (req, res) => {
    db.query('SELECT * FROM article_table' , (err,results) => {
        if (err) throw err;
        console.log(results);
        res.json(results)
    })
})

// 创建链接的接口
app.post('/create-link', (req, res) => {
    let {title, content} = req.body;
    db.query('INSERT INTO  article_table(title,content) VALUES(?,?)' , [title,content], (err,results) => {
        if (err) throw err;
        console.log(results);
        res.json({code:0,msg:'金主爸爸创建成功！'})
    })
})

// 删除链接的接口
app.post('/delete-link', (req, res) => {
    let {id} = req.body;
    db.query('DELETE FROM article_table WHERE id = ?' , [id], (err,results) => {
        if (err) throw err;
        console.log(results);
        res.json({code:0,msg:'金主爸爸删除成功！'})
    })
})


// 获取指定id路径接口
app.get('/get-link-show', (req, res) => {
    let {id} = req.query;
    console.log(id);
    db.query('SELECT * FROM article_table WHERE id = ?' , [id], (err,results) => {
        if (err) throw err;
        res.json(results)
    })
})


// 编辑链接的接口
app.post('/edit-link', (req, res) => {
    let {id,title,content} = req.body;
    db.query('UPDATE article_table SET title = ?, content = ? WHERE id = ?' , [title,content,id], (err,results) => {
        if (err) throw err;
        res.json({code:0,msg:'金主爸爸保存成功！'})
    })
})



// 获取接口
app.get('/getnews', (req, res) => {

    console.log(req.query); // { curr: '1', limit: '10' }

    let page = Number(req.query.curr) - 1   // 第几页
    let count = Number(req.query.limit)     // 每页多少条

    db.query(`SELECT * FROM article_table`, (err, result) => {
        if (err) throw err;
        let total = result.length;
        db.query(`SELECT * FROM article_table limit ${page * count},${count}`, (err, result) => {
            if (err) throw err;
            let responseData = {
                code: 0,
                count: total,
                listData: result
            }
            res.send(responseData)
        });
    });

})



// 注册接口
app.post('/register', function (req, res) {
    // console.log(req.body); // 打印注册的数据
    if (req.body.regUsername.trim() == '') {
        responseData.code = 1;
        responseData.message = "用户名不能为空";
        res.json(responseData);
        return;
    }
    if (req.body.regPassword.trim() == '') {
        responseData.code = 2;
        responseData.message = "密码不能为空";
        res.json(responseData);
        return;
    }
    if (req.body.regPassword.trim() !== req.body.checkPassword.trim()) {
        responseData.code = 3;
        responseData.message = "两次密码不一致";
        res.json(responseData);
        return;
    }
    // 查询数据
    db.query(`SELECT username FROM user_table WHERE username='${req.body.regUsername}'`, function (error, results) {
        if (error) throw error;
        console.log(results);
        if (results.length != 0) {
            responseData.code = 4;
            responseData.message = "用户名已经存在";
            res.json(responseData);
            return;
        } else {
            // 使用bcrypt模块将密码加密，自动生成盐和哈希。使用的是同步方法，官网还有异步方法
            var hash = bcrypt.hashSync(req.body.regPassword, 8)
            //将哈希存储在数据库密码字段中。
            db.query(`INSERT INTO user_table(username,password) VALUES('${req.body.regUsername}', '${hash}')`, (error, result) => {
                if (error) throw error;
                // console.log(result); // 打印数据库插入数据的结果
                responseData.code = 0; // 这个0一定要写，否则会继承上一次注册不成功的code值
                responseData.message = "注册成功";
                res.json(responseData);
            })
        }
    });
})




// 登录
app.post('/login', function (req, res) {
    // console.log(req.body); // 打印登录数据
    let { logUsername, logPassword } = req.body;

    // 这里只是简单验证一下用户名和密码是否非空，建议做下更复杂的验证如长度，非数字等
    if (logUsername.trim() == "" || logPassword.trim() == "") {
        responseData.code = 1;
        responseData.message = "用户名和密码不能为空";
        res.json(responseData);
        return;
    }

    // 根据登录名从数据库中查询数据
    db.query(`SELECT id,username,password FROM user_table WHERE username="${logUsername}"`, function (error, results) {
        if (error) throw error;
        // console.log(results); // 打印数据库查询的结果，是一个数组
        if (results.length == 0) {
            responseData.code = 2;
            responseData.message = "用户名不存在";
            res.json(responseData);
        } else {
            // 比较登录密码和数据库中的哈希密码。使用的是bcrypt模块的compareSync同步方法，官网还有异步方法
            let checkpass = bcrypt.compareSync(logPassword, results[0].password);
            if (checkpass) {
                responseData.code = 0;
                responseData.message = "登录成功";
                // 根据前端登录的用户名或id生成一个token
                let token = jwt.sign({ user_id: results[0].id, user_name: results[0].username }, mySecret, { expiresIn: '24h' })
                responseData.token = token;
                res.json(responseData);

            } else {
                responseData.code = 3;
                responseData.message = "密码错误";
                res.json(responseData);
            }

        }
    });
})



app.listen(port, () => console.log(`服务器开始工作啦`))