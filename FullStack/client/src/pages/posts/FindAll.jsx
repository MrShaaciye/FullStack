import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

const FindAll = () => {
	const navigate = useNavigate();
	const log = useRef(true);
	const [count, setCount] = useState(0);
	const [posts, setPosts] = useState([]);
	const [likedPosts, setLikedPosts] = useState([]);

	useEffect(() => {
		if (!localStorage.getItem("accessToken")) {
			navigate("/");
		} else {
			if (log.current) {
				log.current = false;
				axios.get(`http://localhost:3000/api/v1/post`, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((res) => {
					setCount(res.data.posts.count);
					setPosts(res.data.posts.rows);
					setLikedPosts(
						res.data.liked.map((like) => {
							return like.postId;
						})
					);
				});
			}
		}
	}, [navigate]);

	const likePost = (postId) => {
		axios.post(`http://localhost:3000/api/v1/like`, { postId: postId }, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((res) => {
			if (res.data.err) {
				alert(res.data.err);
			} else {
				setPosts(
					posts.map((post) => {
						if (post.id === postId) {
							if (res.data.liked) {
								return { ...post, likes: [...post.likes, 0] };
							} else {
								const likesArray = post.likes;
								likesArray.pop();
								return { ...post, likes: likesArray };
							}
						} else {
							return post;
						}
					})
				);

				return likedPosts.includes(postId)
					? setLikedPosts(
							likedPosts.filter((id) => {
								return id !== postId;
							})
					  )
					: setLikedPosts([...likedPosts, postId]);
			}
		});
	};

	return (
		<div className="FindAll">
			<div className="count">Count: {count}</div>
			{posts.map((post) => {
				return (
					<div className="post" key={post.id}>
						<div
							className="title"
							onClick={() => {
								navigate(`/post/findById/${post.id}`);
							}}
						>
							ID No: {post.id}
							<br></br>
							Title: {post.title}
						</div>
						<div className="body">
							Text: {post.text}
							<br></br>
							<span
								onClick={() => {
									navigate(`/profile/${post.userId}`);
								}}
							>
								Username: {post.username}
							</span>
							User ID: {post.userId}
							<br></br>
							Created at: {post.createdAt}
						</div>
						<div className="footer">
							Updated at: {post.updatedAt}
							<br></br>
							Deleted at: {post.deletedAt}
							<ThumbUpAltIcon
								className={likedPosts.includes(post.id) ? "dislikeBtn" : "likeBtn"}
								onClick={() => {
									likePost(post.id);
								}}
							/>
							<b>{post.likes.length}</b>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default FindAll;
