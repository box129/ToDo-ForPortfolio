import InputField from './components/InputField'
import './App.css'
import TodoField from './components/TodoField';
import { useReducer, useState } from 'react';
import { todoReducer, initialState } from './todoReducer';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent, DragOverlay, type DragStartEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
// import type { todoData } from './types/Module';
import SingleTodo from './components/SingleTodo';


function App() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [activeId, setActiveId] = useState<number | null>(null);

  // The state variables are now accessed via the state object
  const { todoInput, todoList } = state;

  const activeList = todoList.filter(t => !t.isDone);
  const completedList = todoList.filter(t => t.isDone);
  
  // Find the currently dragging todo
  const activeTodo = todoList.find(t => t.id === activeId);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (todoInput) {
      // Dispatch the ADD_TODO action
      dispatch({ type: 'ADD_TODO', payload: null });
    }
  }

  // Helper function to dispatch the SET_INPUT action
  const setTodoInput = (value: string) => {
    dispatch({ type: 'SET_INPUT', payload: value });
  }

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as number);
  }
    
  const handleDragEnd = (e: DragEndEvent) => {
    const {active, over} = e;

    console.log('Drag End - Active ID:', active.id, 'Over ID:', over?.id);

    setActiveId(null); // Reset active dragging item

    if (!over) return; // Dropped outside container

    const draggedId = active.id as number; // Id of item being dragged
    const overId = over.id as string | number; // Can be container ID or item ID

    // Find the dragged item and determine its current status
    const draggedItem = todoList.find(t => t.id === draggedId);
    if (!draggedItem) return;

    console.log('Dragged item isDone:', draggedItem.isDone, 'Over:', overId);

    // SCENE 1: Moving between Active and Completed list
    
    // If dropped on the completed-list container or a completed item
    if (overId === 'completed-list' || typeof overId === 'number' && completedList.some(t => t.id === overId)) {
      // If item is currently active (not done), mark it as done
      if (!draggedItem.isDone) {
        console.log('Moving to completed');
        dispatch({ type: 'TOGGLE_DONE', payload: draggedId });
        return;
      }
    }

    // If dropped on the active-list container or an active item
    if (overId === 'active-list' || typeof overId === 'number' && activeList.some(t => t.id === overId)) {
      // If item is currently completed (done), mark it as not done
      if (draggedItem.isDone) {
        console.log('Moving to active');
        dispatch({ type: 'TOGGLE_DONE', payload: draggedId });
        return;
      }
    }

    // SCENE 2: Sorting within the same list
    // Only if dropped on another item (not container)
    if (typeof overId === 'number') {
      const targetItem = todoList.find(t => t.id === overId);
      
      // Both items must be in the same status (both active or both completed)
      if (targetItem && draggedItem.isDone === targetItem.isDone) {
        const originalPos = todoList.findIndex(t => t.id === draggedId);
        const newPos = todoList.findIndex(t => t.id === overId);

        if (originalPos !== newPos) {
          console.log('Reordering within same list');
          const newTodoList = arrayMove(todoList, originalPos, newPos);
          dispatch({ type: 'REORDER_TODOS', payload: newTodoList });
        }
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <div className="app-container">
      <span className="app-title">ToDo App</span>
      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd} 
        collisionDetection={closestCenter}
      >
        <div>
          <InputField todoInput={todoInput} setTodoInput={setTodoInput} submitHandler={handleAdd}/>
          <TodoField activeList={activeList} dispatch={dispatch} completedList={completedList}/>
        </div>
        
        <DragOverlay dropAnimation={{
          duration: 300,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeId && activeTodo ? (
            <div className="drag-overlay">
              <SingleTodo 
                id={activeTodo.id} 
                todo={activeTodo} 
                dispatch={dispatch}
                isOverlay={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default App;