module.exports = (app) => {
	/* Import Router from Express & middleware */
	const router = require(`express`).Router();
	const token = require(`../middleware/auth.jsx`);

	/* Import Controllers */
	const userCtrl = require(`../controllers/user.controller.jsx`);
	const postCtrl = require(`../controllers/post.controller.jsx`);
	const commentCtrl = require(`../controllers/comment.controller.jsx`);
	const likeCtrl = require(`../controllers/like.controller.jsx`);

	/* Auth Router */
	router.route(`/auth`).get(token, userCtrl.auth);

	/* User Routers */
	router.route(`/user`).get(token, userCtrl.findAll).post(userCtrl.create);
	router.route(`/user/:id`).get(token, userCtrl.findOne).put(token, userCtrl.update).delete(userCtrl.delete);
	router.route(`/user/restore/:id`).get(userCtrl.restore);
	router.route(`/user/login`).post(userCtrl.login);

	/* Post Routers */
	router.route(`/post`).get(token, postCtrl.findAll).post(token, postCtrl.create);
	router.route(`/post/user/:id`).get(postCtrl.findOneUser);
	router.route(`/post/:id`).get(token, postCtrl.findOne).put(token, postCtrl.update).delete(token, postCtrl.delete);
	router.route(`/post/restore/:id`).get(token, postCtrl.restore);

	/* Comment Routers */
	router.route(`/comment`).get(commentCtrl.findAll).post(token, commentCtrl.create);
	router.route(`/comment/:postId`).get(commentCtrl.findOne);
	router.route(`/comment/:id`).put(commentCtrl.update).delete(token, commentCtrl.delete);
	router.route(`/comment/restore/:id`).get(commentCtrl.restore);

	/* Like Routers */
	router.route(`/like`).get(likeCtrl.findAll).post(token, likeCtrl.create);
	router.route(`/like/:postId`).get(likeCtrl.findOne);
	router.route(`/like/:id`).put(likeCtrl.update).delete(likeCtrl.delete);
	router.route(`/like/restore/:id`).get(likeCtrl.restore);

	app.use(`/api/v1`, router);
};
