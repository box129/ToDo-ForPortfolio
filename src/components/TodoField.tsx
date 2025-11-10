import React, {  } from 'react'
import type { todoData } from '../types/Module';
import SingleTodo from './SingleTodo';
import type { TodoAction } from '../todoReducer';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import './TodoField.css';

interface Props {
    activeList: todoData[];
    dispatch: React.Dispatch<TodoAction>;
    completedList: todoData[];
    highlightFirst?: boolean;
    firstItemRef?: React.RefObject<HTMLDivElement | null>;
}

const TodoField: React.FC<Props> = ({ activeList, dispatch, completedList, highlightFirst = false, firstItemRef }) => {
    const { setNodeRef: setActiveDropRef } = useDroppable({ id: 'active-list' });
    const { setNodeRef: setCompletedDropRef } = useDroppable({ id: 'completed-list' });
    
    return (
        <div className="todo-field-container">
            <div ref={setActiveDropRef} className="todo-list active-list">
                <span className="todo-list-title">Active Task</span>
                {activeList.length === 0 ? (
                    <div className="todo-list-empty">No active tasks yet. Add one above!</div>
                ) : (
                    <SortableContext items={activeList.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {activeList.map((t, index) => (
                            <SingleTodo 
                                key={t.id} 
                                id={t.id} 
                                todo={t} 
                                dispatch={dispatch}
                                highlight={highlightFirst && index === 0}
                                ref={index === 0 ? firstItemRef : undefined}
                            />
                        ))}
                    </SortableContext>
                )}
            </div>
            
            <div ref={setCompletedDropRef} className="todo-list completed-list">
                <span className="todo-list-title">Completed Task</span>
                {completedList.length === 0 ? (
                    <div className="todo-list-empty">No completed tasks yet.</div>
                ) : (
                    <SortableContext items={completedList.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {completedList.map((t) => (
                            <SingleTodo 
                                key={t.id} 
                                id={t.id} 
                                todo={t} 
                                dispatch={dispatch}
                            />
                        ))}
                    </SortableContext>
                )}
            </div>
        </div>
    )
}

export default TodoField;