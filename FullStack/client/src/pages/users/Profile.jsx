import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";

const Profile = () => {
	const navigate = useNavigate();
	const { authState } = useContext(AuthContext);
	const { id } = useParams();
	const [user, setUser] = useState({});
	const [count, setCount] = useState(0);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		axios.get(`http://localhost:3000/api/v1/user/${id}`, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((res) => {
			setUser(res.data);
		});
		axios.get(`http://localhost:3000/api/v1/post/user/${id}`).then((res) => {
			setCount(res.data.count);
			setPosts(res.data.rows);
		});
	}, [id, count]);

	return (
		<div className="profile">
			<div className="info">
				Username: {user.username}
				<br></br>
				{authState.username === user.username && (
					<span
						onClick={() => {
							navigate(`/user/update/${user.id}`);
						}}
					>
						Edit Profile
					</span>
				)}
			</div>
			<div className="posts">
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
								Username: {post.username}
								<br></br>
								User ID: {post.userId}
								<br></br>
								Created at: {post.createdAt}
							</div>
							<div className="footer">
								Updated at: {post.updatedAt}
								<br></br>
								Deleted at: {post.deletedAt}
								<b>{post.likes.length}</b>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Profile;
