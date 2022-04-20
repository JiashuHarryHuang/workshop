import React, { useState, useEffect } from 'react'
import Item from './item'
import DatePicker from "react-date-picker";
import { v4 as uuidv4 } from 'uuid'; //Generate unique id
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../database";
import { collection, getDocs } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
// import userEvent from '@testing-library/user-event';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

const WORKER_LINK = "https://us-central1-automation-nk.cloudfunctions.net/ical?url=";

function List() {
    // function createListElement(data) {
    //     return (<p>{data.title}</p>);
    // }
    const [user] = useAuthState(auth);
    let [title, setTitle] = useState(""); // default value 
    //Contains two values: state and function
    let [date, setDate] = useState(new Date());

    // taskList = default value. Put things into todo by setTodo method
    // todo = things to read, setTodo = things to write
    let [todo, setTodo] = useState([]);

    let [open, setOpen] = useState(false);

    let [link, setLink] = useState("");

    const collectionName = `users/${user.uid}/tasks`;

    function onSubmit() {
        const obj = { id: uuidv4(), title: title, date: date };
        //Create a new list. ...todo is everything in todo and added the new item. 
        setTodo([...todo, obj]); //Update react
        setDoc(doc(db, collectionName, obj.id), obj); //Upddate the firebase
        setTitle(""); //Reset back to default value after submitted
        setDate(new Date()); //Clearing date
    }

    function removeItem(data) {
        const result = todo.filter((item) => item.id !== data.id);
        setTodo(result);

        //Delete the data from the data base
        deleteDoc(doc(db, collectionName, data.id));
    }

    async function saveLink() {
        await setDoc(doc(db, "users", user.uid), {
            calendarurl: link
        })
        setOpen(false);
    }

    async function brightspaceSync() {
        const bsTasks = await fetch(WORKER_LINK + link).then((tasks) => tasks.json());
        let arr = todo;
        bsTasks.forEach((task) => {
            let foundMatch = false;
            todo.forEach((item) => {
                if (item.title == task.name && item.date.getTime() == new Date(task.time).getTime())
                    foundMatch = true;
            })
            if (!foundMatch) {
                const obj = { id: uuidv4(), title: task.name, date: new Date(task.time) };
                setDoc(doc(db, collectionName, obj.id), obj)
                arr.push(obj);
            }

        })



        setTodo([...arr]);
    }

    function openModal() {
        setOpen(true);
    }

    useEffect(() => {
        //When array is empty, the function is run only when it's loaded
        let newArr = [];

        //Add the data into the database
        getDocs(collection(db, collectionName)).then((tasks) => {
            tasks.forEach((task) => {
                newArr.push({
                    title: task.data().title,
                    date: new Date(task.data().date.seconds * 1000),
                    id: task.data().id,
                });
            });
            setTodo(newArr);
        });

        getDoc(doc(db, "users", user.uid)).then((user) => {
            setLink(user.data().calendarurl)
        })

    }, []); //Run the first argument (a function) when the list is empty. Only run when the page is loaded. 

    return (
        <div>
            <marquee>Signed in as: {user.displayName}, {user.email}</marquee> <br />
            <button onClick={() => { signOut(auth) }} value="Sign out">Sign out</button>
            <h1>Todo List</h1>
            <div className='inputs'>
                <input type='text'
                    value={title}
                    onChange={(event) => setTitle(event.target.value)} />
                <DatePicker onChange={setDate} value={date} />
                <input type='button' value='Add' onClick={onSubmit} />
                <input type='button' value="Get Brightspace Link" onClick={openModal} />
                <input type='button' value="Sync Calendar" onClick={brightspaceSync} />
                {/* Don't pass as createListElement() */}
                {/* {taskList.map(createListElement)}  */}

                {/* Lambda expression */}
                {/* Map calls the anonymous function to every element in todo*/}
                {todo.map((data) => (
                    // Give it a unique key so that each update only update that unique value
                    //Also allow us to only delete the specified task rather than every task with the same name
                    <Item key={data.id} itemData={data} removeItem={removeItem} />
                ))}
                <Modal open={open} onClose={saveLink} center>
                    <h2>Place BrightSpace Link Here</h2>
                    <input type='text'
                        value={link}
                        onChange={(event) => setLink(event.target.value)} />
                </Modal>
            </div>
        </div>
    );
}

export default List;