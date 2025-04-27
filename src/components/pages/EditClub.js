import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditClub() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState({ name: '', description: '', image: '' });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/clubs/${id}`)
      .then(res => setClub(res.data))
      .catch(err => console.error('Error loading club:', err));
  }, [id]);

  const handleChange = e => {
    setClub({ ...club, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/clubs/${id}`, club);
      alert('Club updated!');
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Edit Club Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={club.name} onChange={handleChange} placeholder="Club Name" className="border p-2 w-full" />
        <textarea name="description" value={club.description} onChange={handleChange} placeholder="Description" className="border p-2 w-full" />
        <input name="image" value={club.image} onChange={handleChange} placeholder="Image URL" className="border p-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
}
