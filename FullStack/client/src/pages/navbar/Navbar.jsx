import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";

const Navbar = () => {
	const log = useRef(true);
	const navigate = useNavigate();
	const [authState, setAuthState] = useState({ username: ``, id: 0, status: false });

	useEffect(() => {
		if (!localStorage.getItem("accessToken")) {
			navigate("/");
		} else {
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
		}
	}, [navigate, authState]);

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
		<nav>
			<AuthContext.Provider value={{ authState, setAuthState }}>
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
			</AuthContext.Provider>
		</nav>
	);
};

export default Navbar;
