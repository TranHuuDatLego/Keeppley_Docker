// Import các thư viện cần thiết
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session'); // Import express-session
const mysql = require('mysql');

// Khởi tạo ứng dụng Express
const app = express();

// Cấu hình view engine là EJS
app.set('view engine', 'ejs');

// Middleware để chọn thư mục views dựa trên ngôn ngữ
app.use((req, res, next) => {
  const lang = req.query.lang || 'en'; // Giả sử truyền ngôn ngữ qua query parameter 'lang'
  const viewsDir = lang === 'vn' ? 'vn' : 'en';
  app.set('views', path.join(__dirname, viewsDir));
  next();
});

// Lấy thư mục ảnh
app.use(express.static(path.join(__dirname, 'public')));

// Hàm để phục vụ tệp hình ảnh
const getImage = (res, imagePath) => {
  // Xác định kiểu nội dung dựa trên phần mở rộng tệp
  const extname = String(path.extname(imagePath)).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    // Thêm các kiểu MIME khác nếu cần
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(imagePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(getMessageHTML('Hình ảnh không tồn tại!', true));
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
};

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

// app.post('/login', (req, res) => {
//   console.log(req.body); // Kiểm tra xem dữ liệu có được gửi hay không
//   const { username, password } = req.body;
//   return res.redirect('/product');

//   if (!username || !password) {
//     return res.redirect('/login_again_en');
//   }
//   // Phần còn lại của mã ...
// });

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.redirect('/login_again_en');
  }

  if (username === 'admin' && password === '1234') {
    req.session.username = 'admin.com';
    return res.redirect('/Admin/index');
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


// Định nghĩa route cho trang chủ
app.get('/', (req, res) => {
  const website = 'index.ejs'; // Lấy tên file từ URL
  const userLogin = req.session.userID || undefined;
  res.render('index', { website, userLogin });
});

app.get('/index', (req, res) => {
  const website = 'index.ejs'; // Lấy tên file từ URL
  const userLogin = req.session.userID || undefined;
  res.render('index', { website, userLogin });
});

app.get('/head', (req, res) => {
  res.render('head');
});

app.get('/ChooseLogin_en', (req, res) => {
  const website = 'ChooseLogin_en.ejs'; // Lấy tên file từ URL
  const userLogin = req.session.userID || undefined;
  res.render('ChooseLogin_en', { website, userLogin });
});


app.get('/404', (req, res) => {
  const website = '404.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('404', { website, userLogin });
});

app.get('/Category_Product', (req, res) => {
  const website = 'Category_Product.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('Category_Product', { website, userLogin });
});

app.get('/Connections', (req, res) => {
  const website = 'Connections.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('Connections', { website, userLogin });
});

app.get('/doraemon', (req, res) => {
  const website = 'doraemon.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('doraemon', { website, userLogin });
});

app.get('/footer', (req, res) => {
  const website = 'footer.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('footer', { website, userLogin });
});

app.get('/footer_dark', (req, res) => {
  const website = 'footer_dark.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('footer_dark', { website, userLogin });
});

app.get('/form_login_en', (req, res) => {
  const website = 'form_login_en.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('form_login_en', { website, userLogin });
});

app.get('/General', (req, res) => {
  const website = 'General.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('General', { website, userLogin });
});

app.get('/Image', (req, res) => {
  const website = '/Image.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('/Image', { website, userLogin });
});

app.get('/Information', (req, res) => {
  const website = 'Information.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('Information', { website, userLogin });
});

app.get('/Keeppley_Products', (req, res) => {
  const website = 'Keeppley_Products.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('Keeppley_Products', { website, userLogin });
});

app.get('/Languages', (req, res) => {
  const website = 'Languages.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('Languages', { website, userLogin });
});

app.get('/LEGO_Products', (req, res) => {
  const website = 'LEGO_Products.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('LEGO_Products', { website, userLogin });
});

app.get('/Notification', (req, res) => {
  const website = 'Notification.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('Notification', { website, userLogin });
});

app.get('/product', (req, res) => {
  const website = 'product.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('product', { website, userLogin });
});

app.get('/product_detail', (req, res) => {
  const website = 'product_detail.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('product_detail', { website, userLogin });
});

app.get('/Qman_Products', (req, res) => {
  const website = 'Qman_Products.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('Qman_Products', { website, userLogin });
});

app.get('/sario', (req, res) => {
  const website = 'sario.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('sario', { website, userLogin });
});

app.get('/Sidebar', (req, res) => {
  const website = 'Sidebar.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('Sidebar', { website, userLogin });
});

app.get('/SocialLinks', (req, res) => {
  const website = 'SocialLinks.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('SocialLinks', { website, userLogin });
});

app.get('/Admin/index', (req, res) => {
  const website = 'index.ejs';
  const userLogin = req.session.userID || undefined;
  res.render('Admin/index', { website, userLogin });
});

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });

// app.get('/Category_Product', (req, res) => {
//   const website = 'Category_Product.ejs';
//   const userLogin = req.session.userID || undefined;
//   res.render('Category_Product', { website, userLogin });
// });
// Cấu hình cổng để server lắng nghe
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");
});
