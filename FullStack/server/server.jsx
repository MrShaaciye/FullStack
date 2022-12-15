const express = require(`express`);
const cors = require(`cors`);
const logger = require(`./src/middleware/logger.jsx`);
const app = express();

const corsOptions = {
	origin: `http://localhost:3001`,
	optionsSuccessStatus: 200,
};

app
	.use(cors(corsOptions))
	.use(logger)
	.use(express.json())
	.use(express.urlencoded({ extended: false }))
	.get(`/`, (req, res) => res.status(200).send(`Welcome to fullstack tutorial application`));

require(`./src/routes/routers.jsx`)(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
