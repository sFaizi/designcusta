const {
	planeMotion,
	callback,
} = require('./publicController/homePublicController');
const {
	toggleService,
	serviceCal,
	submitBudget,
} = require('./publicController/servicesPublicController');
const { contactUs } = require('./publicController/contactUsPublicController');
const {
	clientBdgtViewer,
	clientBdgtRemover,
	clientBdgtReplyer,
} = require('./publicController/admin/budgetPublicClient');
const {
	clientViewer,
	clientRemover,
	clientReplyer,
} = require('./publicController/admin/contactPublicClient');
const {
	dmViewer,
	dmReplyer,
	dmRemover,
} = require('./publicController/admin/directContactPublic');
const {
	clientContactRemover,
} = require('./publicController/admin/clientContacts');
const {
	login,
	logOut,
} = require('./publicController/admin/authPublicController');
const {
	createCuster,
	delUser,
	offerSet,
} = require('./publicController/admin/settings');
const { navigation, footer } = require('./common/navAndFoot');
const offerPopup = require('./common/offerPopup');

// Common
offerPopup();

// Home controller
planeMotion();
callback();

// Services controller
toggleService();
serviceCal();
submitBudget();

// Contact us controller
contactUs();

// budget clients (ADMIN)
clientBdgtViewer();
clientBdgtRemover();
clientBdgtReplyer();

// contact us clients (ADMIN)
clientViewer();
clientRemover();
clientReplyer();

// Direct Contacts
dmViewer();
dmReplyer();
dmRemover();

// Callback contacts
clientContactRemover();

// auth controller
login();
logOut();

// Settings
createCuster();
delUser();
offerSet();

// Navigation & Footer
navigation();
footer();
