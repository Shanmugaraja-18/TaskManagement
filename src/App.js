import React, {useState, useEffect} from 'react';
import './App.css';
import {AiOutlineDelete} from 'react-icons/ai';
import {BsCheckLg} from 'react-icons/bs';
import {AiTwotoneEdit} from 'react-icons/ai';
import {VscDebugStart} from 'react-icons/vsc';



function App () {
  const [allTodos, setAllTodos] = useState ([]);
  const [newTodoTitle, setNewTodoTitle] = useState ('');
  const [newDescription, setNewDescription] = useState ('');
  const [completedTodos, setCompletedTodos] = useState ([]);
  const [isCompletedScreen, setIsCompletedScreen] = useState (false);
  const [isEditing, setIsEditing] = useState(false); 
  const [editIndex, setEditIndex] = useState(null); 
  const [doingTodos, setDoingTodos] = useState([]);


  const handleEdit = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setNewTodoTitle(allTodos[index].title);
    setNewDescription(allTodos[index].description);
  };

  const handleUpdate = () => {
    if (editIndex !== null) {
      const updatedTodos = [...allTodos];
      updatedTodos[editIndex].title = newTodoTitle;
      updatedTodos[editIndex].description = newDescription;
      setAllTodos(updatedTodos);

      setIsEditing(false);
      setEditIndex(null);
      setNewTodoTitle('');
      setNewDescription('');

      localStorage.setItem('todolist', JSON.stringify(updatedTodos));
    }
  };

  const handleAddNewToDo = () => {
    let newToDoObj = {
      title: newTodoTitle,
      description: newDescription,
    };
    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push (newToDoObj);
    setAllTodos (updatedTodoArr);
    localStorage.setItem ('todolist', JSON.stringify (updatedTodoArr));
    setNewDescription ('');
    setNewTodoTitle ('');
  };

  useEffect (() => {
    let savedTodos = JSON.parse (localStorage.getItem ('todolist'));
    let savedCompletedToDos = JSON.parse (
      localStorage.getItem ('completedTodos')
    );
    if (savedTodos) {
      setAllTodos (savedTodos);
    }

    if (savedCompletedToDos) {
      setCompletedTodos (savedCompletedToDos);
    }
  }, []);

  const handleStart = (index) => {
    const startedTodo = allTodos[index];
    const updatedTodos = allTodos.filter((_, i) => i !== index);

    setAllTodos(updatedTodos);
    setDoingTodos([...doingTodos, startedTodo]);

    localStorage.setItem('todolist', JSON.stringify(updatedTodos));
    localStorage.setItem('doingTodos', JSON.stringify([...doingTodos, startedTodo]));
  };

  const handleDoingTodoDelete = (index) => {
    const updatedDoingTodos = [...doingTodos];
    updatedDoingTodos.splice(index, 1);
  
    setDoingTodos(updatedDoingTodos);
    localStorage.setItem('doingTodos', JSON.stringify(updatedDoingTodos));
  };
  const handleToDoDelete = (index) => {
    const updatedTodos = allTodos.filter((_, i) => i !== index);
    setAllTodos(updatedTodos);
    localStorage.setItem('todolist', JSON.stringify(updatedTodos));
  };

  const handleCompletedTodoDelete = (index) => {
    const updatedCompletedTodos = [...completedTodos];
    updatedCompletedTodos.splice(index, 1);
    setCompletedTodos(updatedCompletedTodos);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedTodos));
  };
  const handleComplete = (index, sourceSection) => {
    const date = new Date();
    const finalDate =
      `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    if (sourceSection === 'doing') {
      const completedTodo = doingTodos[index];
      const updatedDoingTodos = doingTodos.filter((_, i) => i !== index);

      setDoingTodos(updatedDoingTodos);
      setCompletedTodos([...completedTodos, { ...completedTodo, completedOn: finalDate }]);

      localStorage.setItem('doingTodos', JSON.stringify(updatedDoingTodos));
      localStorage.setItem('completedTodos', JSON.stringify([...completedTodos, { ...completedTodo, completedOn: finalDate }]));
    } else {
      const updatedTodos = allTodos.filter((_, i) => i !== index);
      setAllTodos(updatedTodos);

      setCompletedTodos([...completedTodos, { ...allTodos[index], completedOn: finalDate }]);
      localStorage.setItem('todolist', JSON.stringify(updatedTodos));
      localStorage.setItem('completedTodos', JSON.stringify([...completedTodos, { ...allTodos[index], completedOn: finalDate }]));
    }
  };
  return (
    <div className="App">
      <h1> Kanban Board Task Management
</h1>

      <div className="todo-wrapper">

        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title:</label>
            <input
              type="text"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle (e.target.value)}
              placeholder="What's the title of your To Do?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description:</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription (e.target.value)}
              placeholder="What's the description of your To Do?"
            />
          </div>
          <div className="todo-input-item">
            <button
              className="primary-btn"
              type="button"
              onClick={handleAddNewToDo}
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompletedScreen === false && 'active'}`}
            onClick={() => setIsCompletedScreen (false)}
          >
            To Do
          </button>
          <button
            className={`secondaryBtn ${isCompletedScreen === true && 'active'}`}
            onClick={() => setIsCompletedScreen (true)}
          >
            Completed
          </button>
          <button
          className={`secondaryBtn ${
            isCompletedScreen === 'doing' && 'active'
          }`}
          onClick={() => setIsCompletedScreen('doing')} 
        >
          Doing
        </button>
        </div>
        <div className="todo-list">
        {isCompletedScreen === false &&
          allTodos.map((item, index) => (
            <div className="todo-list-item" key={index}>
              <div>
                {isEditing && editIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={newTodoTitle}
                      onChange={(e) => setNewTodoTitle(e.target.value)}
                    />
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <button className="primary-btn" onClick={handleUpdate}>
                      Update
                    </button>
                  </>
                ) : (
                  <>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </>
                )}
              </div>
              <div>
                {isEditing && editIndex === index ? (
                  <button className="secondaryBtn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                ) : (
                  <>
                  <AiOutlineDelete
                    title="Delete?"
                    className="icon"
                    onClick={() => handleToDoDelete(index)}
                  />
                  <BsCheckLg
                    title="Completed?"
                    className="check-icon"
                    onClick={() => handleComplete(index)}
                  />
                  <AiTwotoneEdit
                    title="Edit?"
                    className="edit-icon"
                    onClick={() => handleEdit(index)}
                  />
                  <VscDebugStart
                    title="Start?"
                    className="start-icon"
                    onClick={() => handleStart(index)}
                  />
                </>

                )}
              </div>
            </div>
          ))}

        {isCompletedScreen === true &&
          completedTodos.map((item, index) => (
            <div className="todo-list-item" key={index}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p> <i>Completed at: {item.completedOn}</i></p>
              </div>
              <div>
                <AiOutlineDelete
                  className="icon"
                  onClick={() => handleCompletedTodoDelete(index)}
                />
              </div>
            </div>
          ))}
          {isCompletedScreen === 'doing' && 
  doingTodos.map((item, index) => (
    <div className="todo-list-item" key={index}>
      <div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
      <div>
        <AiOutlineDelete
          title="Delete?"
          className="icon"
          onClick={() => handleDoingTodoDelete(index)} 
        />
        <BsCheckLg
          title="Completed?"
          className="check-icon"
          onClick={() => handleComplete(index,'doing')} 
        />
      </div>
    </div>
  ))}
      </div>
      </div>
    </div>
  );
}

export default App;
