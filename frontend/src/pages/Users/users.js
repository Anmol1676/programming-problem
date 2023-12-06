import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './users.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/users');
            setUsers(response.data);
        } catch (error) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:4000/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
            fetchUsers();
        } catch (error) {
            setError(`Failed to delete user with ID ${userId}`);
            console.error(`Error deleting user ${userId}:`, error);
        }
    };


    return (
        <div className="admin-users">
        <h1>User Management</h1>
        <ul className="user-list">
            {users.map(user => (
                <li key={user.id}>
                    {user.username} - {user.classification}
                    <button className="button-delete" onClick={() => deleteUser(user.id)}>Delete</button>
                </li>
            ))}
        </ul>
    </div>
);
}

export default Users;
