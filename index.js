require('dotenv').config();

const express = require('express');
const cors = require('cors');
const router = require('./src/routes');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname + '../public')));
app.use(cors());
app.use(express.json());

app.get('/', function (req, res) {
	res.render('index');
});

app.use('/api/v1/', router);
app.listen(port, () => console.log(`Listening on port ${port}!`));
