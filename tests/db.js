const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// initialize
const mongod = new MongoMemoryServer();

// connect
module.exports.connect = async () => {
	const uri = await mongod.getUri();
	const mongooseOpts = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		poolSize: 10,
	};
	await mongoose.connect(uri, mongooseOpts);
	console.log("Connected to database...");
};

// disconnect
module.exports.closeDatabase = async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	console.log("Dropped database and closed...");
	await mongod.stop();
};

// clear
module.exports.clearDatabase = async () => {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		const collections = collections(key);
		await collections.deleteMany();
	}
	console.log("Cleared database...");
};
