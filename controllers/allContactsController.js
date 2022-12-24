const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { htmlToText } = require('html-to-text');

const Email = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const bodyObjFilter = require('../utils/bodyObjFilter');
const Budgetcontact = require('../model/budgetContactModel');
const ContactUs = require('../model/contactUsModel');
const Promote = require('../model/promoteModel');
const DirectContact = require('../model/directContactModel');

// CONTACT FROM SERVICE PAGE ***************************************************************************
exports.budgetContact = catchAsync(async (req, res, next) => {
	req.body = bodyObjFilter(
		req.body,
		'name',
		'email',
		'phone',
		'allWebCharges',
		'allGraphicCharges'
	);

	const checkMail = await Budgetcontact.findOne({ email: req.body.email });
	if (checkMail)
		return next(
			new AppError('You have already mailed. Try another contact method.', 400)
		);

	if (!req.body.name || !req.body.email)
		return next(new AppError('Name or email is incomplete', 400));

	req.body.readStat = false;

	const services = { ...req.body.allWebCharges, ...req.body.allGraphicCharges };
	const orderedServ = [];

	Object.entries(services).forEach((el) => {
		if (el[1] !== 0) orderedServ.push(el);
	});

	let total = 0;
	orderedServ.forEach((el) => {
		const words = el[0].split('_');
		words[0] =
			words[0].split('_')[0].charAt(0).toUpperCase() + words[0].substr(1);

		el[0] = words.join(' ');
		total += el[1];
	});

	await new Email(req.body.email, req.body.name).budgetClient({
		total,
		serv: orderedServ,
	});

	await new Email('sartaj.faizi21@gmail.com', req.body.name).send(
		'notification',
		'Contacted with budget',
		orderedServ.toString()
	);

	await Budgetcontact.create(req.body);
	const checkPromote = await Promote.findOne({ email: req.body.email });
	if (!checkPromote)
		await Promote.create({
			email: req.body.email,
			name: req.body.name,
			phone: req.body.phone,
		});
	res.status(201).send({ status: 'success' }).end();
});

// ------------------------------------------------------

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image/jpeg')) {
		cb(null, true);
	} else {
		cb(
			new AppError('Please upload JPEG image less than 1.5mb only', 400),
			false
		);
	}
};
const s3 = new AWS.S3({ region: process.env.AWS_REGION });
const storage = multerS3({
	s3: s3,
	bucket: process.env.BUCKET_NAME,
	metadata: function (req, file, cb) {
		cb(null, { fieldName: file.fieldname });
	},
	key: (req, file, cb) => {
		let uniqueSuffix;
		if (file.mimetype.startsWith('image'))
			uniqueSuffix = `sample-${Date.now()}.jpeg`;
		cb(null, uniqueSuffix);
	},
	contentType: multerS3.AUTO_CONTENT_TYPE,
});

const limits = {
	fieldNameSize: 200,
	fileSize: 5000000,
};

const upload = multer({
	fileFilter: multerFilter,
	limits,
	storage,
});

exports.uploadSample = upload.array('samples', 3);

// CONTACT US FORM *****************************************************************************
exports.contactUs = catchAsync(async (req, res, next) => {
	if (!req.files || !req.body.email || !req.body.name)
		return next(new AppError('Please complete the form.'));

	req.body = bodyObjFilter(
		req.body,
		'name',
		'email',
		'phone',
		'describe',
		'samples'
	);

	const check = await ContactUs.findOne({ email: req.body.email });
	if (check)
		return next(
			new AppError('You have already mailed. Try another contact method.', 400)
		);

	req.body.samples = [];
	req.files.forEach((file) => req.body.samples.push(file.key));

	req.body.readStat = false;

	await new Email(req.body.email, req.body.name).contactUsReply();
	await new Email('sartaj.faizi21@gmail.com', req.body.name).send(
		'notification',
		'from contact us',
		req.body.describe
	);

	await ContactUs.create(req.body);
	const checkPromote = await Promote.findOne({ email: req.body.email });
	if (!checkPromote)
		await Promote.create({
			email: req.body.email,
			name: req.body.name,
			phone: req.body.phone,
		});

	res.status(201).send({ status: 'success' }).end();
});

// INCOMING MAILS ************************************************************************
const upload2 = multer({
	fileFilter: multerFilter,
	limits,
	storage,
});

exports.uploadInbound = upload2.any();

exports.incomingMail = catchAsync(async (req, res, next) => {
	if (req.files) {
		req.body.files = [];
		req.body.files.forEach((file) => req.body.files.push(file.key));
	}

	const extract = (str, startChr, endChr) => {
		const startPos = str.indexOf(`${startChr}`) + 1;
		const endPos = str.indexOf(`${endChr}`, startPos);
		const result = str.substring(startPos, endPos);
		return result;
	};

	const text = htmlToText(req.body.html);
	const email = extract(req.body.from, '<', '>');
	const name = req.body.from.split('<')[0];

	await DirectContact.create({
		email,
		name,
		subject: req.body.subject,
		to: extract(req.body.to, '<', '>'),
		text,
		html: req.body.html,
		attachments: req.body.files,
	});

	const checkPromote = await Promote.findOne({ email });
	if (!checkPromote) {
		await Promote.create({
			email,
			name,
		});

		new Email(email, req.body.name).directContactReply();
	}

	await new Email('sartaj.faizi21@gmail.com', req.body.name).send(
		'notification',
		req.body.subject,
		text
	);
	res.status(201).send({ status: 'success' }).end();
});

exports.callbacks = catchAsync(async (req, res, next) => {
	if (!req.body.name || !req.body.phone)
		return next(new AppError('Please complete the form.'));

	req.body = bodyObjFilter(req.body, 'name', 'phone');

	const checkPromote = await Promote.findOne({ phone: req.body.phone });
	if (checkPromote)
		return next(new AppError('Your have already made a request.'));
	if (!checkPromote)
		await Promote.create({
			name: req.body.name,
			phone: req.body.phone,
		});

	res.status(201).send({ status: 'success' }).end();
});
