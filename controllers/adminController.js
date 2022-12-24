const AWS = require('aws-sdk');
const Email = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const bodyObjFilter = require('../utils/bodyObjFilter');
const BudgetContact = require('../model/budgetContactModel');
const ContactUsClients = require('../model/contactUsModel');
const DirectContact = require('../model/directContactModel');
const Credentials = require('../model/credentialsModel');
const Promote = require('../model/promoteModel');
const Stat = require('../model/statsModel');

exports.clientBudgetlRemove = catchAsync(async (req, res, next) => {
	req.body = bodyObjFilter(req.body, 'id');
	const doc = await BudgetContact.findByIdAndDelete(req.body.id);

	if (!doc)
		return next(
			new AppError('Could not delete the document. Try again or contact.', 404)
		);

	res.status(204).header({ status: 'success' }).end();
});

exports.createCust = catchAsync(async (req, res, next) => {
	req.body = bodyObjFilter(req.body, 'user', 'new', 'oldConfirm');

	const exist = await Credentials.findOne({ userID: req.body.user }).select(
		'+password'
	);
	if (exist) {
		if (await exist.correctPassword(req.body.oldConfirm, exist.password)) {
			exist.password = req.body.new;
			exist.confirmPassword = req.body.new;
			await exist.save();
		} else {
			return next(new AppError('Invalid Old Password.', 404));
		}
	} else {
		await Credentials.create({
			userID: req.body.user,
			password: req.body.new,
			confirmPassword: req.body.oldConfirm,
			role: 'custer',
		});
	}
	res.status(201).send({ status: 'success' }).end();
});

exports.clientRemove = catchAsync(async (req, res, next) => {
	req.body = bodyObjFilter(req.body, 'id');
	const doc = await ContactUsClients.findByIdAndDelete(req.body.id);

	if (!doc)
		return next(
			new AppError('Could not delete the document. Try again or contact.', 404)
		);

	for await (const imgName of doc.samples) {
		const s3 = new AWS.S3({ region: process.env.AWS_REGION });
		await s3
			.deleteObject({ Bucket: process.env.BUCKET_NAME, Key: imgName })
			.promise();
	}

	res.status(204).header({ status: 'success' }).end();
});

exports.directMailRemove = catchAsync(async (req, res, next) => {
	req.body = bodyObjFilter(req.body, 'id');
	const doc = await DirectContact.findByIdAndDelete(req.body.id);

	if (!doc)
		return next(
			new AppError('Could not delete the document. Try again or contact.', 404)
		);

	if (doc.attachments[0]) {
		for await (const imgName of doc.attachments) {
			const s3 = new AWS.S3({ region: process.env.AWS_REGION });
			await s3
				.deleteObject({ Bucket: process.env.BUCKET_NAME, Key: imgName })
				.promise();
		}
	}

	res.status(204).header({ status: 'success' }).end();
});

exports.clientContactRemove = catchAsync(async (req, res, next) => {
	req.body = bodyObjFilter(req.body, 'id');
	const doc = await Promote.findByIdAndDelete(req.body.id);

	if (!doc)
		return next(
			new AppError('Could not delete the document. Try again or contact.', 404)
		);
	res.status(204).header({ status: 'success' }).end();
});

exports.clientReadStatus = catchAsync(async (req, res, next) => {
	req.body = bodyObjFilter(req.body, 'id');
	if (req.params.type === 'budgetClient') {
		const doc = await BudgetContact.findById(req.body.id);
		if (!doc) return next();
		doc.readStatus = true;
		await doc.save();
	}

	if (req.params.type === 'contactClient') {
		const doc = await ContactUsClients.findById(req.body.id);
		if (!doc) return next();
		doc.readStatus = true;
		await doc.save();
	}

	if (req.params.type === 'directContact') {
		const doc = await DirectContact.findById(req.body.id);
		if (!doc) return next();
		doc.readStatus = true;
		await doc.save();
	}

	res.status(201).send({ status: 'success' }).end();
});

exports.customReply = catchAsync(async (req, res, next) => {
	req.body = bodyObjFilter(
		req.body,
		'subject',
		'message',
		'email',
		'name',
		'type'
	);
	if (!req.body.email || !req.body.message) {
		return next(new AppError('Resend mail, missing data!', 404));
	}

	let doc = null;

	if (req.body.type === 'budget')
		doc = await BudgetContact.findOne({ email: req.body.email });

	if (req.body.type === 'contact')
		doc = await ContactUsClients.findOne({ email: req.body.email });

	if (req.body.type === 'directMail')
		doc = await DirectContact.findOne({ email: req.body.email });

	if (!doc) return next(new AppError('E-mail not found', 404));

	await new Email(req.body.email, req.body.name).customReply(
		req.body.subject,
		req.body.message
	);

	doc.replies.push({
		subject: req.body.subject,
		message: req.body.message,
	});

	await doc.save();

	res.status(201).send({ status: 'success' }).end();
});

exports.userRemove = catchAsync(async (req, res, next) => {
	req.body = bodyObjFilter(req.body, 'id');
	const doc = await Credentials.findByIdAndDelete(req.body.id);

	if (!doc)
		return next(
			new AppError('Could not delete user. Try again or contact.', 404)
		);
	res.status(204).header({ status: 'success' }).end();
});

exports.setOffer = catchAsync(async (req, res, next) => {
	req.body = bodyObjFilter(req.body, 'offerSet', 'offerMsg');
	const stat = await Stat.findById('620488719d8cc6ba3ea516a3');
	stat.offerSet = req.body.offerSet;
	stat.offerMsg = req.body.offerMsg || 'New offers arriving soon....';
	await stat.save();
	res.status(201).send({ status: 'success' }).end();
});
