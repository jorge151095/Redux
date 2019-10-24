//import * as Redux from 'redux';
import { createStore, combineReducers } from 'redux';

//nodes
let addEmail = document.getElementById('addEmail');
let input = document.getElementById("thingsInput");
let todos = {}
let list = document.getElementById("list");
let emailsList = document.getElementById("emailsList");

//function
function drawTodos() {
    list.innerHTML = "";
    // Update todos
    todos = store.getState().todos;
    for( let key in todos) {
        let li = document.createElement('li');
        let classDone = todos[key].done ? "done" : "";
        li.innerHTML = `
            <span id="${key}" class="${classDone}"> ${todos[key].text} </span>
            <span data-id="${key}" data-action="delete"> X </span>`;
        setListeners(li);
        list.appendChild(li);
    }
}

function drawEmails() {
    emailsList.innerHTML = "";
    let emails = store.getState().emails;
    emails.map(email => {
        let li = document.createElement('li');
        li.innerHTML = `
            <span>${email}<span>
            <span id="${email}">X</span>
        `;
        setEmailClickListener(li);
        emailsList.appendChild(li);
    })
    
}

function setEmailClickListener(li) {
    li.addEventListener('click', e => {
        let email = e.target.id;
        store.dispatch({
            type: "DELETE_EMAIL",
            email
        })
    })
}

function setListeners(li) {
    li.addEventListener("click", e => {
        if (e.target.getAttribute("data-action") === "delete") {
            let key = e.target.getAttribute("data-id");
            store.dispatch({
                type: "DELETE_TODO",
                id: key
            });
            return
        }
        let key = e.target.id;
        todos[key].done = !todos[key].done;
        store.dispatch({
            type: "UPDATE_TODO",
            todo: todos[key]
        })
    });
}


//listeners
input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        let text = e.target.value;
        e.target.value = "";
        let todo = {text, done:false};
        store.dispatch({
            type: "ADD_TODO",
            todo
        })
    }
})

addEmail.addEventListener('keydown', e=> {
    if(e.key === "Enter") {
        let email = e.target.value;
        e.target.value = "";
        store.dispatch({
            type: "ADD_EMAIL",
            email
        })
    }
});

//REDUX
function emailsReducer(state=[], action) {
    switch(action.type) {
        case "ADD_EMAIL":
            return [...state, action.email];
        case "DELETE_EMAIL":
            return [...state.filter(mail => mail !== action.email)];
        default:
            return state;
    }
}
// Reducer
function todosReducer(state = { lol: true}, action) {
    switch(action.type) {
        case "ADD_TODO":
            action.todo["id"] = Object.keys(state).length;
            return {...state, [Object.keys(state).length]:action.todo};
        case "UPDATE_TODO":
            return {...state, [action.todo.id]:action.todo}
        case "DELETE_TODO":
            delete state[action.id]
            return {...state}
        default:
            return state;
    }
}

//MIX reducers
let rootReducer = combineReducers({
    todos: todosReducer,
    emails: emailsReducer
});

// store
let store = createStore(rootReducer, {
    emails: ["jorgeahg@gmail.com"],
    todos: {0: {
            text: "create store",
            done: "true",
            id: 0
        }
    }
});

//store.subscribe(drawTodos);
store.subscribe(()=> {
    drawTodos();
    drawEmails();
});

//Init
drawTodos();
drawEmails();