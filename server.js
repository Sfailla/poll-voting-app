const dotenv = require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// Initialize the App
const app = express();
// Declare the PORT variable
const port = process.env.PORT || 3000;
// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// mongoose connection
mongoose
	.connect(process.env.MONGOOSE_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	// Establish DB connection and log to console
	.then(() => console.log('Mongooose Connected to MLAB...'))
	.catch(err => console.log(err));

// Configuring the Application Static Files
app.use(express.static(path.join(__dirname, 'public')));

const hbs = exphbs.create({
	extname: 'hbs',
	defaultLayout: 'main',
	partialsDir: path.join(__dirname, '/views/partials'),
	layoutsDir: path.join(__dirname, '/views/layouts'),
	helpers: {
		listCSS: () => {
			const list = [
				'contact.css',
				'createPoll.css',
				'footer.css',
				'forms.css',
				'header.css',
				'jumbotron.css',
				'main.css'
			];
			return list;
		}
	}
});
// Express Handlebars Templating init
app.engine('hbs', hbs.engine);
// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Configuring the Application MiddleWare
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// Middleware for connect session
app.use(
	session({
		secret: 'secret',
		store: new MongoStore({
			mongooseConnection: mongoose.connection
		}),
		resave: false,
		saveUninitialized: false
	})
);
// Bring in and initialize Passport
app.use(passport.initialize());
app.use(passport.session());
// Initialize connect flash
app.use(flash());
// Global flash variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

const index = require('./routes/index');
const users = require('./routes/users');
const polls = require('./routes/polls');

app.use('/', index);
app.use('/users', users);
app.use('/polls', polls);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'layouts', 'main.hbs'));
});

const User = require('./models/user');

// Local Passport Strategy
passport.use(
	new LocalStrategy(function(username, password, done) {
		User.findOne({ username }, (err, user) => {
			if (err) {
				return done(err);
			} else if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			} else {
				let hash = user.password;
				bcrypt.compare(password, hash, function(err, isMatch) {
					if (err) console.error(err);
					if (!isMatch) {
						return done(null, false, {
							message: 'Incorrect password.'
						});
					}
					return done(null, { id: user._id, user: user.username });
				});
			}
		});
	})
);

passport.serializeUser((user_id, done) => {
	done(null, user_id);
});

passport.deserializeUser((user_id, done) => {
	done(null, user_id);
});

app.listen(port, () => {
	console.log(`Server running on port: ${port}`);
	console.log(`node env = ${process.env.NODE_ENV}`);
});
