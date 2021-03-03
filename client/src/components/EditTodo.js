import { React, Fragment, useState } from 'react';
import {ReactComponent as Edit} from '../imgs/edit.svg';

const EditTodo = ({ setMainCard, allCards, setAllCards, todo }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState(0);

    const date = new Date();
    let inpDate  = '';
    
    date.getMonth() + 1 < 10 ? 
        inpDate = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}` : 
        inpDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const [dueDate, setDueDate] = useState(inpDate);

    const submitEdit = async(e) => {
        e.preventDefault()
        try {
            const cardId = todo.card_id;
            const body = { title, priority, dueDate, cardId };
            const jsonHead = new Headers();
            jsonHead.append('Content-type', 'application/json');
            jsonHead.append('token', localStorage.token);

            await fetch(`/todos/todo/${todo.todo_id}`, {
                method: "PUT",
                headers: jsonHead,
                body: JSON.stringify(body)
            })

            //SYNCHRONISE TODO LIST

            //find card index
            const cardIndex = allCards.findIndex(c => c.card_id === cardId);
            //find todo index
            const todoIndex = allCards[cardIndex].todos.findIndex(t => t.todo_id === todo.todo_id);

            //create new todo
            const newTodo = { ...allCards[cardIndex].todos[todoIndex], todo_title: title, todo_priority: priority, todo_due: dueDate }

            //create updated todo list
            const temp = [ ...allCards[cardIndex].todos ];

            const updatedTodos = [
                ...temp.slice(0, todoIndex),
                newTodo,
                ...temp.slice(todoIndex + 1),
            ];

            //create new card array
            const newCards = allCards.map( c =>  
                c.card_id === cardId ? { ...c, todos: updatedTodos } : c
            );
            
            setMainCard(newCards[cardIndex]);
            setAllCards(newCards);
            setTitle('');
            setPriority(0);
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <Fragment>
            <Edit type="button"  data-toggle="modal" data-target={`#id${todo.todo_id}`}/>

            <div className="modal fade" id={`id${todo.todo_id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Todo</h5>
                        </div>
                        <div className="modal-body">
                            <form >
                                <div className="form-group">
                                    <label htmlFor="todo-title">Title</label>
                                    <input value={title} onChange={e => setTitle(e.target.value)} type="title" className="form-control" id="todo-title" placeholder={todo.todo_title} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="todo-priority">Priority</label>
                                    <select className="form-control" name="todo-priority" id="todo-priority" value={priority} onChange={e => setPriority(e.target.value)}>
                                        <option value={0}>Low</option>
                                        <option value={1}>Medium</option>
                                        <option value={2}>High</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="todo-due" >Due Date</label>
                                    <input type="date" className="form-control" id="todo-due" value={dueDate} onChange={e => setDueDate(e.target.value)}/>
                                </div>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={submitEdit} data-dismiss="modal">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default EditTodo;