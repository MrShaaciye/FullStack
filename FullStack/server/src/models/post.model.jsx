module.exports = (sequelize, DataTypes) => {
	const Post = sequelize.define(
		`post`,
		{
			id: {
				type: DataTypes.BIGINT(20).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			title: {
				type: DataTypes.STRING(30),
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: `Title is required`,
					},
					len: {
						args: [3, 30],
						msg: `Title must between 3 and 30 characters`,
					},
				},
			},
			text: {
				type: DataTypes.STRING(100),
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: `Text is required`,
					},
					len: {
						args: [5, 100],
						msg: `Text must between 5 and 100 characters`,
					},
				},
			},
			username: {
				type: DataTypes.STRING(15),
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: `Username is required`,
					},
					len: {
						args: [3, 15],
						msg: `Username must between 3 and 15 characters`,
					},
					is: {
						args: /^[A-z][A-z0-9-_]/,
						msg: `Username must match mixed/None mixed string and number`,
					},
				},
			},
			userId: {
				type: DataTypes.BIGINT(20).UNSIGNED,
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: `User ID is required.`,
					},
					isInt: {
						args: true,
						msg: `User ID must be an integer.`,
					},
				},
			},
		},
		{
			timestamps: true,
			paranoid: true,
		}
	);

	return Post;
};
