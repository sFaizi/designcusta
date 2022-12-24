const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

// new Email(to, name, website).send(template, subject, message)

module.exports = class Email {
	constructor(to, name, website = 'www.designcusta.com') {
		this.to = to;
		this.name = name;
		this.website = website;
		this.from = `<${process.env.EMAIL_FROM}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			// Sendgrid
			return nodemailer.createTransport({
				service: 'SendGrid',
				server: 'smtp.sendgrid.net',
				host: 'www.designcusta.com',
				port: process.env.SENDGRID_PORT,
				auth: {
					user: process.env.SENDGRID_USERNAME,
					pass: process.env.SENDGRID_PASS,
				},
			});
		}

		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	async send(template, subject, message) {
		// Render template
		const html = pug.renderFile(
			`${__dirname}/../views/emails/${template}.pug`,
			{
				name: this.name,
				website: this.website,
				subject,
				message,
			}
		);

		// 2) Define email options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText(html),
			attachments: [
				{
					filename: 'dc_logo.png',
					path: `${__dirname}/dc_logo.png`,
					cid: 'uniq-dc_logo.png',
				},
			],
		};

		// 3) Create a transport and send email
		await this.newTransport().sendMail(mailOptions);
	}

	async budgetClient(services) {
		await this.send(
			'budgetClientReply',
			'Greetings from Designcusta 🎉',
			services
		);
	}

	async contactUsReply() {
		await this.send('contactUsReply', 'Greetings from Designcusta 🎉');
	}

	async directContactReply() {
		await this.send('directContactReply', 'Greetings from Designcusta 🎉');
	}

	async customReply(sbjct, msg) {
		await this.send('customReply', sbjct, msg);
	}
};
