const express = require('express');

const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

// credentials
const general = 'custer';
const master = 'custaowner';

router.post('/login-access', authController.login);
router.get('/logout', authController.protect, authController.logOut);

router.post(
	'/read/:type',
	authController.protect,
	authController.restrictTo(master, general),
	adminController.clientReadStatus
);

router.post(
	'/create-cust',
	authController.protect,
	authController.restrictTo(master),
	adminController.createCust
);

router.patch(
	'/customReply',
	authController.protect,
	authController.restrictTo(master, general),
	adminController.customReply
);

router.delete(
	'/remove-bdgt-client',
	authController.protect,
	authController.restrictTo(master),
	adminController.clientBudgetlRemove
);

router.delete(
	'/remove-client',
	authController.protect,
	authController.restrictTo(master),
	adminController.clientRemove
);

router.delete(
	'/remove-directMail',
	authController.protect,
	authController.restrictTo(master),
	adminController.directMailRemove
);

router.delete(
	'/remove-contact',
	authController.protect,
	authController.restrictTo(master),
	adminController.clientContactRemove
);

router.delete(
	'/delUser',
	authController.protect,
	authController.restrictTo(master),
	adminController.userRemove
);

router.post(
	'/set-offer',
	authController.protect,
	authController.restrictTo(master),
	adminController.setOffer
);

module.exports = router;
