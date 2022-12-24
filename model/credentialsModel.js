const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const credentialsSchema = new mongoose.Schema(
	{
		userID: {
			type: String,
			unique: [true, 'Please provide your ID'],
			lowercase: true,
			required: [true, 'Email is required'],
		},

		password: {
			type: String,
			minLength: [8, 'Atleast 8 characters should be provided'],
			maxLength: [20, 'Not more than 20 characters should be provided'],
			required: [true, 'Password is required'],
			match: [
				/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#%^=()])(?!.*\s).{8,20}$/,
				'Invalid password format',
			],
			select: false,
		},

		confirmPassword: {
			type: String,
			minLength: [8, 'Atleast 8 characters should be provided'],
			maxLength: [20, 'Not more than 20 characters should be provided'],
			required: [true, 'Confirm Password is required'],
			match: [
				/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#%^=()])(?!.*\s).{8,20}$/,
				'Invalid password format',
			],
			validate: {
				validator: function (el) {
					return el === this.password;
				},
				message: 'Passwords are not same',
			},
		},

		role: {
			type: String,
			enum: {
				values: ['custer', 'custataj'],
				message: 'something went wrong',
			},
			required: [true, 'something went wrong'],
		},

		passwordChangedAt: Date,
		createdAt: Date,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

credentialsSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 14);
	this.confirmPassword = undefined;
	next();
});

credentialsSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

credentialsSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

credentialsSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimeStamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		return JWTTimestamp < changedTimeStamp;
	}

	return false;
};

credentialsSchema.index({
	userID: 1,
});

credentialsSchema.pre('save', function (next) {
	this.createdAt = Date.now();
	next();
});

const Credentials = mongoose.model('Credentials', credentialsSchema);

module.exports = Credentials;
