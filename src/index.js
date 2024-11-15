
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'express-flash';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import moment from 'moment';
import dotenv from 'dotenv';
import database from './config/database.js';
import adminRoutes from './routes/admin/index.js';
import clientRoutes from './routes/client/index.js';
import systemConfig from './config/system.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware configuration
app.use('/tinymce', express.static(path.join(__dirname, '../node_modules/tinymce')));
app.use(cookieParser('keyboard cat'));
// app.use(session({ cookie: { maxAge: 60000 } }));
app.use(session({
  secret: 'keyboard cat',   // Thay thế bằng một chuỗi bảo mật thật trong môi trường thực tế
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Connect to the database
database();

// Static and view directories
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// Route handling
adminRoutes(app);
clientRoutes(app);

// Handle 404 errors
app.get('*', (req, res) => {
  res.status(404).render('client/pages/errors/404.pug');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
