import React from 'react';
import EditTodo from './EditTodo';
import '../styles/todo.css';

const Card = ({ createTodo, deleteTodo, todoName, setTodoName, mainTodos, setMainTodos, mainCard }) => {

    if(Object.keys(mainCard).length === 0 && mainCard.constructor === Object) {
        return (
            <div id="card-wrap">
                <div id="card-title">No Card Selected</div>
            </div>
        )
    } else {
        return (
            <div id="card-wrap">
                <div id="card-title">{mainCard.card_name}</div>
                <div id="todo-wrap">
                    {
                        mainTodos.map(todo => {
                            return (
                                <div className="todo" id={todo.todo_id} key={todo.todo_id}>                            
                                    <div id="todo-main">
                                        {todo.todo_title}
                                    </div>
                                    <div id="todo-footer">
                                        {todo.todo_priority}
                                        <button onClick={deleteTodo}>-</button>
                                        <EditTodo mainTodos={mainTodos} setMainTodos={setMainTodos} todo={todo}/>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <form onSubmit={createTodo}>
                    <input value={todoName} type="text" name="todo" placeholder="Todo description" onChange={e => setTodoName(e.target.value)}></input>
                    <button>Create Todo</button>
                </form>
            </div>
        )
    }

}

export default Card;

