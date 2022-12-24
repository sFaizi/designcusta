const fs = require('fs');
const AWS = require('aws-sdk');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const BudgetContact = require('../model/budgetContactModel');
const ContactUsClients = require('../model/contactUsModel');
const LogMonitor = require('../model/logMonitorModel');
const Promote = require('../model/promoteModel');
const Stat = require('../model/statsModel');
const DirectContact = require('../model/directContactModel');
const Credentials = require('../model/credentialsModel');

exports.globalView = catchAsync(async (req, res, next) => {
	const stat = await Stat.findById('620488719d8cc6ba3ea516a3');

	res.locals.offerStat = stat.offerSet;
	res.locals.offerMsg = stat.offerMsg;
	next();
});

exports.homeView = catchAsync(async (req, res, next) => {
	const stat = await Stat.findById('620488719d8cc6ba3ea516a3');
	stat.visitors += 1;
	await stat.save();

	res.status(200).render('home', {
		title: 'Web Dev',
	});
});

exports.serviceView = catchAsync(async (req, res, next) => {
	res.status(200).render('services', {
		title: 'Services / pricing',
	});
});

exports.aboutView = catchAsync(async (req, res, next) => {
	res.status(200).render('about', {
		title: 'About me',
	});
});

exports.portfolioView = catchAsync(async (req, res, next) => {
	res.status(200).render('portfolio', {
		title: 'Portfolio',
	});
});

exports.contactView = catchAsync(async (req, res, next) => {
	res.status(200).render('contact', {
		title: 'Contact',
	});
});

exports.getDoc = catchAsync(async (req, res, next) => {
	const path = `public/docs/${req.params.path}`;
	const stat = fs.statSync(path);
	const fileSize = stat.size;

	const head = {
		'Content-Length': fileSize,
		'Content-Type': `${
			req.params.path.endsWith('pdf') ? 'application/pdf' : 'image/jpeg'
		}`,
	};
	res.writeHead(200, head);
	fs.createReadStream(path).pipe(res);
});

exports.termsView = catchAsync(async (req, res, next) => {
	const stat = await Stat.findById('620488719d8cc6ba3ea516a3');
	stat.seriousVisit += 1;
	await stat.save();

	res.status(200).render('termsConditions', {
		title: 'Terms & Conditions',
	});
});

exports.adminView = catchAsync(async (req, res, next) => {
	res.status(200).render('adminLogin', {
		title: 'Admin Log In',
	});
});

exports.cPanelView = catchAsync(async (req, res, next) => {
	const unRead1 = await ContactUsClients.count({ readStatus: false });
	const unRead2 = await BudgetContact.count({ readStatus: false });
	const unRead3 = await DirectContact.count({ readStatus: false });
	const contacts = await Promote.count();

	const budgetCnts = await BudgetContact.find().sort('-createdAt');
	const usCnts = await ContactUsClients.find().sort('-createdAt');
	const dmCnts = await DirectContact.find().sort('-createdAt');
	const activity = await LogMonitor.find().sort('-createdAt');
	const stat = await Stat.findById('620488719d8cc6ba3ea516a3');

	let lastActivity = 'No activity';
	let budgetMsg = 0;
	let usContactMsg = 0;
	let directContactMsg = 0;
	let latestMsg;
	let allUnread;

	// last activity
	if (activity[0])
		lastActivity = new Date(activity[0].createdAt).toLocaleString('en-IN', {
			timeZone: 'Asia/Kolkata',
		});

	// All message counts
	if (budgetCnts[0]) budgetMsg = Date.parse(budgetCnts[0].createdAt);
	if (usCnts[0]) usContactMsg = Date.parse(usCnts[0].createdAt);
	if (dmCnts[0]) directContactMsg = Date.parse(dmCnts[0].createdAt);

	if (budgetMsg > usContactMsg && budgetMsg > directContactMsg) {
		latestMsg = new Date(budgetMsg).toLocaleString('en-IN', {
			timeZone: 'Asia/Kolkata',
		});
	} else if (usContactMsg > budgetMsg && usContactMsg > directContactMsg) {
		latestMsg = new Date(usContactMsg).toLocaleString('en-IN', {
			timeZone: 'Asia/Kolkata',
		});
	} else if (directContactMsg > budgetMsg && directContactMsg > usContactMsg) {
		latestMsg = new Date(directContactMsg).toLocaleString('en-IN', {
			timeZone: 'Asia/Kolkata',
		});
	} else {
		latestMsg = 'No message';
	}

	// Unread messages
	if (unRead1 || unRead2 || unRead3) {
		allUnread = unRead1 + unRead2 + unRead3;
	} else if (unRead1 + unRead2 + unRead3 === 0) {
		allUnread = '0';
	} else {
		allUnread = 'All read';
	}

	res.status(200).render('adminCpanel', {
		title: 'C-Panel',
		totalMsg:
			budgetCnts[0] || usCnts[0] || dmCnts[0]
				? budgetCnts.length + usCnts.length + dmCnts.length
				: '0',
		allUnread,
		latestMsg,
		lastActivity,
		sawTerms: stat.seriousVisit,
		contacts,
		visits: stat.visitors,
	});
});

