import React, { useEffect, useState, Fragment } from 'react';
import CardList from './CardList';
import EditTodo from './EditTodo';
import '../styles/todo.css';
import { ReactComponent as Delete } from '../imgs/delete.svg';
import { ReactComponent as Back } from '../imgs/back.svg';

const Todos = ({ setAuth }) => {
    const [cardName, setCardName] = useState('');
    const [todoName, setTodoName] = useState('');
    const [mainCard, setMainCard] = useState({});
    const [viewTodos, setViewTodos] = useState(false);
    const [username, setUsername] = useState('');
    const [allCards, setAllCards] = useState([]);

    const fetchData = async() => {
        try {
            const res = await fetch("/todos", {
                method: "GET",
                headers: { token: localStorage.token}
            });

            const [cards, todos] = await res.json();
            
            const listCards = cards.filter(c => c.card_id !== null);

            if(listCards.length > 0) {
                setMainCard(listCards[0]);
                
                for(let i = 0; i < listCards.length; i++) {
                    listCards[i].todos = todos.filter(t => t.card_id === listCards[i].card_id && t.todo_title !== null);
                }
                setAllCards(listCards);
            }

            setUsername(cards[0].user_name);
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(()=> {
        fetchData();
    }, []);

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem('token');
        setAuth(false);
    }

    const createCard = async(e) => {
        e.preventDefault();

        if(cardName === '') {
            return;
        }
        
        const jsonHead = new Headers();
        jsonHead.append('Content-type', 'application/json');
        jsonHead.append('token', localStorage.token);

        const body = {cardName};

        try {
            const res = await fetch("/todos/card", {
                method: "POST",
                headers: jsonHead,
                body: JSON.stringify(body)
            });

            let parseRes = await res.json();
            parseRes[0].todos = [];

            setAllCards([...allCards, parseRes[0]]);
            setCardName('');
        } catch (error) {
            console.error(error.message);
        }
    }

    const deleteCard = async(e) => {
        e.stopPropagation();
        e.preventDefault();

        const jsonHead = new Headers();
        jsonHead.append('Content-type', 'application/json');
        jsonHead.append('token', localStorage.token);
        const cardId = e.currentTarget.parentElement.parentElement.id;
        const body = {cardId};

        try {
            // eslint-disable-next-line
            const res = await fetch("/todos/card", {
                method: "DELETE",
                headers: jsonHead,
                body: JSON.stringify(body)
            });

            await res.json();
            const deleteCard = allCards.filter( c => c.card_id !== parseInt(cardId));
            setAllCards(deleteCard);

        } catch (error) {
            console.error(error.message);
        }
    }

    const createTodo = async(e) => {
        e.preventDefault();

        if(todoName === '') {
            return;
        }

        const jsonHead = new Headers();
        jsonHead.append('Content-type', 'application/json');
        jsonHead.append('token', localStorage.token);
        const cardId = mainCard.card_id;
        const body = {todoName, cardId};

        try {
            const res = await fetch("/todos/todo", {
                method: "POST",
                headers: jsonHead,
                body: JSON.stringify(body)
            });

            const parseRes = await res.json();
            //find the right card
            const cardIndex = allCards.findIndex(c => c.card_id === cardId);

            //create new card 
            const newTodos = [...allCards[cardIndex].todos, parseRes.rows[0]];
            let newCard = {...allCards[cardIndex]};
            newCard.todos = newTodos;

            //create new cards array
            let newCards = [...allCards];
            newCards[cardIndex] = newCard;

            setAllCards([...newCards]);
            setMainCard(newCard);
            setTodoName('');
        } catch (error) {
            console.error(error.message);
        }
    }

    const deleteTodo = async(e) => {
        e.preventDefault();
        const jsonHead = new Headers();
        jsonHead.append('Content-type', 'application/json');
        jsonHead.append('token', localStorage.token);
        const cardId = mainCard.card_id;
        const todoId = e.currentTarget.parentElement.parentElement.id;
        const body = { cardId, todoId };
        try {
            // eslint-disable-next-line
            const res = await fetch("/todos/todo", {
                method: "DELETE",
                headers: jsonHead,
                body: JSON.stringify(body)
            });

            await res.json();
            // remove from all cards and main card
            //find the right card
            const cardIndex = allCards.findIndex(c => c.card_id === cardId);

            //create new card 
            const newTodos = allCards[cardIndex].todos.filter( todo => todo.todo_id !== parseInt(todoId) );
            let newCard = {...allCards[cardIndex]};
            newCard.todos = newTodos;

            //create new cards array
            let newCards = [...allCards];
            newCards[cardIndex] = newCard;

            setAllCards([...newCards]);
            setMainCard(newCard);
        } catch (error) {
            console.error(error.message);
        }
    }

    const viewCard = (e) => {

        const cardIndex = allCards.findIndex(c => c.card_id === parseInt(e.currentTarget.parentElement.parentElement.id));
        setMainCard(allCards[cardIndex]);        
        //toggle if view card is true, if it is return main todos instead of cardlist
        setViewTodos(true);
    }

    const viewCardList = () => {
        setViewTodos(false)
    }

    const getColor = (todoPriority) => {
        switch (todoPriority) {
            case 0: 
                return 'prior low';
            case 1:
                return 'prior med';
            case 2: 
                return 'prior high';
        }
    }

    return (
        <Fragment>
            {
                viewTodos ? (
                    <div id="todos-wrap">
                        <div id="back" onClick={viewCardList}><Back /></div>
                        <div id="todo-top">
                            <span id="card-name">{mainCard.card_name}</span>
                            <span id="num-todo">{mainCard.todos.length} Tasks</span>
                        </div> 
                        <div id="todo-bottom">
                            { 
                                mainCard.todos.map( todo => {
                                    const priorCol = getColor(todo.todo_priority);
                                    return (
                                        <div className="todo" id={todo.todo_id} key={todo.todo_id}>
                                            <div className='todo-prior'>
                                                <div className={priorCol} ></div>
                                            </div>
                                            <span className="todo-title">{todo.todo_title}</span> 
                                            <div className="todo-inputs">   
                                                <EditTodo setMainCard={setMainCard} allCards={allCards} setAllCards={setAllCards} todo={todo}/>
                                                <Delete onClick={deleteTodo}/>
                                                <input type="checkbox" />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <form id="todo-inp" onSubmit={createTodo}>
                            <input value={todoName} type="text" name="todo" placeholder="Todo title" onChange={e => setTodoName(e.target.value)}></input>
                            <button>Create Todo</button>
                        </form>
                    </div>
                ) : (
                    <Fragment>
                        <div id="cards-top-wrap">
                            <span>Hello, {username}</span>
                        </div>
                        <div id="cards-bot-wrap">
                            <CardList allCards={allCards} setAllCards={setAllCards} deleteCard={deleteCard} viewCard={viewCard} />
                        </div>
                        <div id="cards-footer">
                            <form onSubmit={createCard}>
                                    <input value={cardName} type="text" name="card" placeholder="Card title" onChange={e => setCardName(e.target.value)}></input>
                                    <button>Create Card</button>
                            </form>
                            <button onClick={logout}>Logout</button>
                        </div>
                    </Fragment>
                )
            }
        </Fragment>
    );
}

export default Todos;