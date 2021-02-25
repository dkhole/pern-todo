import { React, Fragment, useState } from 'react';

const EditTodo = ({ mainTodos, setMainTodos, todo }) => {
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
            const body= { title, priority, dueDate, cardId };
            const jsonHead = new Headers();
            jsonHead.append('Content-type', 'application/json');
            jsonHead.append('token', localStorage.token);

            await fetch(`http://localhost:5000/todos/todo/${todo.todo_id}`, {
                method: "PUT",
                headers: jsonHead,
                body: JSON.stringify(body)
            })

            //update todo list
            //find todo index
            const objIndex = mainTodos.findIndex(t => t.todo_id === todo.todo_id);
            //create new todo
            const newObj = {...mainTodos[objIndex], todo_title: title, todo_priority: priority, todo_due: dueDate }

            const updatedTodos = [
                ...mainTodos.slice(0, objIndex),
                newObj,
                ...mainTodos.slice(objIndex + 1),
            ];
            
            setMainTodos(updatedTodos);
            setTitle('');
            setPriority(0);
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <Fragment>
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target={`#id${todo.todo_id}`}>
                Edit
            </button>

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