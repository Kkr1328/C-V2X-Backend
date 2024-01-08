const amqp = require('amqplib');

let connection = null;
let channel = null;

async function publishToQueue(queueName, data) {
	try {
		if (!process.env['RABBITMQ_HOST']) {
			throw new Error('RABBITMQ_HOST is required');
		}
		if (!connection) {
			connection = await amqp.connect(process.env['RABBITMQ_HOST']);
			console.log('Connection to RabbitMQ established');
		}
		if (!channel) {
			channel = await connection.createChannel();
			console.log('Channel created');
		}
		await channel.assertQueue(queueName, true);
		channel.sendToQueue(queueName, Buffer.from(data));
	} catch (error) {
		throw new Error(`Error publishing to queue: ${error.message}`);
	}
}

module.exports = { publishToQueue };
