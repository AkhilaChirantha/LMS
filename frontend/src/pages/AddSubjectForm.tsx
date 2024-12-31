import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddSubjectForm: React.FC = () => {
    const [formData, setFormData] = useState({
        year: '',
        semester: '',
        subjectId: '',
        subjectName: '',
        credit: '',
    });
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/subjects/add', formData);
            setMessage(response.data.message);
            setOpenSnackbar(true);
            setFormData({ year: '', semester: '', subjectId: '', subjectName: '', credit: '' });
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center' }}>Add Subject</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Year:</label>
                    <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    >
                        <option value="">Select Year</option>
                        <option value="1st">1st</option>
                        <option value="2nd">2nd</option>
                        <option value="3rd">3rd</option>
                        <option value="4th">4th</option>
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Semester:</label>
                    <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    >
                        <option value="">Select Semester</option>
                        <option value="1sem">1st Semester</option>
                        <option value="2sem">2nd Semester</option>
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Subject ID:</label>
                    <input
                        type="text"
                        name="subjectId"
                        value={formData.subjectId}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Subject Name:</label>
                    <input
                        type="text"
                        name="subjectName"
                        value={formData.subjectName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Credit:</label>
                    <input
                        type="number"
                        name="credit"
                        value={formData.credit}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '16px',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Add Subject
                </button>
            </form>

            {message && (
                <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
                    {message}
                </p>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => navigate('/subjectlist')}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    View Subject List
                </button>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => navigate('/register')}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Register Users..
                </button>
            </div>

            {openSnackbar && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#323232',
                        color: '#fff',
                        padding: '10px',
                        borderRadius: '4px',
                        zIndex: 1000,
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default AddSubjectForm;
