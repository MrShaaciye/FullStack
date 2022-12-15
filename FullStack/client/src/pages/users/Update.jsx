import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, FastField } from "formik";
import { Button, Box, TextField } from "@mui/material";
import * as yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Update = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const log = useRef(true);
	const [username, setUsername] = useState("");

	useEffect(() => {
		if (!localStorage.getItem("accessToken")) {
			navigate("/");
		} else {
			if (log.current) {
				log.current = false;
				axios.get(`http://localhost:3000/api/v1/user/${id}`, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((res) => {
					setUsername(res.data.username);
				});
			}
		}
	}, [id, navigate]);

	const initialValues = {
		username: username,
		password: "",
		confirmPassword: "",
	};

	const validationSchema = yup.object().shape({
		username: yup
			.string()
			.min(3)
			.max(15)
			.required()
			.matches(/^[A-z][A-z0-9-_]/, "Username must match mixed/None mixed string and number."),
		password: yup
			.string()
			.min(6)
			.max(20)
			.required()
			.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/, "Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case Character"),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref("password"), ""], "Passwords must match")
			.required(),
	});

	const onSubmit = async (user, onSubmitProps) => {
		await axios.put(`http://localhost:3000/api/v1/user/${id}`, user, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((res) => {
			setTimeout(() => {
				onSubmitProps.resetForm();
				onSubmitProps.setSubmitting(false);
			}, 500);
			navigate(`/`);
		});
	};

	return (
		<div className="create">
			<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
				{(formik) => {
					return (
						<Form className="container">
							<h2 align="center">Change Password</h2>

							<FastField
								type="password"
								required
								name="password"
								as={TextField}
								variant="outlined"
								color="primary"
								label="Password"
								autoComplete="off"
								fullWidth
								error={Boolean(formik.errors.password) && Boolean(formik.touched.password)}
								helperText={Boolean(formik.touched.password) && formik.errors.password}
							/>
							<Box height={14} />

							<FastField
								type="password"
								required
								name="confirmPassword"
								as={TextField}
								variant="outlined"
								color="primary"
								label="Confirm Password"
								autoComplete="off"
								fullWidth
								error={Boolean(formik.errors.confirmPassword) && Boolean(formik.touched.confirmPassword)}
								helperText={Boolean(formik.touched.confirmPassword) && formik.errors.confirmPassword}
							/>
							<Box height={14} />

							<Button type="submit" variant="contained" color="primary" size="large" disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}>
								{formik.isSubmitting ? "Loading" : "Update"}
							</Button>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};

export default Update;
