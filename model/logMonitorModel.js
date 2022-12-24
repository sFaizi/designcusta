const mongoose = require('mongoose');

const logMonitorSchema = new mongoose.Schema(
	{
		logger: String,
		createdAt: Date,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// DOCUMENT MIDDLEWARE
logMonitorSchema.pre('save', function (next) {
	this.createdAt = Date.now();
	next();
});

logMonitorSchema.index({
	logger: 1,
});

const LogMonitor = mongoose.model('LogMonitor', logMonitorSchema);

module.exports = LogMonitor;
