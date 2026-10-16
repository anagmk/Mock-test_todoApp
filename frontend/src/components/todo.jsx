import { useState, useEffect } from 'react'

function Todo() {
    const [todos, setTodos] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState("pending")
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        fetchTodos()
    }, [])

    function resetForm() {
        setEditingId(null)
        setTitle("")
        setDescription("")
        setStatus("pending")
    }

    function startEdit(todo) {
        setEditingId(todo._id || todo.id)
        setTitle(todo.title)
        setDescription(todo.description)
        setStatus(todo.completed ? 'completed' : 'pending')
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const token = localStorage.getItem('token')
            const payload = {
                title,
                description,
                completed: status === 'completed'
            }

            if (editingId) {
                const response = await fetch(`http://localhost:3000/api/todo/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                })

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || errorData || `HTTP ${response.status}`);
                }

                const data = await response.json();
                console.log(data)
                resetForm()
                await fetchTodos()
                return
            }

            const response = await fetch("http://localhost:3000/api/todo", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData || `HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log(data)
            resetForm()
            await fetchTodos()
        } catch (error) {
            console.error("Todo save failed:", error.message)
        }
    }

    async function fetchTodos() {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch("http://localhost:3000/api/todo", {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData || `HTTP ${response.status}`);
            }
            const data = await response.json();
            console.log(data)
            setTodos(Array.isArray(data.todos) ? data.todos : [])
        } catch (error) {
            console.error("Fetching todos failed:", error.message)
        }
    }

    async function deleteTodo(id) {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3000/api/todo/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData || `HTTP ${response.status}`);
            }
            const data = await response.json();
            console.log(data)
            await fetchTodos()
        } catch (error) {
            console.error("Deleting todo failed:", error.message)
        }
    }

    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="title">title</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} />

                <label htmlFor="description">description</label>
                <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} />

                <label htmlFor="status">status</label>
                <input type="text" id="status" value={status} onChange={e => setStatus(e.target.value)} />

                <button type="submit">{editingId ? 'Update Todo' : 'Submit'}</button>
                {editingId && (
                    <button type="button" onClick={resetForm}>Cancel</button>
                )}
            </form>

            <h1>Todo List</h1>
            {todos.length === 0 ? (
                <p>No todos available.</p>
            ) : (
                <ul>
                    {todos.map((todo) => (
                        <li key={todo._id || todo.id}>
                            <h3>{todo.title}</h3>
                            <p>{todo.description}</p>
                            <span>{todo.completed ? 'Completed' : 'Pending'}</span>
                            <button onClick={() => startEdit(todo)}>Edit</button>
                            <button onClick={() => deleteTodo(todo._id || todo.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Todo