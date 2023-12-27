const express = require('express');
const path = require('path');
const opn = require('opn');

const hbs = require('express-handlebars');

const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  }
});

const upload = multer({ storage: storage });

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.engine('hbs', hbs({
  extname: 'hbs',
  layoutsDir: 'views/layouts/',
  defaultLayout: 'main.hbs',
}));

app.set('view engine', 'hbs');

app.get('/hello/:name', (req, res) => {
  res.render('hello', {  name: req.params.name });
});

app.get('/', (req, res) => {
  res.render('index');
});


app.get('/about', (req, res) => {
  res.render('about', { layout: 'dark' });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.post('/contact/send-message',  upload.single('uploaded_file'), (req, res) => {
  
  const { file } = req;
  const { author, sender, title, message} = req.body;

  if(author && sender && title && message && file) {
    res.render('contact', {file: `/${file.originalname}`, isSent: true });
  }
  else {
    res.render('contact', { isError: true });
  }

});

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  opn(`http://localhost:${port}`);
});
