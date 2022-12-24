const express = require('express');

const router = express.Router();

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

// credentials
const general = 'custer';
const master = 'custaowner';

router.use(viewController.globalView);

router.get('/', viewController.homeView);
router.get('/services', viewController.serviceView);
router.get('/contact', viewController.contactView);
router.get('/portfolio', viewController.portfolioView);
router.get('/terms-conditions', viewController.termsView);
router.get('/graphic-blog', viewController.graphic);
router.get('/webDev-blog', viewController.webDev);
router.get('/docs/:id', viewController.getDoc);

// Admin routes
router.get('/custamin', viewController.adminView);

router.get(
	'/c-panel',
	authController.protect,
	authController.restrictTo(master, general),
	viewController.cPanelView
);
router.get(
	'/client-budget',
	authController.protect,
	authController.restrictTo(master, general),
	viewController.clientBudgetlView
);
router.get(
	'/clients',
	authController.protect,
	authController.restrictTo(master, general),
	viewController.clientsView
);
router.get(
	'/clientSample/:name',
	authController.protect,
	authController.restrictTo(master, general),
	viewController.getImage
);

router.get(
	'/directMails',
	authController.protect,
	authController.restrictTo(master, general),
	viewController.directMail
);

router.get(
	'/contacts',
	authController.protect,
	authController.restrictTo(master, general),
	viewController.contacts
);

router.get(
	'/set',
	authController.protect,
	authController.restrictTo(master),
	viewController.adminSettings
);

module.exports = router;
