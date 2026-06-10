require("dotenv").config();

const express = require("express");
const app = express();

// middlewares
const cookies = require("cookie-parser");
const { limiter } = require("./middlewares/limiter");
const xssSanitize = require("./middlewares/xss");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");
const { default: mongoose } = require("mongoose");

app.use(express.json());
app.use(require("morgan")("dev"));
app.use(cookies());
app.use(limiter);
app.use(xssSanitize);

// apis
app.get("/api/health", (req, res) => res.status(200).json("Server Is Healty"));
app.use("/api/v1/auth", require("./routes/auth.route"));
app.use("/api/v1/me", require("./routes/user.route"));
app.use("/api/v1/admin", require("./routes/admin.route"));

app.use(errorHandler);
app.use(notFound);

// listen
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Is Running in http://localhost:${PORT}`);
        })
    })
    .catch(err => console.log(err));