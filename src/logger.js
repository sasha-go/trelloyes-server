const winston = require('winston');
const { NODE_ENV } = require('./config');


// LOGGER
// QUESTION - confused on using both winston and morgan - can you choose to use one of them instead?
// Logging in the real world 

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	transports: [
		new winston.transports.File({ filename: 'info.log'})
	]
})
if (NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
		format: winston.format.simple()
	}))
}

module.exports = logger;