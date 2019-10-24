//import * as Redux from 'redux';
import { createStore } from 'redux';

//nodes
let input = document.getElementById("thingsInput");
let todos = {}
let list = document.getElementById("list");

//function
function drawTodos() {
    list.innerHTML = "";
    // Update todos
    todos = store.getState();
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
        let todo = {text, done:false};
        store.dispatch({
            type: "ADD_TODO",
            todo
        })
    }
})

//REDUX

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

// store
let store = createStore(todosReducer, {
    0: {
        text: "create store",
        done: "true",
        id: 0
    }
});

store.subscribe(drawTodos);
drawTodos();