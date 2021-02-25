import React, { useEffect, useState } from 'react';
import CardList from './CardList';
import Card from './Card';
import '../styles/todo.css';

const Todos = ({ setAuth }) => {
    const [cardName, setCardName] = useState('');
    const [cardList, setCardList] = useState([]);
    const [todoName, setTodoName] = useState('');
    const [mainCard, setMainCard] = useState({});
    const [mainTodos, setMainTodos] = useState([]); 
    const [allTodos, setAllTodos] = useState([]);

    const fetchData = async() => {
        try {
            const res = await fetch("http://localhost:5000/todos", {
                method: "GET",
                headers: { token: localStorage.token}
            });

            const [cards, todos] = await res.json();

            setAllTodos(todos);
            
            const listCards = cards.filter(c => c.card_id !== null);

            if(listCards.length > 0) {
                setCardList(listCards);
                setMainCard(listCards[0]);
            }

            const todosMain = todos.filter(t => t.card_id === cards[0].card_id && t.todo_title !== null);
            setMainTodos(todosMain);
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
            const res = await fetch("http://localhost:5000/todos/card", {
                method: "POST",
                headers: jsonHead,
                body: JSON.stringify(body)
            });

            const parseRes = await res.json();
            setCardList([...cardList, parseRes[0]]);
            setCardName('');
        } catch (error) {
            console.error(error.message);
        }
    }

    const deleteCard = async(e) => {

        e.preventDefault();
        const jsonHead = new Headers();
        jsonHead.append('Content-type', 'application/json');
        jsonHead.append('token', localStorage.token);
        const cardId = e.target.parentElement.id;
        const body = {cardId};

        try {
            // eslint-disable-next-line
            const res = await fetch("http://localhost:5000/todos/card", {
                method: "DELETE",
                headers: jsonHead,
                body: JSON.stringify(body)
            });

            await res.json();
            const deleteCard = cardList.filter( c => c.card_id !== parseInt(cardId));
            setCardList(deleteCard);

            if(deleteCard[0]) {
                setMainCard(deleteCard[0]);
                const todosMain = allTodos.filter(t => t.card_id === deleteCard[0].card_id && t.todo_title !== null);
                setMainTodos(todosMain);
            } else {
                setMainCard({});
                setMainTodos([]);
            }


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
            const res = await fetch("http://localhost:5000/todos/todo", {
                method: "POST",
                headers: jsonHead,
                body: JSON.stringify(body)
            });

            const parseRes = await res.json();
            setMainTodos([...mainTodos, parseRes.rows[0]]);
            setAllTodos([...allTodos, parseRes.rows[0]]);
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
        const todoId = e.target.parentElement.parentElement.id;
        const body = { cardId, todoId };
        try {
            // eslint-disable-next-line
            const res = await fetch("http://localhost:5000/todos/todo", {
                method: "DELETE",
                headers: jsonHead,
                body: JSON.stringify(body)
            });

            await res.json();
            const deleteTodo = mainTodos.filter(t => t.todo_id !== parseInt(todoId));
            setMainTodos(deleteTodo);
            const deleteAllTodo = allTodos.filter(t => t.todo_id !== parseInt(todoId));
            setAllTodos(deleteAllTodo);
        } catch (error) {
            console.error(error.message);
        }
    }

    const viewCard = (e) => {


        const todosMain = allTodos.filter(t => t.card_id === parseInt(e.target.parentElement.id) && t.todo_title !== null);
        setMainTodos(todosMain);

        const cardIndex = cardList.findIndex(c => c.card_id === parseInt(e.target.parentElement.id));
        setMainCard(cardList[cardIndex]);

    }

    return (
        <div id="wrapper">
            <div className="auroral-northern"></div>
            <div className="auroral-stars"></div>
            <div id="main-wrap">
                <Card setTodoName={setTodoName} todoName={todoName} createTodo={createTodo} deleteTodo={deleteTodo} mainCard={mainCard} mainTodos={mainTodos} setMainTodos={setMainTodos}/>
                <div id="bottom-wrap">
                    <CardList setCardList={setCardList} cardList={cardList} deleteCard={deleteCard} viewCard={viewCard}/>
                    <form onSubmit={createCard}>
                        <input value={cardName} type="text" name="card" placeholder="Card title" onChange={e => setCardName(e.target.value)}></input>
                        <button>Create Card</button>
                    </form>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
            
            
        </div>
    );
}

export default Todos;