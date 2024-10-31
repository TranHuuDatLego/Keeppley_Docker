const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true
}));

// Kết nối với cơ sở dữ liệu
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'keeppley-shop'
});

conn.connect((err) => {
    if (err) {
        console.error("Connection Failed : " + err.stack);
        return;
    }
    console.log("Connected to database.");
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.redirect('/login_again_en');
    }

    
  if (username === 'admin' && password === '1234') {
    req.session.username = 'admin.com';
    return res.redirect('/Admin/public/index');
  } else {
    conn.query(
      'SELECT * FROM `user` WHERE username = ? AND loginpassword = ?',
      [username, password],
      (err, results) => {
        if (err) {
          console.error("Query Error: " + err);
          return res.redirect('/login_again_en');
        }

        if (results.length === 0) {
          req.session.error0 = 'Invalid username or password';
          return res.redirect('/login_again_en');
        } else {
          req.session.userID = results[0].userID;
          delete req.session.error0;
          return res.redirect('/product');
        }
      }
    );
  }
});

// Khởi động server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
