import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/ticketAPI';
import { retrieveUsers } from '../api/userAPI';
import { TicketData } from '../interfaces/TicketData';
import { UserData } from '../interfaces/UserData';

const CreateTicket = () => {
  const [newTicket, setNewTicket] = useState<TicketData>({
    id: 0,
    name: '',
    description: '',
    status: 'Todo',
    assignedUserId: 1,
    assignedUser: null
  });

  const [users, setUsers] = useState<UserData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await retrieveUsers();
        setUsers(data);
        if (data.length > 0) {
          setNewTicket(prev => ({ ...prev, assignedUserId: data[0].id || 1 }));
        }
      } catch (err) {
        console.error('Failed to retrieve users:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createTicket(newTicket);
      navigate('/');
    } catch (err) {
      console.error('Failed to create ticket:', err);
    }
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({
      ...prev,
      [name]: name === 'assignedUserId' ? parseInt(value) : value
    }));
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Create Ticket</h1>
        <label>Ticket Name</label>
        <textarea
          name='name'
          value={newTicket.name || ''}
          onChange={handleTextAreaChange}
          required
        />
        <label>Status</label>
        <select
          name='status'
          value={newTicket.status || ''}
          onChange={handleChange}
        >
          <option value='Todo'>Todo</option>
          <option value='In Progress'>In Progress</option>
          <option value='Done'>Done</option>
        </select>
        <label>Description</label>
        <textarea
          name='description'
          value={newTicket.description || ''}
          onChange={handleTextAreaChange}
          required
        />
        <label>Assigned To</label>
        <select
          name='assignedUserId'
          value={newTicket.assignedUserId || ''}
          onChange={handleChange}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        <div className='button-group'>
          <button type='submit'>Create Ticket</button>
          <button type='button' onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;