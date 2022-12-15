module.exports = (sequelize, DataTypes) => {
	const Comment = sequelize.define(
		`comment`,
		{
			id: {
				type: DataTypes.BIGINT(20).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			content: {
				type: DataTypes.STRING(100),
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: `Text body is required`,
					},
					len: {
						args: [5, 100],
						msg: `Text body must between 5 and 100 characters`,
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
			postId: {
				type: DataTypes.BIGINT(20).UNSIGNED,
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: `Post ID is required.`,
					},
					isInt: {
						args: true,
						msg: `Post ID must be an integer.`,
					},
				},
			},
		},
		{
			timestamps: true,
			paranoid: true,
		}
	);

	return Comment;
};
