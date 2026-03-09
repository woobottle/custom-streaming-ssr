import { Link } from "react-router-dom";

// home page
const HomePage = () => {
	return (
		<div>
			<h1>hihi</h1>
			<Link to="/posts" style={{ marginRight: "10px" }}>
				Posts
			</Link>
			<Link to="/users" style={{ marginRight: "10px" }}>
				Users
			</Link>
			<Link to="/posts/1" style={{ marginRight: "10px" }}>
				Post 1
			</Link>
		</div>
	);
};

export default HomePage;
