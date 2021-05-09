import React, { useState } from 'react';
import LoginForm from 'LoginForm';

function App() {
    const [] = useState([]);
        
    return (
        <>
            <LoginForm />
            <form>
                <label>
                    E-mail:
                    <input type="text" name="email" />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <input type="submit" value="submit" />
            </form>
        </>
    )
}

export default App;