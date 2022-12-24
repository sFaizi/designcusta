const express = require('express');

const router = express.Router();
const allContactsController = require('../controllers/allContactsController');

router.post('/custBudget', allContactsController.budgetContact);
router.post(
	'/contact-us',
	allContactsController.uploadSample,
	allContactsController.contactUs
);

router.post('/callbacks', allContactsController.callbacks);

router.post(
	'/incoming-mails',
	allContactsController.uploadInbound,
	allContactsController.incomingMail
);

module.exports = router;
