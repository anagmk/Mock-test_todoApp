import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData || `HTTP ${response.status}`);
            }
            const data = await response.json();
            console.log(data)
            localStorage.setItem('token', data.token)
            navigate('/todo')
        } catch (error) {
            console.error("Login failed:", error.message)
        }

    }

    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />

                <label htmlFor="password">password</label>
                <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Login