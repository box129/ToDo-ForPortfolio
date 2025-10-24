import React from 'react';
import './InputField.css';
interface Props {
    todoInput: string;
    setTodoInput: (value: string) => void;
    submitHandler: (e: React.FormEvent) => void;
}

const InputField = ({ todoInput, setTodoInput, submitHandler }: Props) => {
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // e.preventDefault();
        const value = e.target.value;
        setTodoInput(value);
    }


  return (
    <form className="input-form" onSubmit={submitHandler}>
        <input className="input-field"
            type="text"
            onChange={handleChange}
            value={todoInput}
            placeholder="Add a new task..."
        />
        <button type='submit' className="submit-button">Go</button>
    </form>
  )
}

export default InputField;