import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FindAll = () => {
	const navigate = useNavigate();
	const log = useRef(true);
	const [count, setCount] = useState(0);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		if (!localStorage.getItem("accessToken")) {
			navigate("/");
		} else {
			if (log.current) {
				log.current = false;
				axios.get(`http://localhost:3000/api/v1/user`, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((res) => {
					setCount(res.data.count);
					setUsers(res.data.rows);
				});
			}
		}
	}, [navigate]);

	return (
		<div className="FindAll">
			<div className="count">Count: {count}</div>
			{users.map((user) => {
				return (
					<div className="post" key={user.id}>
						<div className="title">
							ID No: {user.id}
							<br></br>
							Username: {user.username}
						</div>
						<div className="body">
							<br></br>
							Password: {user.password}
							<br></br>
							Created at: {user.createdAt}
						</div>
						<div className="footer">
							Updated at: {user.updatedAt}
							<br></br>
							Deleted at: {user.deletedAt}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default FindAll;
