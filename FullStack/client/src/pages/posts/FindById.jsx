import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../helpers/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Box, TextField } from "@mui/material";
import { Formik, Form, FastField } from "formik";
import axios from "axios";
import * as yup from "yup";

const FindById = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { authState } = useContext(AuthContext);
	const log = useRef(true);
	const [post, setPost] = useState({});
	const [comments, setComments] = useState([]);

	useEffect(() => {
		if (!localStorage.getItem("accessToken")) {
			navigate("/");
		} else {
			if (log.current) {
				log.current = false;
				axios.get(`http://localhost:3000/api/v1/post/${id}`, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((res) => {
					setPost(res.data);
				});

				axios.get(`http://localhost:3000/api/v1/comment/${id}`).then((res) => {
					setComments(res.data);
				});
			}
		}
	}, [id, navigate]);

	const initialValues = {
		content: "",
	};

	const validationSchema = yup.object().shape({
		content: yup.string().min(5).max(100).required(),
	});

	const onSubmit = async (comment, onSubmitProps) => {
		await axios.post(`http://localhost:3000/api/v1/comment`, { ...comment, ...{ postId: id } }, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((res) => {
			if (res.data.err) {
				alert(`Token Error`, res.data.err);
			} else {
				comment.username = res.data.username;
				setTimeout(() => {
					setComments([...comments, comment]);
					onSubmitProps.resetForm();
					onSubmitProps.setSubmitting(false);
				}, 500);
			}
		});
	};

	const deletePost = (id) => {
		axios.delete(`http://localhost:3000/api/v1/post/${id}`, { headers: { accessToken: localStorage.getItem("accessToken") } }).then(() => {
			navigate(`/post/findAll`);
		});
	};

	const restorePost = (id) => {
		axios.get(`http://localhost:3000/api/v1/post/restore/${id}`, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((res) => {
			navigate(`/post/findAll`);
		});
	};

	const deleteComment = (id) => {
		axios.delete(`http://localhost:3000/api/v1/comment/${id}`, { headers: { accessToken: localStorage.getItem("accessToken") } }).then(() => {
			setComments(
				comments.filter((comment) => {
					return comment.id !== id;
				})
			);
		});
	};

	return (
		<div className="postPage">
			<div className="left">
				<div className="post" id="individual">
					<div
						className="title"
						onClick={() => {
							if (authState.username === post.username) {
								navigate(`/post/update/${post.id}`);
							}
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
						<div className="postDel">
							{authState.username === post.username && !post.deletedAt && (
								<span
									onClick={() => {
										deletePost(post.id);
									}}
								>
									Delete
								</span>
							)}
							{authState.username === post.username && post.deletedAt && (
								<span
									className="postDel"
									onClick={() => {
										restorePost(post.id);
									}}
								>
									Restore
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="right">
				<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
					{(formik) => {
						return (
							<Form className="container">
								<FastField
									type="text"
									required
									name="content"
									as={TextField}
									variant="outlined"
									color="primary"
									label="Content"
									autoComplete="off"
									fullWidth
									error={Boolean(formik.errors.content) && Boolean(formik.touched.content)}
									helperText={Boolean(formik.touched.content) && formik.errors.content}
								/>
								<Box height={14} />

								<Button type="submit" variant="contained" color="primary" size="large" disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}>
									{formik.isSubmitting ? "Loading" : "Add Comment"}
								</Button>
							</Form>
						);
					}}
				</Formik>

				<div className="comment-list">
					{comments.map((comment) => {
						return (
							<div className="comment" key={comment.id}>
								{comment.content} <br />
								Username: {comment.username} <br />
								{authState.username === comment.username && (
									<span
										className="commentDel"
										onClick={() => {
											deleteComment(comment.id);
										}}
									>
										Delete
									</span>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default FindById;