exports.clientBudgetlView = catchAsync(async (req, res, next) => {
	const featured = new APIFeatures(BudgetContact.find(), req.query)
		.sort()
		.limitFields()
		.paginate();

	const docs = await featured.query;
	const docLength = await BudgetContact.countDocuments();

	res.status(200).render('adminClientBudget', {
		title: 'Client with budget',
		docs,
		docLength,
		limitStr: req.query.limit || 30,
		page: req.query.page,
	});
});

exports.clientsView = catchAsync(async (req, res, next) => {
	const featured = new APIFeatures(ContactUsClients.find(), req.query)
		.sort()
		.limitFields()
		.paginate();

	const docs = await featured.query;
	const docLength = await ContactUsClients.countDocuments();

	for (const client of docs) {
		for (const [index, imgName] of client.samples.entries()) {
			client.samples[index] = imgName;
		}
	}

	res.status(200).render('adminClients', {
		title: 'Clients',
		docs,
		docLength,
		limitStr: req.query.limit || 30,
		page: req.query.page,
	});
});

exports.directMail = catchAsync(async (req, res, next) => {
	const featured = new APIFeatures(DirectContact.find(), req.query)
		.sort()
		.limitFields()
		.paginate();
	const doc = await featured.query;
	const docLength = await DirectContact.countDocuments();

	res.status(200).render('adminDirectMail', {
		title: 'Direct emails',
		doc,
		docLength,
		limitStr: req.query.limit || 30,
		page: req.query.page,
	});
});

exports.contacts = catchAsync(async (req, res, next) => {
	const featured = new APIFeatures(Promote.find(), req.query)
		.sort()
		.limitFields()
		.paginate();
	const doc = await featured.query;
	const docLength = await Promote.countDocuments();

	res.status(200).render('adminContactList', {
		title: 'All contacts',
		doc,
		docLength,
		limitStr: req.query.limit || 30,
		page: req.query.page,
	});
});

exports.adminSettings = catchAsync(async (req, res, next) => {
	const cred = await Credentials.find();
	const stat = await Stat.findById('620488719d8cc6ba3ea516a3');

	res.status(200).render('adminSettings', {
		title: 'Settings',
		cred,
		offerSet: stat.offerSet,
	});
});

exports.getImage = catchAsync(async (req, res, next) => {
	const s3 = new AWS.S3({ region: process.env.AWS_REGION });
	const data = await s3
		.getObject({ Bucket: process.env.BUCKET_NAME, Key: req.params.name })
		.promise();

	const img = `data:image/jpeg;base64,${Buffer.from(data.Body).toString(
		'base64'
	)}`;

	res.status(200).json({
		data: img,
	});
});

exports.graphic = catchAsync(async (req, res, next) => {
	res.status(200).render('graphicDesign', {
		title: 'Graphic Design Blog',
	});
});

exports.webDev = catchAsync(async (req, res, next) => {
	res.status(200).render('webDev', {
		title: 'Webdevelopment Blog',
	});
});
