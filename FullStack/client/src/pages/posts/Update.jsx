import React, { useEffect,  useState, useRef } from "react";
import { Formik, Form, FastField } from "formik";
import { Button, Box, TextField } from "@mui/material";
import * as yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Update = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const log = useRef(true);
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");

	useEffect(() => {
		if (!localStorage.getItem("accessToken")) {
			navigate("/");
		} else {
			if (log.current) {
				log.current = false;
				axios.get(`http://localhost:3000/api/v1/post/${id}`, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((res) => {
					setTitle(res.data.title);
					setText(res.data.text);
				});
			}
		}
	}, [id, navigate]);

	const initialValues = {
		title: title,
		text: text,
	};

	const validationSchema = yup.object().shape({
		title: yup.string().min(3).max(30).required(),
		text: yup.string().min(5).max(100).required(),
	});

	const onSubmit = async (post, onSubmitProps) => {
		await axios.put(`http://localhost:3000/api/v1/post/${id}`, post, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((res) => {
			if (res.data.err) {
				alert(`Token Error`, res.data.err);
			} else {
				setTimeout(() => {
					onSubmitProps.resetForm();
					onSubmitProps.setSubmitting(false);
				}, 500);
				navigate(`/post/findById/${id}`);
			}
		});
	};

	return (
		<div className="create">
			<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
				{(formik) => {
					return (
						<Form className="container">
							<h2 align="center">Update Post</h2>

							<FastField
								type="text"
								required
								name="title"
								as={TextField}
								variant="outlined"
								color="primary"
								label="Title"
								autoComplete="off"
								fullWidth
								value={formik.values.title}
								error={Boolean(formik.errors.title) && Boolean(formik.touched.title)}
								helperText={Boolean(formik.touched.title) && formik.errors.title}
							/>
							<Box height={14} />

							<FastField
								type="text"
								required
								name="text"
								as={TextField}
								variant="outlined"
								color="primary"
								label="Text"
								autoComplete="off"
								fullWidth
								value={formik.values.text}
								error={Boolean(formik.errors.text) && Boolean(formik.touched.text)}
								helperText={Boolean(formik.touched.text) && formik.errors.text}
							/>
							<Box height={14} />

							{/* <FastField
								type="text"
								required
								select
								name="username"
								as={TextField}
								variant="outlined"
								color="primary"
								label="Username"
								autoComplete="off"
								fullWidth
								value={formik.values.username}
								error={Boolean(formik.errors.username) && Boolean(formik.touched.username)}
								helperText={Boolean(formik.touched.username) && formik.errors.username}
							>
								{users.map((user) => {
									return (
										<MenuItem key={user.username} value={user.username}>
											{user.username}
										</MenuItem>
									);
								})}
							</FastField>
							<Box height={14} />

							<FastField
								type="text"
								required
								select
								name="userId"
								as={TextField}
								variant="outlined"
								color="primary"
								label="User ID"
								autoComplete="off"
								fullWidth
								value={formik.values.userId}
								error={Boolean(formik.errors.userId) && Boolean(formik.touched.userId)}
								helperText={Boolean(formik.touched.userId) && formik.errors.userId}
							>
								{users.map((user) => {
									return (
										<MenuItem key={user.id} value={user.id}>
											{user.id}
										</MenuItem>
									);
								})}
							</FastField>
							<Box height={14} /> */}

							<Button type="submit" variant="contained" color="primary" size="large" disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}>
								{formik.isSubmitting ? "Loading" : "Update Post"}
							</Button>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};

export default Update;
