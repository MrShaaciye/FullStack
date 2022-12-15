const db = require(`../config/db.config.jsx`);
const commentModel = db.commentModel;
const postModel = db.postModel;

const sequelize = db.sequelize;
const Op = db.Op;

/* Create new Comment */
exports.create = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const comment = await commentModel.create({ content: req.body.content, username: req.user.username, postId: req.body.postId, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(comment);
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

/* Find All Comments */
exports.findAll = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const content = req.query.content;
		const postId = req.query.postId;
		let finder = content ? { content: { [Op.like]: `%${content}%` } } : postId ? { postId: { [Op.like]: `%${postId}%` } } : null;
		const comments = await commentModel.findAndCountAll({
			attributes: [`id`, `content`, `username`, `postId`, `createdAt`, `updatedAt`, `deletedAt`],
			include: [{ model: postModel, as: `posts`, attributes: [`id`, `title`, `text`, "username", `createdAt`, `updatedAt`, `deletedAt`] }],
			transaction: transactions,
			lock: false,
			paranoid: true,
			order: [[`id`, `DESC`]],
			where: finder,
		});
		await transactions.commit();
		return res.status(200).json(comments);
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};

/* Find One Comment by id */
exports.findOne = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const postId = req.params.postId;
		const comment = await commentModel.findAll({
			attributes: [`id`, `content`, `username`, `postId`, `createdAt`, `updatedAt`, `deletedAt`],
			include: [
				{ model: postModel, as: `posts`, attributes: [`id`, `title`, `text`, "username", `createdAt`, `updatedAt`, `deletedAt`] }
			],
			transaction: transactions,
			lock: false,
			paranoid: true,
			where: { postId: postId },
		});
		await transactions.commit();
		return res.status(200).json(comment);
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
		const comment = await commentModel.update(req.body, { where: { id: id }, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(comment);
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
		const comment = await commentModel.restore({ where: { id: id }, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(comment);
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
		const comment = await commentModel.destroy({ where: { id: id }, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(comment);
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};
