var con = require('./connection');
var express = require('express');
var bodyParser = require('body-parser');
const multer = require('multer')
const path = require('path')


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


// 設定 url 輸入 localhost:7000 時跑出 HomePage
app.get('/', function (req, res) {
    // __dirname: C:\Users\User\Desktop\FinalWebsite
    var sql = 'select * from product';
    con.query(sql, function (error, result) {
        if (error) console.log(error);
        res.render(__dirname + '/HomePage', { products: result });
        // console.log(result);
    });
});

var check;

app.get('/LoginPage', function (req, res) {
    res.render(__dirname + '/LoginPage', { status: check });
    check = undefined;
    // console.log(check);
});

// LoginPage 頁面中 form 表單按下提交按鈕時觸發 (post 表單資料出去)
app.post('/LoginPage', function (req, res) {
    var acc = req.body.account;

    var sql = "select * from member where account=?";
    con.query(sql, [acc], function (error, result) {
        if (error) console.log(error);
        check = result.length;
        console.log(check);
        if (check > 0)
            res.redirect('/AdminPage');
        else {
            res.redirect('/LoginPage');
            check = 0;
        }
    })
});


var regisCheck;

app.get('/RegisterPage', function (req, res) {
    console.log(regisCheck);
    res.render(__dirname + '/RegisterPage', { regis: regisCheck });
    regisCheck = 0;
});

app.post('/RegisterPage', function (req, res) {

    var name = req.body.name;
    var acc = req.body.account;
    var pwd = req.body.password;

    var sql = "select * from member where account=?";
    con.query(sql, [acc], function (error, result) {
        if (error) console.log(error);
        regisCheck = result.length;
        console.log(regisCheck);
        if (regisCheck == 0) {
            sql = "INSERT INTO member(name, account, password) VALUES(?, ?, ?)";
            con.query(sql, [name, acc, pwd], function (error, result) {
                if (error) throw error;
                res.redirect('/LoginPage');
                console.log(result);
            })
        }
        else { // 帳號重複
            res.redirect('/RegisterPage');
        }
    })
});

app.get('/ProductPage.html', function (req, res) {
    res.sendFile(__dirname + '/ProductPage.html');
})



//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/uploads/')     // './uploads/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})


var upload = multer({
    storage: storage
});


app.post("/add-product", upload.single('image'), (req, res) => {
    // var id = req.body.id;
    var name = req.body.name;
    var dis = req.body.discription;
    var price = req.body.price;

    console.log(name);

    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename)
        // var imgsrc = 'http://127.0.0.1:7000/uploads/' + req.file.filename;
        var imgsrc = req.file.filename;
        var sql = "INSERT INTO product(name, discription, price, file_src) VALUES(?, ?, ?, ?)";
        con.query(sql, [name, dis, price, imgsrc], (err, result) => {
            if (err) throw err;
            // console.log("file uploaded")
            // res.send('Image Has been uploaded, please check your directory and mysql database....');
            res.redirect('/AdminPage');
        })
        // }
    }
});

var isEdit = false;
var id;

app.get('/AdminPage', function (req, res) {
    var sql = 'select * from product';
    con.query(sql, function (error, result) {
        if (error) console.log(error);
        res.render(__dirname + '/AdminPage', { products: result, edit: isEdit, id: id });
        isEdit = false;
    });
})

app.get('/delete-product', function (req, res) {
    var sql = 'delete from product where id=?';
    var id = req.query.id;

    con.query(sql, [id], function (error, result) {
        if (error) console.log(error);
        res.redirect('/AdminPage');
    });
})

app.get('/update-product', function (req, res) {
    isEdit = true
    id = req.query.id;
    res.redirect('/AdminPage');
})

app.post('/edit-product', upload.single('image'), function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var dis = req.body.discription;
    var price = req.body.price;

    if (!req.file) {
        console.log("No file upload");
        res.redirect('/AdminPage');
    } else {
        console.log(req.file.filename);
        var imgsrc = req.file.filename;
        var sql = "update product set name=?, discription=?, price=?, file_src=? where id=?";

        con.query(sql, [name, dis, price, imgsrc, id], function (error, result) {
            if (error) throw error;
            res.redirect('/AdminPage');
        })
    }
})


app.get('/cancel-edit', function (req, res) {
    res.redirect('/AdminPage');
})


var cart = []
var total_price;

app.get('/CheckoutPage', function (req, res) {
    res.render(__dirname + '/CheckoutPage', { products: cart, totalPrice: total_price });
    // console.log(total_price);
})


app.post('/CheckoutPage', function (req, res) {
    cart = req.body.cart;
    total_price = req.body.totalPrice;
    res.json({ message: 'Data received successfully', receivedData: req.body });
})


var name;
var dis;
var price;
var img;

app.post('/ProductPage', function (req, res) {
    name = req.body.name;
    dis = req.body.dis;
    price = req.body.price;
    img = req.body.img;
    res.json({ message: 'Data received successfully', receivedData: req.body });
})

app.get('/ProductPage', function (req, res) {
    res.render(__dirname + '/ProductPage', { product_name: name, product_dis: dis, product_price: price, product_img: img });
    // console.log(name, dis, price, img);
})

app.listen(7000);
