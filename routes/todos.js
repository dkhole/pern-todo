const pool = require("../db");
const router = require("express").Router();
const authorize = require("../middleware/authorize");

//get all todos for user
router.get("/", authorize, async(req, res) => {
    try {
        const userId = req.user.id;
        const cards = await pool.query("SELECT u.user_name, c.card_name, c.card_id FROM users AS u LEFT JOIN cards AS c ON u.user_id = c.user_id WHERE u.user_id = $1",
            [userId]
        );
        const todos = await pool.query("SELECT t.todo_id, t.card_id, t.todo_title, t.todo_priority, t.todo_due, u.user_id FROM users AS u LEFT JOIN todos AS t ON u.user_id = t.user_id WHERE u.user_id = $1",
        [userId]
        );
        res.json([cards.rows, todos.rows]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Get cards error");
    }
})

//get a card

//get all todos for card

//get a todo

//create card
router.post("/card", authorize, async(req, res) => {
    try {
        const { cardName } = req.body;
        const userId = req.user.id;

        const newCard = await pool.query(
            "INSERT INTO cards (card_name, user_id) VALUES ($1, $2) RETURNING card_id, card_name",
            [cardName, userId]
        );

        res.json(newCard.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Get cards error");
    }
});

//create todo
router.post("/todo", authorize, async(req, res) => {
    try {
        const { todoName, cardId } = req.body;
        const userId = req.user.id;

        const newTodo = await pool.query(
            "INSERT INTO todos (todo_title, user_id, card_id) VALUES ($1, $2, $3) RETURNING *",
            [todoName, userId, cardId]
        );

        res.json(newTodo);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Get cards error");
    }
});

//update todo
router.put("/todo/:id", authorize, async(req, res) => {
    try {
        const { title, priority, dueDate, cardId } = req.body;
        const userId = req.user.id;
        const { id } = req.params;

        const todo = await pool.query(
            "UPDATE todos SET todo_title = $1, todo_priority = $2, todo_due = $3 WHERE user_id = $4 AND card_id = $5 AND todo_id = $6 RETURNING *",
            [title, priority, dueDate, userId, cardId, id]
        );
        
        res.json(todo);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Get cards error");
    }
});

//rename card
router.put("/card/:id", authorize, async(req, res) => {
    try {
        const { cardName } = req.body;
        const userId = req.user.id;
        const { id } = req.params;

    console.log(id);

        const card = await pool.query(
            "UPDATE cards SET card_name = $1 WHERE user_id = $2 AND card_id = $3 RETURNING *",
            [cardName, userId, id]
        );

        
        res.json(card);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Get cards error");
    }
});

//delete todo
router.delete("/todo", authorize, async(req, res) => {
    try {
        const { cardId, todoId } = req.body;
        const userId = req.user.id;

        const deleteTodo = await pool.query(
            "DELETE FROM todos WHERE user_id = $1 AND card_id = $2 AND todo_id = $3",
            [userId, cardId, todoId]
        );

        res.json(deleteTodo);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Get cards error");
    }
});

//delete card
router.delete("/card", authorize, async(req, res) => {
    try {
        const { cardId } = req.body;
        const userId = req.user.id;

        const deleteTodo = await pool.query(
            "DELETE FROM todos WHERE user_id = $1 AND card_id = $2",
            [userId, cardId]
        );

        const deleteCard = await pool.query(
            "DELETE FROM cards WHERE user_id = $1 AND card_id = $2",
            [userId, cardId]
        );

        res.json({deleteCard});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Get cards error");
    }
});

module.exports = router;