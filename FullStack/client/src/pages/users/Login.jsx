import { useContext } from "react";
import { AuthContext } from "../../helpers/AuthContext";
import { Button, Box, TextField } from "@mui/material";
import { Formik, Form, FastField } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	const { setAuthState } = useContext(AuthContext);

	const initialValues = {
		username: "",
		password: "",
	};

	const validationSchema = yup.object().shape({
		username: yup.string().min(3).max(15).required(),
		password: yup.string().min(6).max(20).required(),
	});

	const onSubmit = async (user, onSubmitProps) => {
		const data = { username: user.username, password: user.password };
		await axios.post(`http://localhost:3000/api/v1/user/login`, data).then((res) => {
			if (res.data.err) {
				alert(res.data.err);
			} else {
				setTimeout(() => {
					localStorage.setItem("accessToken", res.data.token);
					setAuthState({ username: res.data.username, id: res.data.id, status: true });
					onSubmitProps.resetForm();
					onSubmitProps.setSubmitting(false);
					navigate(`/post/findAll`, { replace: true });
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
							<h2 align="center">Sign In</h2>

							<FastField
								type="text"
								required
								name="username"
								as={TextField}
								variant="outlined"
								color="primary"
								label="Username"
								autoComplete="off"
								fullWidth
								error={Boolean(formik.errors.username) && Boolean(formik.touched.username)}
								helperText={Boolean(formik.touched.username) && formik.errors.username}
							/>
							<Box height={14}></Box>

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

							<Button type="submit" variant="contained" color="primary" size="large" disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}>
								{formik.isSubmitting ? "Loading" : "Login"}
							</Button>

							<span>
								<br />
								{"Do you have an account ? "}
								<a href="/user/create">Sign Up</a> now.
							</span>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};

export default Login;
