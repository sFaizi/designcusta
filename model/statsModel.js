const mongoose = require('mongoose');

const statSchema = new mongoose.Schema(
	{
		visitors: Number,
		seriousVisit: Number,
		createdAt: Date,
		offerSet: {
			type: Boolean,
			default: false,
		},
		offerMsg: String,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// DOCUMENT MIDDLEWARE
statSchema.pre('save', function (next) {
	this.createdAt = Date.now();
	next();
});

const Stat = mongoose.model('Stat', statSchema);

module.exports = Stat;
