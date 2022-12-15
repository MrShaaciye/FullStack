import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, FastField } from "formik";
import { Button, Box, TextField } from "@mui/material";
import axios from "axios";
import * as yup from "yup";

const Create = () => {
	const navigate = useNavigate();

	const initialValues = {
		title: "",
		text: "",
	};

	const validationSchema = yup.object().shape({
		title: yup.string().min(3).max(30).required(),
		text: yup.string().min(5).max(100).required(),
	});

	const onSubmit = async (post, onSubmitProps) => {
		await axios.post(`http://localhost:3000/api/v1/post`, post, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((res) => {
			if (res.data.err) {
				alert(`Token Error`, res.data.err);
			} else {
				setTimeout(() => {
					onSubmitProps.resetForm();
					onSubmitProps.setSubmitting(false);
					navigate(`/post/findAll`);
				}, 500);
			}
		});
	};

	return (
		<div className="create">
			<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
				{(formik) => {
					return (
						<Form className="container">
							<h2 align="center" title="Please create post and enjoy it well">
								Create Post
							</h2>

							<FastField type="text" required name="title" as={TextField} variant="outlined" color="primary" label="Title" autoComplete="off" fullWidth error={Boolean(formik.errors.title) && Boolean(formik.touched.title)} helperText={Boolean(formik.touched.title) && formik.errors.title} />
							<Box height={14} />

							<FastField type="text" required name="text" as={TextField} variant="outlined" color="primary" label="Text" autoComplete="off" fullWidth error={Boolean(formik.errors.text) && Boolean(formik.touched.text)} helperText={Boolean(formik.touched.text) && formik.errors.text} />
							<Box height={14} />

							{/* <FastField
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
								error={Boolean(formik.errors.userId) && Boolean(formik.touched.userId)}
								helperText={Boolean(formik.touched.userId) && formik.errors.userId}
							>
								<MenuItem key={""} value={""}>
									Select User...
								</MenuItem>
								{users.map((user) => {
									return (
										<MenuItem key={user.id} value={user.id}>
											{user.username}
										</MenuItem>
									);
								})}
							</FastField>
							<Box height={14} /> */}

							<Button type="submit" variant="contained" color="primary" size="large" disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}>
								{formik.isSubmitting ? "Loading" : "Create Post"}
							</Button>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};

export default Create;
