const multer = require('multer');
const AppError = require('../utils/appError');

const handleObjectIdDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

const handleUniqueFieldDB = (err) => {
	const value = Object.values(err.keyValue);
	const message = `"${value}" is not available. Try something different`;
	return new AppError(message, 400);
};

const multerError = () => {
	const message = 'upload jpeg image less than 1.5mb';
	return new AppError(message, 400);
};

const handleValidationDB = (err) => {
	const value = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input; ${value.join('. ')}`;
	return new AppError(message, 400);
};

const handleJWTExpireError = () =>
	new AppError('Session expired. Login again', 401);

const handleJWTError = () =>
	new AppError(
		'Session failed. Please login again with valid credentials.',
		401
	);

const sendErrorDev = (err, req, res) => {
	if (req.originalUrl.startsWith('/') || req.originalUrl.startsWith('/api')) {
		console.log('ERROR 💥', err);
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
			error: err,
			stack: err.stack,
		});
	}
	console.log('SYS 💥', err);
	return res.status(err.statusCode).json({
		title: 'Something went wrong!',
		msg: err.message,
	});
};

const sendErrorProd = (err, req, res) => {
	// A) API
	if (req.originalUrl.startsWith('/api')) {
		// A) Operational, trusted error: send message to client
		if (err.isOperational) {
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message,
			});
		}
		// B) Programming or other unknown error: don't leak error details
		// 1) Log error
		console.error('ERROR 💥', err);
		// 2) Send generic message
		return res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!',
		});
	}

	// B) RENDERED WEBSITE
	// A) Operational, trusted error: send message to client
	if (err.isOperational) {
		return res.status(err.statusCode).render('error', {
			title: 'Something went wrong!',
			msg: err.message,
		});
	}
	// B) Programming or other unknown error: don't leak error details
	// 1) Log error
	console.error('ERROR 💥', err);
	// 2) Send generic message
	return res.status(err.statusCode).render('error', {
		title: 'Something went wrong!',
		msg: 'Please try again later.',
	});
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...err };
		error.name = err.name;
		error.message = err.message;
		if (error.kind === 'ObjectId') error = handleObjectIdDB(error);
		if (error.code === 11000) error = handleUniqueFieldDB(error);
		if (err instanceof multer.MulterError) error = multerError(error);
		if (error.name === 'ValidationError') error = handleValidationDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpireError();

		sendErrorProd(error, req, res);
	}
};
