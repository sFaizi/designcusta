const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const LogMonitor = require('../model/logMonitorModel');
const Credentials = require('../model/credentialsModel');

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	res.cookie('jwt', token, cookieOptions);

	res.status(statusCode).send({ status: 'success' }).end();
};

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
	const { userID, password } = req.body;

	if (!userID || !password) {
		return next(new AppError('Provide user credentials', 400));
	}

	const user = await Credentials.findOne({ userID }).select('+password');
	if (!user) {
		return next(new AppError('Invalid credentials', 404));
	}
	if (!user) {
		return next(new AppError('Invalid credentials and few attempts left', 404));
	}

	if (
		userID === user.userID &&
		(await user.correctPassword(password, user.password))
	) {
		user.password = undefined;
		createSendToken(user, 200, res);
	} else {
		return next(new AppError('Invalid password', 400));
	}
});

// LOG OUT
exports.logOut = catchAsync(async (req, res, next) => {
	res.cookie('jwt', 'Logged out', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	// activity log
	await LogMonitor.create({ logger: req.user });
	res.status(200).header({ status: 'success' }).end();
});

// USER PROTECTED ROUTES
exports.protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		return next(new AppError('You first need to login.', 401));
	}

	// Verification of token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// Check wheter user still exists
	const currentUser = await Credentials.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError('User no longer exists.', 401));
	}

	//If password changed after token
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError('Recently password was changed! Please login again.', 401)
		);
	}

	//  GRANT ACCESS TO PROTECTED ROUTE
	req.user = currentUser;
	next();
});

// RESTRICTION
exports.restrictTo =
	(...role) =>
	(req, res, next) => {
		if (req.user) {
			if (!role.includes(req.user.role)) {
				return next(new AppError('Access Denied', 403));
			}
			return next();
		}

		return next(new AppError('Access Denied', 403));
	};
