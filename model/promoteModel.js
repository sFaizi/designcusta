const mongoose = require('mongoose');
const validator = require('validator');

const promoteSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			lowercase: true,
			validate: [
				validator.isEmail,
				'Follow the standard format, similar to "example@domain.com"',
			],
		},

		name: {
			type: String,
			lowercase: true,
		},

		phone: Number,

		createdAt: Date,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

promoteSchema.index({
	email: 1,
});

promoteSchema.pre('save', function (next) {
	this.createdAt = Date.now();
	next();
});

const Promote = mongoose.model('Promote', promoteSchema);

module.exports = Promote;
