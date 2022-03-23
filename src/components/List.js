import React, { useState } from 'react'
import Item from './item'

function List() {
    // function createListElement(data) {
    //     return (<p>{data.title}</p>);
    // }

    let [title, setTitle] = useState(""); // default value 
    //Contains two values: state and function

    let taskList = [
        {
            title: 'Task 1',
        },
        {
            title: 'Task 2',
        }
    ];

    let [todo, setTodo] = useState(taskList);

    function onSubmit() {
        setTodo([...todo, { title: title }]);
        setTitle("");
    }

    function removeItem(data) {
        const result = todo.filter((item) => item.title !== data.title);
        setTodo(result);
    }

    return (
        <div>
            <h1>Todo List</h1>
            <div className='inputs'>
                <input type='text'
                    value={title}
                    onChange={(event) => setTitle(event.target.value)} />
                <input type='button' value='Add' onClick={onSubmit} />
                {/* Don't pass as createListElement() */}
                {/* {taskList.map(createListElement)}  */}

                {/* Lambda expression */}
                {todo.map((data) => (
                    // Give it a unique key so that each update only update that unique value
                    <Item key={JSON.stringify(data)} itemData={data} removeItem={removeItem} />
                ))}
            </div>
        </div>
    );
}

export default List;