import axios from 'axios';
import React, { useState } from 'react';
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
        <div style={{
            background: 'linear-gradient(135deg, #6e7a80, #e4c1f9)',
            padding: '30px 0',
            height: '100vh',
        }}>
            <div
                style={{
                    maxWidth: '600px',
                    margin: 'auto',
                    padding: '30px',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    fontFamily: 'Arial, sans-serif',
                    overflow: 'hidden',
                }}
            >
                <h2
                    style={{
                        textAlign: 'center',
                        fontSize: '28px',
                        color: '#6c5ce7',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        letterSpacing: '1px',
                    }}
                >
                    Add Subject
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#333',
                        }}>Year:</label>
                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '10px',
                                border: '2px solid #ddd',
                                backgroundColor: '#f8f8f8',
                                color: '#333',
                                transition: '0.3s',
                            }}
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
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#333',
                        }}>Semester:</label>
                        <select
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '10px',
                                border: '2px solid #ddd',
                                backgroundColor: '#f8f8f8',
                                color: '#333',
                                transition: '0.3s',
                            }}
                            required
                        >
                            <option value="">Select Semester</option>
                            <option value="1sem">1st Semester</option>
                            <option value="2sem">2nd Semester</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#333',
                        }}>Subject ID:</label>
                        <input
                            type="text"
                            name="subjectId"
                            value={formData.subjectId}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '10px',
                                border: '2px solid #ddd',
                                backgroundColor: '#f8f8f8',
                                color: '#333',
                                transition: '0.3s',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#333',
                        }}>Subject Name:</label>
                        <input
                            type="text"
                            name="subjectName"
                            value={formData.subjectName}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '10px',
                                border: '2px solid #ddd',
                                backgroundColor: '#f8f8f8',
                                color: '#333',
                                transition: '0.3s',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#333',
                        }}>Credit:</label>
                        <input
                            type="number"
                            name="credit"
                            value={formData.credit}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '10px',
                                border: '2px solid #ddd',
                                backgroundColor: '#f8f8f8',
                                color: '#333',
                                transition: '0.3s',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '18px',
                            backgroundColor: '#6c5ce7',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: '0.3s',
                        }}
                    >
                        Add Subject
                    </button>
                </form>

                {message && (
                    <p
                        style={{
                            color: '#e44d26',
                            textAlign: 'center',
                            marginTop: '10px',
                            fontWeight: '500',
                            fontSize: '14px',
                        }}
                    >
                        {message}
                    </p>
                )}

                {/* Buttons in a single row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button
                        onClick={() => navigate('/subjectlist')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4A90E2',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: '0.3s',
                            width: '48%',
                        }}
                    >
                        View Subject List
                    </button>

                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4A90E2',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: '0.3s',
                            width: '48%',
                        }}
                    >
                        Register Users
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
                            padding: '12px 20px',
                            borderRadius: '8px',
                            zIndex: 1000,
                        }}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddSubjectForm;