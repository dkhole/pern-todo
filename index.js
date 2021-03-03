const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;

//process.env.NODE_ENV env variable provided by heroku to determine if app is currently in production

app.use(cors());
app.use(express.json());

app.use(express.static("client/build"));

if(process.env.NODE_ENV === "production") {
    //serve static content
    app.use(express.static("client/build"));
}

//register and login routes
app.use("/auth", require("./routes/handleUser.js"));

//todo routes
app.use("/todos", require("./routes/todos.js"));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

