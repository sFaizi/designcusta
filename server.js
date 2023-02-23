const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
	console.log(err.name, err.message);
	console.log('uncaught_Exception. Shutting down....');
	process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(DB, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => console.log('DB connection is successful!'));

const app = require('./app');

const port = process.env.PORT || 3030;

const server = app.listen(port, () =>
	console.log(`App running on port ${port}....`)
);

process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message);
	console.log('unhandled_Rejection. Shutting down....');
	server.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
	process.exit(0);
});
