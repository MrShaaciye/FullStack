import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
// import Navbar from "./pages/navbar/Navbar";
import axios from "axios";
import { AuthContext } from "./helpers/AuthContext";

/* Import post pages */
const CreatePost = lazy(() => import("./pages/posts/Create"));
const FindAllPosts = lazy(() => import("./pages/posts/FindAll"));
const FindByIdPost = lazy(() => import("./pages/posts/FindById"));
const UpdatePost = lazy(() => import("./pages/posts/Update"));

/* Import user pages */
const CreateUser = lazy(() => import("./pages/users/Create"));
const FindAllUsers = lazy(() => import("./pages/users/FindAll"));
const UpdateUser = lazy(() => import("./pages/users/Update"));
const Login = lazy(() => import("./pages/users/Login"));
const Profile = lazy(() => import("./pages/users/Profile"));

/* Import Page not found page */
const PageNotFound = lazy(() => import("./pages/notfound/PageNotFound"));

/* https://www.youtube.com/watch?v=UWYOC8g5N_0&list=PLC3y8-rFHvwjkxt8TOteFdT_YmzwpBlrG&index=1 */

const App = () => {
	const log = useRef(true);
	const [authState, setAuthState] = useState({ username: ``, id: 0, status: false });

	useEffect(() => {
		if (log.current) {
			log.current = false;
			axios.get(`http://localhost:3000/api/v1/auth`, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((res) => {
				if (res.data.err) {
					setAuthState({ ...authState, status: false });
				} else {
					setAuthState({ username: res.data.username, id: res.data.id, status: true });
				}
			});
		}
	}, [authState]);

	const logout = () => {
		localStorage.removeItem(`accessToken`);
		setAuthState({ username: ``, id: 0, status: false });
	};

	const navLinkStyles = ({ isActive }) => {
		return {
			fontWeight: isActive ? "bold" : "normal",
			textDecoration: isActive ? "none" : "underline",
		};
	};

	return (
		<div className="App">
			<AuthContext.Provider value={{ authState, setAuthState }}>
				<Router>
					<div className="navbar">
						{!authState.status ? (
							<>
								<NavLink style={navLinkStyles} to="/">
									Login
								</NavLink>
								<NavLink style={navLinkStyles} to="/user/create">
									Create new account
								</NavLink>
							</>
						) : (
							<>
								<NavLink style={navLinkStyles} to="/user/findAll">
									Find All Users
								</NavLink>
								<NavLink style={navLinkStyles} to="/post/create">
									Create A Post
								</NavLink>
								<NavLink style={navLinkStyles} to="/post/findAll">
									Find All Posts
								</NavLink>
								<NavLink style={navLinkStyles} to="/" onClick={logout}>
									Logout
								</NavLink>
								<h4 className="right">{authState.username.toUpperCase()}</h4>
							</>
						)}
					</div>
					{/* <Navbar /> */}
					<Suspense fallback="Loading... please wait">
						<Routes>
							{/* Post Router */}
							<Route path="/post/findAll" exact element={<FindAllPosts />} />
							<Route path="/post/create" exact element={<CreatePost />} />
							<Route path="/post/findById/:id" exact element={<FindByIdPost />} />
							<Route path="/post/update/:id" exact element={<UpdatePost />} />

							{/* User Router */}
							<Route path="/user/findAll" exact element={<FindAllUsers />} />
							<Route path="/user/create" exact element={<CreateUser />} />
							<Route path="/user/update/:id" exact element={<UpdateUser />} />
							<Route path="/" exact element={<Login />} />
							<Route path="/profile/:id" exact element={<Profile />} />

							<Route path="*" exact element={<PageNotFound />} />
						</Routes>
					</Suspense>
				</Router>
			</AuthContext.Provider>
		</div>
	);
};

export default App;
