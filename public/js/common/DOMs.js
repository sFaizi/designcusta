exports.navAndFootDOMs = {
	// mini navigation
	miniNav: document.querySelector('.miniNav'),
	miniNavButton: document.querySelector('.miniNav--check'),

	// footer
	foot: document.querySelector('.footer'),
	float: document.querySelector('.footer_float'),

	// Global html
	offer: document.querySelector('.offer'),
	offerBox: document.querySelector('.offer_box'),
};

exports.homeDOMs = {
	homeParent: document.querySelector('.home'),
	working: document.querySelector('.home_working'),
	discussImg: document.querySelector('.home_working_circuit_discuss--img'),
	dealingImg: document.querySelector('.home_working_circuit_dealing--img'),
	doneImg: document.querySelector('.home_working_circuit_done--img'),
	termPage: document.querySelector('.terms'),
	callbackForm: document.getElementById('callback'),
	callbackName: document.getElementById('clbName'),
	callbackPhone: document.getElementById('clbPhone'),
};

// Clients with budget
exports.serviceDOMs = {
	serviceParent: document.querySelector('.services'),
	webRadio: document.getElementById('webRadio'),
	webList: document.querySelector('.services_list_web'),
	webLabel: document.querySelector('.services_list--webRadio_label'),
	graphicRadio: document.getElementById('graphicRadio'),
	graphicLabel: document.querySelector('.services_list--graphicRadio_label'),
	graphicList: document.querySelector('.services_list_graphic'),
	graphicCharge: document.getElementsByName('graphicServiceCharge'),
	webCharge: document.getElementsByName('webServiceCharge'),
	graphicChargeDisplay: document.querySelector(
		'.services_total--graphic_charge'
	),
	webChargeDisplay: document.querySelector('.services_total--web_charge'),
	totalCharge: document.querySelector('.services_total--amount'),
	additionalPagePriceBox: document.querySelectorAll(
		'.services_list_web_capsule_page'
	),

	// form
	formBudget: document.getElementById('serviceForm'),
	custNameBudget: document.getElementById('name'),
	custEmailBudget: document.getElementById('email'),
	custPhoneBudget: document.getElementById('phone'),
	capchaExp: document.querySelector('.services_request_form_captcha--captcha'),
	capchaAns: document.getElementById('bdgtCaptcha'),
	capchaReload: document.querySelector(
		'.services_request_form_captcha--reload'
	),
	capchaCheck: document.getElementById('bdgtNorobot'),
};

exports.contactUsDOMs = {
	contactUsForm: document.getElementById('contact_us'),
	name: document.getElementById('contact_name'),
	email: document.getElementById('contact_email'),
	phone: document.getElementById('contact_phone'),
	describe: document.getElementById('contact_describe'),
	sample1: document.getElementById('contact_sample1'),
	sample2: document.getElementById('contact_sample2'),
	sample3: document.getElementById('contact_sample3'),
	allSamples: document.querySelectorAll('.contact_form_sample--input'),
	capchaExp: document.querySelector('.contact_form_captcha--captcha'),
	capchaAns: document.getElementById('cntCaptcha'),
	capchaReload: document.querySelector('.contact_form_captcha--reload'),
	capchaCheck: document.getElementById('cntNorobot'),
};

exports.adminDoms = {
	// clients with budget table list
	clientBudgetParent: document.querySelector('.clientBdgt'),
	clientBudgetTable: document.querySelector('.clientBdgt_table'),
	clientBudgetView: document.querySelector('.viewBdgClient'),
	clientBudgetDel: document.querySelector('.removeBdgClient'),
	clientBudgetViewer: document.querySelector('.clientBdgt_view'),
	clientBudgetCloser: document.querySelector('.clientBdgt_view--closer'),
	clientBudgetReceived: document.querySelector(
		'.clientBdgt_view_identity--received'
	),
	clientBudgetName: document.querySelector('.clientBdgt_view_identity--name'),
	clientBudgetMail: document.querySelector('.clientBdgt_view_identity--mail'),
	clientBudgetPhone: document.querySelector('.clientBdgt_view_identity--phone'),
	clientBudgetWebServices: document.querySelector('.clientBdgt_view_webBudget'),
	clientBudgetGraphicServices: document.querySelector(
		'.clientBdgt_view_graphicBudget'
	),
	clientBudgetReplyers: document.querySelectorAll('.clientBdgt_view_reply'),
	clientBudgetHead: document.querySelector('.clientBdgt_view_past--head'),
	clientBdgtPastSubject: document.querySelector(
		'.clientBdgt_view_past_reply--subject'
	),
	clientBdgtPastMsg: document.querySelector('.clientBdgt_view_past_reply--msg'),

	// Clients from contact us
	clientParent: document.querySelector('.client'),
	clientTable: document.querySelector('.client_table'),
	clientViewer: document.querySelector('.client_view'),
	clientName: document.querySelector('.client_view_identity--name'),
	clientMail: document.querySelector('.client_view_identity--mail'),
	clientPhone: document.querySelector('.client_view_identity--phone'),
	clientDescription: document.querySelector('.client_view_msg--describe'),
	clientSamplesBox: document.querySelector('.client_view_samples'),
	clientViewerCloser: document.querySelectorAll('.client_view--closer'),
	clientReplyers: document.querySelectorAll('.client_view_reply'),
	clientHead: document.querySelector('.client_view_past--head'),
	clientPastSubject: document.querySelector('.client_view_past_reply--subject'),
	clientPastMsg: document.querySelector('.client_view_past_reply--msg'),

	// Direct contacts
	dmParent: document.querySelector('.directMail'),
	dmTable: document.querySelector('.directMail_table'),
	dmViewer: document.querySelector('.directMail_view'),
	dmName: document.querySelector('.directMail_view_identity--name'),
	dmMail: document.querySelector('.directMail_view_identity--mail'),
	dmSubject: document.querySelector('.directMail_view_identity--subject'),
	dmTo: document.querySelector('.directMail_view_identity--to'),
	dmText: document.querySelector('.directMail_view_msg--text'),
	dmSampleBox: document.querySelector('.directMail_view_samples'),
	dmViewerCloser: document.querySelectorAll('.directMail_view--closer'),
	dmReplyers: document.querySelectorAll('.directMail_view_reply'),
	dmHead: document.querySelector('.directMail_view_past--head'),
	dmPastSubject: document.querySelector('.directMail_view_past_reply--subject'),
	dmPastMessage: document.querySelector('.directMail_view_past_reply--msg'),

	// Auth
	loginForm: document.getElementById('loginForm'),
	user: document.getElementById('user'),
	pass: document.getElementById('pass'),
	logout: document.querySelectorAll('.admin--logout'),

	//Client contacts
	clCntTable: document.querySelector('.cntList_table'),

	// Settings
	custerForm: document.getElementById('custerForm'),
	setParent: document.querySelector('.settings'),
	userList: document.querySelector('.settings_user_list'),
	userID: document.getElementById('userID'),
	userPassNew: document.getElementById('userPassNew'),
	userPassOld: document.getElementById('userPassOld'),
	offerForm: document.querySelector('.settings_offer'),
	offerMsg: document.getElementById('offer_msg'),
	offerSwitch: document.getElementById('offer_switch'),
};
