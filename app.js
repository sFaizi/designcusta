const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const bodyParser = require('body-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const viewsRouter = require('./routes/viewRoutes');
const contactRouter = require('./routes/contactRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARE

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'", 'https://www.google.com/'],
			baseUri: ["'self'"],
			fontSrc: ["'self'", 'https:', 'http:'],
			scriptSrc: ["'self'"],
			objectSrc: "'none'",
			styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
			imgSrc: ["'self'", 'https:', 'data:'],
			connectSrc: ["'self'"],
		},
	})
);

app.use(compression());

const limiter = (count, hrs = 1) =>
	rateLimit({
		max: count,
		windowMs: hrs * 60 * 60 * 1000,
		message: `Too many requests from same IP address, please try again in ${hrs} hour(s) later.`,
	});

app.use('/', limiter(900));
app.use('/api/v1/contact', limiter(20, 5));
app.use('/api/v1/admin', limiter(500));

// PARSERs
app.use(express.json({ limit: '6mb' }));
app.use(bodyParser.json());
app.use(cookieParser());

// DATA SANITIZATION AGAINST NOSQL INJECTION
app.use(mongoSanitizer());

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// SERVING STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/', viewsRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/admin', adminRouter);

// MIDDLEWARE UNHANDLED ROUTES
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
