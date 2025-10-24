import React, { useEffect, useRef, useState } from 'react';
import type { todoData } from '../types/Module';
import { MdEdit, MdDragIndicator } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { MdDeleteForever } from "react-icons/md";
import type { TodoAction } from '../todoReducer';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import './SingleTodo.css';

type Props = {
   id: number; 
   todo: todoData;
   dispatch: React.Dispatch<TodoAction>;
   isOverlay?: boolean; // New prop to identify overlay rendering
}

const SingleTodo = ({ id, todo, dispatch, isOverlay = false }: Props) => {
    const {attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id,
        disabled: isOverlay, // Disable sortable for overlay
    });

    const [edit, setEdit] = useState<boolean>(false);
    const [textEdit, setTextEdit] = useState<string>(todo.content);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!edit && !todo.isDone) {
            setEdit(true);
        }
    }

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        dispatch({ type: 'DELETE_TODO', payload: id });
    }
        
    const handleDone = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        dispatch({ type: 'TOGGLE_DONE', payload: id });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const newContent = textEdit.trim();

        if (newContent) {
            dispatch({ 
                type: 'EDIT_TODO', 
                payload: { id: todo.id, content: newContent } 
            });
            setEdit(false);
        } else {
            setEdit(false);
        }
    }

    useEffect(() => {
        if (!edit) {
            setTextEdit(todo.content);
        }
    }, [todo.content, edit]);

    useEffect(() => {
        if (edit) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [edit])
    
    const style = isOverlay ? undefined : {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    // If it's an overlay, render without drag interactions
    if (isOverlay) {
        return (
            <div className="todo-item-wrapper">
                <form className="todo-item">
                    <span className="todo-drag-handle">
                        <MdDragIndicator />
                    </span>
                    <span className={`todo-content ${todo.isDone ? 'completed' : ''}`}>
                        {todo.content}
                    </span>
                    <span className="todo-action-icon edit-icon">
                        <MdEdit />
                    </span>
                    <span className="todo-action-icon delete-icon">
                        <MdDeleteForever />
                    </span>
                    <span className="todo-action-icon done-icon">
                        <TiTick />
                    </span>
                </form>
            </div>
        );
    }

    return (
        <div 
            className="todo-item-wrapper"
            ref={setNodeRef} 
            style={style}
        >
            <form className="todo-item" onSubmit={handleSubmit}>
                <span 
                    className="todo-drag-handle" 
                    {...attributes} 
                    {...listeners}
                >
                    <MdDragIndicator />
                </span>

                {edit ? (
                    <input
                        type='text'
                        className="todo-edit-input"
                        value={textEdit}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setTextEdit(e.target.value);
                        }}
                        onBlur={handleSubmit}
                        ref={inputRef}
                    />
                ) : (
                    <span className={`todo-content ${todo.isDone ? 'completed' : ''}`}>
                        {todo.content}
                    </span>
                )}
            
                <span className="todo-action-icon edit-icon" onClick={handleEdit}>
                    <MdEdit />
                </span>
                <span className="todo-action-icon delete-icon" onClick={(e) => handleDelete(e, todo.id)}>
                    <MdDeleteForever />
                </span>
                <span className="todo-action-icon done-icon" onClick={(e) => handleDone(e, todo.id)}>
                    <TiTick />
                </span>
            </form>
        </div>
    )
}

export default SingleTodo;