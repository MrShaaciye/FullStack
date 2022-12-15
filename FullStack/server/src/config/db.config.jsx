const { Sequelize, QueryTypes, DataTypes, Op, UniqueConstraintError, ValidationErrorItem } = require(`sequelize`);

const sequelize = new Sequelize(`fullstack`, `root`, ``, {
	host: `localhost`,
	dialect: `mysql`,
	logging: true,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
});

/* Database Connection */
sequelize
	.authenticate()
	.then(() => {
		console.log(`Connection has been established successfully...`);
	})
	.catch((err) => {
		console.log(`Unable to connect to the database: ${err}`);
	});

/* Sequelize Initializations */
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.QueryTypes = QueryTypes;
db.DataTypes = DataTypes;
db.Op = Op;
db.ValidationErrorItem = ValidationErrorItem;
db.UniqueConstraintError = UniqueConstraintError;

/* Import Models  */
db.userModel = require(`../models/user.model.jsx`)(sequelize, DataTypes);
db.postModel = require(`../models/post.model.jsx`)(sequelize, DataTypes);
db.commentModel = require(`../models/comment.model.jsx`)(sequelize, DataTypes);
db.likeModel = require(`../models/like.model.jsx`)(sequelize, DataTypes);

/* Association Models One to Many  */
db.userModel.hasMany(db.postModel, { as: `posts`, foreignKey: `userId`, onUpdate: `CASCADE`, onDelete: `CASCADE` });
db.postModel.belongsTo(db.userModel, { as: `users`, foreignKey: `userId`, onUpdate: `CASCADE`, onDelete: `CASCADE` });
db.userModel.hasMany(db.likeModel, { as: `likes`, foreignKey: `userId`, onUpdate: `CASCADE`, onDelete: `CASCADE` });
db.likeModel.belongsTo(db.userModel, { as: `users`, foreignKey: `userId`, onUpdate: `CASCADE`, onDelete: `CASCADE` });

db.postModel.hasMany(db.commentModel, { as: `comments`, foreignKey: `postId`, onUpdate: `CASCADE`, onDelete: `CASCADE` });
db.commentModel.belongsTo(db.postModel, { as: `posts`, foreignKey: `postId`, onUpdate: `CASCADE`, onDelete: `CASCADE` });
db.postModel.hasMany(db.likeModel, { as: `likes`, foreignKey: `postId`, onUpdate: `CASCADE`, onDelete: `CASCADE` });
db.likeModel.belongsTo(db.postModel, { as: `posts`, foreignKey: `postId`, onUpdate: `CASCADE`, onDelete: `CASCADE` });

/* Creating Tables/Models */
db.sequelize.sync({ force: false, alter: false, match: /fullstack$/ }).then(() => {
	console.log(`Tables were synced successfully`);
});

module.exports = db;
