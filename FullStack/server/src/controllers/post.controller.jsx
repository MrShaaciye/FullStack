const db = require(`../config/db.config.jsx`);
const postModel = db.postModel;
const userModel = db.userModel;
const likeModel = db.likeModel;
const commentModel = db.commentModel;

const sequelize = db.sequelize;
const Op = db.Op;

/* Create new Post */
exports.create = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const post = await postModel.create({ title: req.body.title, text: req.body.text, username: req.user.username, userId: req.user.id, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(post);
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

/* Find All Posts */
exports.findAll = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const title = req.query.title;
		const text = req.query.text;
		const username = req.query.username;
		let finder = title ? { title: { [Op.like]: `%${title}%` } } : text ? { text: { [Op.like]: `%${text}%` } } : username ? { username: { [Op.like]: `%${username}%` } } : null;
		const posts = await postModel.findAndCountAll({
			attributes: [`id`, `title`, `text`, `username`, `userId`, `createdAt`, `updatedAt`, `deletedAt`],
			include: [
				{ model: userModel, as: `users`, attributes: [`id`, `username`, `password`, `createdAt`, `updatedAt`, `deletedAt`] },
				{ model: likeModel, as: `likes`, attributes: [`id`, `postId`, `userId`, `createdAt`, `updatedAt`, `deletedAt`] },
				{ model: commentModel, as: `comments`, attributes: [`id`, `content`, `username`, `postId`, `createdAt`, `updatedAt`, `deletedAt`] },
			],
			transaction: transactions,
			lock: false,
			paranoid: false,
			order: [[`id`, `DESC`]],
			where: finder,
		});
		const liked = await likeModel.findAll({ where: { userId: req.user.id }, transaction: transactions, paranoid: false });
		transactions.commit();
		return res.status(200).json({ posts: posts, liked: liked });
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};

/* Find One Post by userId */
exports.findOneUser = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const id = req.params.id;
		const post = await postModel.findAndCountAll({
			attributes: [`id`, `title`, `text`, `username`, `userId`, `createdAt`, `updatedAt`, `deletedAt`],
			include: [
				{ model: userModel, as: `users`, attributes: [`id`, `username`, `password`, `createdAt`, `updatedAt`, `deletedAt`] },
				{ model: likeModel, as: `likes`, attributes: [`id`, `postId`, `userId`, `createdAt`, `updatedAt`, `deletedAt`] },
				{ model: commentModel, as: `comments`, attributes: [`id`, `content`, `username`, `postId`, `createdAt`, `updatedAt`, `deletedAt`] },
			],
			transaction: transactions,
			lock: false,
			skipLocked: false,
			paranoid: false,
			where: { userId: id },
		});
		await transactions.commit();
		return res.status(200).json(post);
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};

/* Find One Post by id */
exports.findOne = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const id = req.params.id;
		const post = await postModel.findOne({
			attributes: [`id`, `title`, `text`, `username`, `userId`, `createdAt`, `updatedAt`, `deletedAt`],
			include: [
				{ model: userModel, as: `users`, attributes: [`id`, `username`, `password`, `createdAt`, `updatedAt`, `deletedAt`] },
				{ model: likeModel, as: `likes`, attributes: [`id`, `postId`, `userId`, `createdAt`, `updatedAt`, `deletedAt`] },
				{ model: commentModel, as: `comments`, attributes: [`id`, `content`, `username`, `postId`, `createdAt`, `updatedAt`, `deletedAt`] },
			],
			transaction: transactions,
			lock: false,
			skipLocked: false,
			paranoid: false,
			where: { id: id },
		});
		await transactions.commit();
		return res.status(200).json(post);
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};

/* Update One User by id */
exports.update = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const id = req.params.id;
		const post = await postModel.update(req.body, { where: { id: id }, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(post);
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

/* Restore One Post by id */
exports.restore = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const id = req.params.id;
		const post = await postModel.restore({ where: { id: id }, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(post);
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};

/* Delete One Post by id */
exports.delete = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const id = req.params.id;
		const post = await postModel.destroy({ where: { id: id }, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(post);
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};
