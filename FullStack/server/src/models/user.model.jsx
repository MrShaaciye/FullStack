module.exports = (sequelize, DataTypes) => {
	const bcrypt = require(`bcrypt`);

	const User = sequelize.define(
		`user`,
		{
			id: {
				type: DataTypes.BIGINT(20).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			username: {
				type: DataTypes.STRING(15),
				allowNull: false,
				unique: true,
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
			password: {
				type: DataTypes.STRING(64),
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: `Password is required`,
					},
					len: {
						args: [6, 64],
						msg: `Password must between 6 and 64 characters`,
					},
					is: {
						args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/,
						msg: `Password must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case Character`,
					},
				},
			},
		},
		{
			timestamps: true,
			paranoid: true,
		}
	);

	User.afterValidate(async (user, options) => {
		user.username = await user.username.toLowerCase();
		user.password = await bcrypt.hash(user.password, 8);
	});

	return User;
};
