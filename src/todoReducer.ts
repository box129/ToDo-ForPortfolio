import type { todoData } from "./types/Module";

export interface TodoState {
    todoInput: string;
    todoList: todoData[];
}

export const initialState: TodoState = {
    todoInput: "",
    todoList: [],
};

export type TodoAction = 
    | { type: 'SET_INPUT', payload: string }
    | { type: 'ADD_TODO', payload: null }
    | { type: 'DELETE_TODO', payload: number }
    | { type: 'TOGGLE_DONE', payload: number }
    | { type: 'EDIT_TODO', payload: { id: number, content: string  } }
    | { type: 'REORDER_TODOS', payload: todoData[] };

    


export const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
    switch (action.type) {
        case 'SET_INPUT':
            return {
                ...state,
                todoInput: action.payload
            };
        case 'ADD_TODO':
            if (state.todoInput) {
                const newTodo: todoData = {
                    id: Date.now(),
                    content: state.todoInput,
                    isDone: false
                };
                return {
                    todoInput: '', // Reset input after adding
                    todoList: [...state.todoList, newTodo]
                };
            }
            return state; // If input is empty, return current state
        case 'DELETE_TODO':
            return {
                ...state,
                todoList: [...state.todoList.filter(t => t.id !== action.payload)]
            };
        case 'TOGGLE_DONE':
            return {
                ...state,
                todoList: state.todoList.map(t =>
                    t.id === action.payload ? { ...t, isDone: !t.isDone } : t
                ),
            };
        case 'EDIT_TODO':
            // Check incoming payload (good)
            console.log("REDUCER: Received EDIT_TODO action:", action.payload); 
            
            // Log the content that is ABOUT to be saved (good enough for debugging)
            console.log("REDUCER: New content being saved is:", action.payload.content); 
            
            return {
                ...state,
                todoList: state.todoList.map(t => 
                    t.id === action.payload.id ? { ...t, content: action.payload.content } : t
                )
            };
        case 'REORDER_TODOS':
            return {
                ...state,
                // This payload is the entire reordered list
                todoList: action.payload
            };
        default:
            return state;    
    }
}