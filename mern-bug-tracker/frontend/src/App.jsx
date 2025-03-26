import { useEffect, useState } from 'react';
import './App.css'; // Importing the CSS file for styling
import { ToastContainer, toast } from 'react-toastify'; // Importing ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Importing Toastify CSS
import axios from 'axios';

function App() {
  const [bugs, setBugs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for fetching bugs
  const [error, setError] = useState(''); // State for error messages
  const [submitting, setSubmitting] = useState(false); // Loading state for submitting bugs

  useEffect(() => {
    const fetchBugs = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await axios.get('http://localhost:5000/api/bugs');
        setBugs(response.data);
      } catch (error) {
        setError('Unable to fetch bugs at this time. Please check your connection and try again.'); // Set error message
        console.error('Error fetching bugs:', error);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchBugs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Set submitting to true when submitting

    // Clear previous error messages
    setError('');

    // Client-side validation
    if (title.length < 5) {
        setError('Title must be at least 5 characters long.');
        setSubmitting(false);
        return;
    }
    if (description.length < 10) {
        setError('Description must be at least 10 characters long.');
        setSubmitting(false);
        return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/bugs', {
        title,
        description,
      });
      setBugs([...bugs, response.data]);
      setMessage('Your bug has been reported successfully! Thank you for your feedback.'); 
      setTitle('');
      setDescription('');
      // Clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error reporting bug:', error);
      setError('There was an issue reporting the bug. Please ensure all fields are filled correctly and try again.'); // Set error message
      // Clear error after 5 seconds
      setTimeout(() => setError(''), 5000);
    } finally {
      setSubmitting(false); // Set submitting to false
    }
  };

  const handleDelete = async (bugId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this bug?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/bugs/${bugId}`);
        setBugs(bugs.filter(b => b.id !== bugId));
        setMessage('The bug has been deleted successfully!'); 
        // Clear message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      } catch (error) {
        console.error('Error deleting bug:', error);
        setError('Error deleting bug. Please try again.'); // Set error message
        // Clear error after 5 seconds
        setTimeout(() => setError(''), 5000);
      }
    }
  };

  const handleStatusChange = async (bugId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bugs/${bugId}`, { status: newStatus });
      setBugs(bugs.map(b => (b.id === bugId ? { ...b, status: newStatus } : b)));
      setMessage('The bug status has been updated successfully!'); 
      // Clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error updating bug status:', error);
      setError('Error updating bug status. Please try again.'); // Set error message
      // Clear error after 5 seconds
      setTimeout(() => setError(''), 5000);
    }
  };

return (
  <div>
    <ToastContainer /> {/* Toast notifications container */}
    {loading && <p className="loading-message">Loading, please wait...</p>} {/* Loading indicator */}
          {error && <p className="error-message">{error}</p>} {/* Display error message */}


      <h1 className="title">Bug Tracker</h1>
      <div className="container">
        <form onSubmit={handleSubmit} className="bug-form">
          <input
            type="text"
            placeholder="Bug Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Bug Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit" disabled={submitting || !title.trim() || !description.trim()} aria-label="Submit bug report">
            {submitting ? 'Reporting...' : 'Report Bug'}
          </button>
        </form>
        <div className="bug-list-container">

          {loading ? (
            <p className="loading-message" role="alert">Loading bugs, please wait...</p>
          ) : (
            bugs.length > 0 ? (
              <ul className="bug-list">
                {bugs.map(bug => (
                  <li key={bug.id} className="bug-item">
                    <span className="bug-title">{bug.title}</span>: <span className="bug-description">{bug.description}</span>
                    <select
                      value={bug.status}
                      onChange={(e) => handleStatusChange(bug.id, e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <button className="delete-button" onClick={() => handleDelete(bug.id)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-bugs-message">No bugs reported yet.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
