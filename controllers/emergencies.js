const mongoose = require('mongoose');
const { consumeQueue } = require('../utils/rabbitMQConnection');
const Emergency = require('../models/Emergency');
const Car = require('../models/Car');
const { emergencyRegex } = require('../utils/regex');

//@desc     Get all Emergencies
//@route    GET /api/emergencies
//@access   Public
exports.getEmergencies = async (req, res, next) => {
	try {
		const emergencies = await Emergency.aggregate([
			{
				$lookup: {
					from: 'cars',
					localField: 'car_id',
					foreignField: '_id',
					as: 'car_info',
				},
			},
			{
				$unwind: '$car_info',
			},
			{
				$lookup: {
					from: 'drivers',
					localField: 'car_info.driver_id',
					foreignField: '_id',
					as: 'driver_info',
				},
			},
			{
				$unwind: {
					path: '$driver_info',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 0,
					id: '$_id',
					status: 1,
					car_id: '$car_info._id',
					car_name: '$car_info.name',
					driver_phone_no: {
						$ifNull: ['$driver_info.phone_no', ''],
					},
					time: {
						$concat: [
							{
								$dateToString: {
									date: '$createdAt',
									format: '%H:%M',
								},
							},
							' ',
							{
								$cond: {
									if: { $gte: [{ $hour: '$createdAt' }, 12] },
									then: 'pm',
									else: 'am',
								},
							},
						],
					},
				},
			},
		]).sort({ car_name: 1 });

		return res
			.status(200)
			.json({ success: true, count: emergencies.length, data: emergencies });
	} catch (err) {
		return res.status(400).json({ success: false, error: err.message });
	}
};

//@desc     Create new emergency
//@route    POST /api/emergencies
//@access   Private
exports.createEmergency = async (req, res, next) => {
	try {
		const { car_id, status, latitude, longitude } = req.body;

		if (!car_id) {
			return res
				.status(400)
				.json({ success: false, error: 'Please add a car_id' });
		}

		const carExists = await Car.exists({
			_id: new mongoose.Types.ObjectId(car_id),
		});

		if (!carExists) {
			return res
				.status(404)
				.json({ success: false, error: 'The car not found' });
		}

		if (status && !emergencyRegex.test(status)) {
			return res.status(400).json({
				success: false,
				error: 'Status should be pending, inProgress or complete',
			});
		}

		if (!latitude) {
			return res.status(400).json({
				success: false,
				error: 'Please add a latitude',
			});
		}

		if (typeof latitude !== 'number') {
			return res.status(400).json({
				success: false,
				error: 'Latitude should be number',
			});
		}

		if (!longitude) {
			return res.status(400).json({
				success: false,
				error: 'Please add a longitude',
			});
		}

		if (longitude && typeof longitude !== 'number') {
			return res.status(400).json({
				success: false,
				error: 'Longitude should be number',
			});
		}

		const emergency = await Emergency.create(req.body);
		const data = {
			id: emergency._id,
			car_id: emergency.car_id,
			status: emergency.status,
			latitude: emergency.latitude,
			longitude: emergency.longitude,
		};
		console.log('hi');
		req.socket.emit('emergency', data);
		return res.status(201).json({
			success: true,
			data: data,
		});
	} catch (err) {
		return res.status(400).json({ success: false, error: err.message });
	}
};

exports.createEmergencyFromRabbitMQ = (socket) => {
	consumeQueue(
		{ queueName: 'emergency', durable: true, noAck: false },
		async (msg) => {
			try {
				const { car_id, status, latitude, longitude } = JSON.parse(
					msg.content.toString()
				);
				if (!car_id) {
					throw new Error('Please add a car_id');
				}

				const carExists = await Car.exists({
					_id: new mongoose.Types.ObjectId(car_id),
				});

				if (!carExists) {
					throw new Error('The car not found');
				}

				if (status && !emergencyRegex.test(status)) {
					throw new Error('Status should be pending, inProgress or complete');
				}

				if (latitude && typeof latitude !== 'number') {
					throw new Error('Latitude should be number');
				}

				if (longitude && typeof longitude !== 'number') {
					throw new Error('Longitude should be number');
				}

				const emergency = await Emergency.create({
					car_id,
					status,
					latitude,
					longitude,
				});
				const data = {
					id: emergency._id,
					car_id: emergency.car_id,
					status: emergency.status,
					latitude: emergency.latitude,
					longitude: emergency.longitude,
				};
				socket.emit('emergency', data);
			} catch (err) {
				console.log('create Emergency from RabbitMQ: ', err);
			}
		}
	);
};

//@desc     Update emergency
//@route    PUT /api/emergencies/:id
//@access   Public
exports.updateEmergency = async (req, res, next) => {
	try {
		const { car_id, status, latitude, longitude } = req.body;

		if (car_id) {
			const carExists = await Car.exists({
				_id: new mongoose.Types.ObjectId(car_id),
			});

			if (!carExists) {
				return res
					.status(404)
					.json({ success: false, error: 'The car not found' });
			}
		}

		if (status && !emergencyRegex.test(status)) {
			return res.status(400).json({
				success: false,
				error: 'Status should be pending, inProgress or complete',
			});
		}

		if (latitude && typeof latitude !== 'number') {
			return res.status(400).json({
				success: false,
				error: 'Latitude should be number',
			});
		}

		if (longitude && typeof longitude !== 'number') {
			return res.status(400).json({
				success: false,
				error: 'Longitude should be number',
			});
		}

		const emergency = await Emergency.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!emergency) {
			return res
				.status(404)
				.json({ success: false, error: 'The emergency not found' });
		}
		const data = {
			id: emergency._id,
			car_id: emergency.car_id,
			status: emergency.status,
			latitude: emergency.latitude,
			longitude: emergency.longitude,
		};
		req.socket.emit('emergency', data);
		return res.status(200).json({
			success: true,
			data: data,
		});
	} catch (err) {
		return res.status(400).json({ success: false, error: err.message });
	}
};
