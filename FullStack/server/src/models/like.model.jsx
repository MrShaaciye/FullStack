module.exports = (sequelize, DataTypes) => {
	const Like = sequelize.define(
		`like`,
		{
			id: {
				type: DataTypes.BIGINT(20).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
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

	return Like;
};
