const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorize = require("../middleware/authorize");

router.post("/register", validInfo, async(req, res) => {
    try {
        const { name, email, password } = req.body;

        //check if user exists
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
    
        if(user.rows.length !== 0) {
            return res.status(401).send("User with that email already exists");
        }

        console.log(user);
    
        //bcrypt password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);
    
        const newUser = await pool.query(
            "INSERT INTO users(user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword]
        );
    
        //generate jwt and res to client
        const token = jwtGenerator(newUser.rows[0].user_id);
        res.json({token});
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

router.post("/login", validInfo, async(req, res) => {

    try {
        const { email, password } = req.body;

        const user = await pool.query(
            "SELECT * FROM users WHERE user_email = $1", 
            [email]
        );

        //check if user exists
        if(user.rows.length === 0) {
            return res.status(401).send("User with that email does not exist");
        }
        
        //compare password with one in database
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
        
        if(!validPassword) {
            return res.status(401).send("Password is incorrect");
        }

        //send jwt
        const token = jwtGenerator(user.rows[0].user_id);
        
        res.json({token});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server register error");
    }
})

router.get("/is-verify", authorize, async(req,res) => {
    try {
        res.json(true);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;