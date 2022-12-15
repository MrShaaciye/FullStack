const db = require(`../config/db.config.jsx`);
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const userModel = db.userModel;
const postModel = db.postModel;
const likeModel = db.likeModel;

const sequelize = db.sequelize;
const Op = db.Op;

/* Create new User */
exports.create = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const trim = (noSpace) => {
			return noSpace.replace(/\s/g, ``);
		};
		const [user, created] = await userModel.findOrCreate({ where: { username: trim(req.body.username) }, defaults: { password: trim(req.body.password) }, transaction: transactions });
		return created ? (await transactions.commit(), res.status(200).json(user)) : user ? (await transactions.rollback(), res.json(`username must be unique.`)) : err;
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

/* Login User */
exports.login = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const trim = (noSpace) => {
			return noSpace.replace(/\s/g, ``);
		};

		const { username, password } = req.body;
		const user = await userModel.findOne({ where: { username: trim(username) }, transaction: transactions });
		if (!user) {
			await transactions.rollback();
			return res.status(200).json({ err: `Sorry! username ${username} doesn't exist` });
		}
		const match = await bcrypt.compare(trim(password), user.password);
		if (!match) {
			await transactions.rollback();
			return res.status(200).json({ err: `Sorry! your password is incorrect` });
		} else {
			await transactions.commit();
			const accessToken = jwt.sign({ username: user.username, id: user.id }, `secret` /* , { expiresIn: 60 * 60 } */);
			return res.status(200).json({ token: accessToken, username: user.username, id: user.id });
		}
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

/* Auth User */
exports.auth = async (req, res) => {
	return await res.json(req.user);
};

/* Find All Users */
exports.findAll = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const username = req.query.username;
		const password = req.query.password;
		let finder = username ? { username: { [Op.like]: `%${username}%` } } : password ? { password: { [Op.like]: `%${password}%` } } : null;
		const users = await userModel.findAndCountAll({
			attributes: [`id`, `username`, `password`, `createdAt`, `updatedAt`, `deletedAt`],
			// include: [
			// 	{ model: postModel, as: `posts`, attributes: [`id`, `title`, `text`, "username", "userId", `createdAt`, `updatedAt`, `deletedAt`] },
			// 	{ model: likeModel, as: `likes`, attributes: [`id`, `postId`, `userId`, `createdAt`, `updatedAt`, `deletedAt`] },
			// ],
			transaction: transactions,
			lock: false,
			paranoid: false,
			order: [[`id`, `DESC`]],
			where: finder,
		});
		await transactions.commit();
		return res.status(200).json(users);
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};

/* Find One User by id */
exports.findOne = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const id = req.params.id;
		const user = await userModel.findOne({
			attributes: [`id`, `username`, `password`, `createdAt`, `updatedAt`, `deletedAt`],
			include: [
				{ model: likeModel, as: `likes`, attributes: [`id`, `postId`, `userId`, `createdAt`, `updatedAt`, `deletedAt`] },
				{ model: postModel, as: `posts`, attributes: [`id`, `title`, `text`, "username", "userId", `createdAt`, `updatedAt`, `deletedAt`] },
			],
			transaction: transactions,
			lock: false,
			paranoid: false,
			where: { id: id },
		});
		await transactions.commit();
		return res.status(200).json(user);
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
		const user = await userModel.update(req.body, { where: { id: id }, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(user);
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

/* Restore One User by id */
exports.restore = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const id = req.params.id;
		const user = await userModel.restore({ where: { id: id }, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(user);
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};

/* Delete One User by id */
exports.delete = async (req, res) => {
	const transactions = await sequelize.transaction();
	try {
		const id = req.params.id;
		const user = await userModel.destroy({ where: { id: id }, transaction: transactions });
		await transactions.commit();
		return res.status(200).json(user);
	} catch (err) {
		await transactions.rollback();
		return res.status(500).json(err);
	}
};
