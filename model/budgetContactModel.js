const mongoose = require('mongoose');
const validator = require('validator');

const budgetContactSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: [true, 'Please provide your email'],
			lowercase: true,
			required: [true, 'Email is required'],
			validate: [
				validator.isEmail,
				'Follow the standard format, similar to "example@domain.com"',
			],
		},

		name: {
			type: String,
			lowercase: true,
			required: [true, 'Name is required'],
		},

		phone: Number,

		allWebCharges: Object,

		allGraphicCharges: Object,

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

budgetContactSchema.index({
	email: 1,
});

budgetContactSchema.pre('save', function (next) {
	if (!this.createdAt) {
		this.createdAt = Date.now();
	}
	next();
});

const Budgetcontact = mongoose.model('Budgetcontact', budgetContactSchema);

module.exports = Budgetcontact;
