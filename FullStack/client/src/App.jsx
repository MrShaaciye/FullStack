import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import axios from "axios";
import { AuthContext } from "./helpers/AuthContext";

import CreatePost from "./pages/posts/Create";
import FindAllPosts from "./pages/posts/FindAll";
import FindByIdPost from "./pages/posts/FindById";
import UpdatePost from "./pages/posts/Update";

import CreateUser from "./pages/users/Create";
import FindAllUsers from "./pages/users/FindAll";
import UpdateUser from "./pages/users/Update";
import Login from "./pages/users/Login";
import Profile from "./pages/users/Profile";

import PageNotFound from "./pages/notfound/PageNotFound";

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

	return (
		<div className="App">
			<AuthContext.Provider value={{ authState, setAuthState }}>
				<Router>
					<div className="navbar">
						{!authState.status ? (
							<>
								<Link to="/">Login</Link>
								<Link to="/user/create">Create new account</Link>
							</>
						) : (
							<>
								<Link to="/user/findAll">Find All Users</Link>
								<Link to="/post/create">Create A Post</Link>
								<Link to="/post/findAll">Find All Posts</Link>
								<Link to="/" onClick={logout}>
									Logout
								</Link>
								<h4 className="right">{authState.username.toUpperCase()}</h4>
							</>
						)}
					</div>
					<Routes>
						{/* Post Router */}
						<Route path="/post/create" exact element={<CreatePost />} />
						<Route path="/post/findAll" exact element={<FindAllPosts />} />
						<Route path="/post/findById/:id" exact element={<FindByIdPost />} />
						<Route path="/post/update/:id" exact element={<UpdatePost />} />

						{/* User Router */}
						<Route path="/user/create" exact element={<CreateUser />} />
						<Route path="/user/findAll" exact element={<FindAllUsers />} />
						<Route path="/user/update/:id" exact element={<UpdateUser />} />
						<Route path="/" exact element={<Login />} />
						<Route path="/profile/:id" exact element={<Profile />} />

						<Route path="*" exact element={<PageNotFound />} />
					</Routes>
				</Router>
			</AuthContext.Provider>
		</div>
	);
};

export default App;
