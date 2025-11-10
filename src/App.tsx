import InputField from './components/InputField'
import './App.css'
import TodoField from './components/TodoField';
import { useReducer, useState, useEffect, useRef } from 'react';
import { todoReducer, initialState } from './todoReducer';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent, DragOverlay, type DragStartEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
// import type { todoData } from './types/Module';
import SingleTodo from './components/SingleTodo';
import TutorialDialog from './components/TutorialDialog';

function App() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const firstItemRef = useRef<HTMLDivElement>(null);

  const { todoInput, todoList } = state;

  const activeList = todoList.filter(t => !t.isDone);
  const completedList = todoList.filter(t => t.isDone);
  
  const activeTodo = todoList.find(t => t.id === activeId);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show tutorial when first item is added
  useEffect(() => {
    const tutorialSeen = localStorage.getItem('todo-tutorial-seen');
    
    if (!tutorialSeen && todoList.length === 1) {
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [todoList.length]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (todoInput) {
      dispatch({ type: 'ADD_TODO', payload: null });
    }
  }

  const setTodoInput = (value: string) => {
    dispatch({ type: 'SET_INPUT', payload: value });
  }

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as number);
  }
    
  const handleDragEnd = (e: DragEndEvent) => {
    const {active, over} = e;

    setActiveId(null);

    if (!over) return;

    const draggedId = active.id as number;
    const overId = over.id as string | number;

    const draggedItem = todoList.find(t => t.id === draggedId);
    if (!draggedItem) return;

    if (overId === 'completed-list' || typeof overId === 'number' && completedList.some(t => t.id === overId)) {
      if (!draggedItem.isDone) {
        dispatch({ type: 'TOGGLE_DONE', payload: draggedId });
        return;
      }
    }

    if (overId === 'active-list' || typeof overId === 'number' && activeList.some(t => t.id === overId)) {
      if (draggedItem.isDone) {
        dispatch({ type: 'TOGGLE_DONE', payload: draggedId });
        return;
      }
    }

    if (typeof overId === 'number') {
      const targetItem = todoList.find(t => t.id === overId);
      
      if (targetItem && draggedItem.isDone === targetItem.isDone) {
        const originalPos = todoList.findIndex(t => t.id === draggedId);
        const newPos = todoList.findIndex(t => t.id === overId);

        if (originalPos !== newPos) {
          const newTodoList = arrayMove(todoList, originalPos, newPos);
          dispatch({ type: 'REORDER_TODOS', payload: newTodoList });
        }
      }
    }
  };

  const handleDismissTutorial = () => {
    setShowTutorial(false);
  };

  const handleDontShowAgain = () => {
    localStorage.setItem('todo-tutorial-seen', 'true');
    setShowTutorial(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
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
          <TodoField 
            activeList={activeList} 
            dispatch={dispatch} 
            completedList={completedList}
            highlightFirst={showTutorial}
            firstItemRef={firstItemRef}
          />
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

      <TutorialDialog 
        isVisible={showTutorial}
        onDismiss={handleDismissTutorial}
        onDontShowAgain={handleDontShowAgain}
        isMobile={isMobile}
        targetRef={firstItemRef}
      />
    </div>
  )
}

export default App;