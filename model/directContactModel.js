const mongoose = require('mongoose');

const directContactSchema = new mongoose.Schema(
	{
		email: String,
		name: String,
		subject: String,
		to: String,
		text: String,
		html: String,
		attachments: Array,

		readStatus: {
			type: Boolean,
			default: false,
		},

		replies: [
			{
				subject: String,
				message: String,
			},
		],

		createdAt: Date,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// DOCUMENT MIDDLEWARE
directContactSchema.index({
	from: 1,
});

directContactSchema.pre('save', function (next) {
	if (!this.createdAt) {
		this.createdAt = Date.now();
	}
	next();
});

const DirectContact = mongoose.model('DirectContact', directContactSchema);

module.exports = DirectContact;
