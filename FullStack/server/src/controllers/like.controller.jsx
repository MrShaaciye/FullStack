const db = require(`../config/db.config.jsx`);
const likeModel = db.likeModel;
const userModel = db.userModel;
const postModel = db.postModel;

const sequelize = db.sequelize;
const Op = db.Op;

/* Create new Like */
exports.create = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const [liked, created] = await likeModel.findOrCreate({ where: { postId: req.body.postId, userId: req.user.id }, transaction: transactions, paranoid: false });
		return created
			? (await transactions.commit(), res.status(200).json({ liked: true }))
			: !liked.deletedAt
			? await likeModel.destroy({ where: { postId: req.body.postId, userId: req.user.id }, transaction: transactions }).then((deleted) => {
					return deleted ? (transactions.commit(), res.status(200).json({ liked: false })) : err;
			  })
			: liked.deletedAt
			? await likeModel.restore({ where: { postId: req.body.postId, userId: req.user.id }, transaction: transactions }).then((restored) => {
					return restored ? (transactions.commit(), res.status(200).json({ liked: true })) : err;
			  })
			: err;
	} catch (err) {
		await transactions.rollback();
		const messages = {};
		let message;
		err.errors.forEach((error) => {
			messages[error.path] = error.message;
			message = messages[error.path];
		});
		res.status(500).json(message);
	}
};

/* Find All Likes */
exports.findAll = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const postId = req.query.postId;
		const userId = req.query.userId;
		let finder = postId ? { postId: { [Op.like]: `%${postId}%` } } : userId ? { userId: { [Op.like]: `%${userId}%` } } : null;
		const likes = await likeModel.findAndCountAll({
			attributes: [`id`, `postId`, `userId`, `createdAt`, `updatedAt`, `deletedAt`],
			include: [
				{ model: userModel, as: `users`, attributes: [`id`, `username`, `password`, `createdAt`, `updatedAt`, `deletedAt`] },
				{ model: postModel, as: `posts`, attributes: [`id`, `title`, `text`, `username`, `userId`, `createdAt`, `updatedAt`, `deletedAt`] },
			],
			transaction: transactions,
			lock: false,
			paranoid: false,
			order: [[`id`, `DESC`]],
			where: finder,
		});
		await transactions.commit();
		return res.status(200).json(likes);
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};

/* Find One Like by id */
exports.findOne = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const postId = req.params.postId;
		const like = await likeModel.findOne({
			attributes: [`id`, `postId`, `userId`, `createdAt`, `updatedAt`, `deletedAt`],
			include: [
				{ model: userModel, as: `users`, attributes: [`id`, `username`, `password`, `createdAt`, `updatedAt`, `deletedAt`] },
				{ model: postModel, as: `posts`, attributes: [`id`, `title`, `text`, `username`, `userId`, `createdAt`, `updatedAt`, `deletedAt`] },
			],
			transaction: transactions,
			lock: false,
			paranoid: false,
			where: { postId: postId },
		});
		await transactions.commit();
		return res.status(200).json(like);
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};

/* Update One Like by id */
exports.update = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const id = req.params.id;
		const like = await likeModel.update(req.body, { where: { id: id }, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(like);
	} catch (err) {
		await transactions.rollback();
		const messages = {};
		let message;
		err.errors.forEach((error) => {
			messages[error.path] = error.message;
			message = messages[error.path];
		});
		return res.status(500).json(message);
	}
};

/* Restore One Like by id */
exports.restore = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const id = req.params.id;
		const like = await likeModel.restore({ where: { id: id }, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(like);
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};

/* Delete One Like by id */
exports.delete = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const id = req.params.id;
		const like = await likeModel.destroy({ where: { id: id }, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(like);
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};
