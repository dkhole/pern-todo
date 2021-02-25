const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

//register and login routes
app.use("/auth", require("./routes/handleUser.js"));

//todo routes
app.use("/todos", require("./routes/todos.js"));

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})

