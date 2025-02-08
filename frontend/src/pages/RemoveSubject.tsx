import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RemoveSubject: React.FC = () => {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/subjects');
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, []);

    const handleCheckboxChange = (subjectId: string) => {
        setSelectedSubjects((prevSelected) => 
            prevSelected.includes(subjectId)
                ? prevSelected.filter(id => id !== subjectId)
                : [...prevSelected, subjectId]
        );
    };

    const handleRemoveSubjects = async () => {
        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject to remove.');
            return;
        }
        
        try {
            await Promise.all(selectedSubjects.map(subjectId => axios.delete(`http://localhost:5001/api/subjects/remove/${subjectId}`)));
            setSubjects(prevSubjects => prevSubjects.filter(subject => !selectedSubjects.includes(subject._id)));
            setSelectedSubjects([]);
            alert('Selected subjects removed successfully.');
        } catch (error) {
            console.error('Error removing subjects:', error);
            alert('Failed to remove selected subjects.');
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(to right, #fef9d7, #d299c2)',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                maxWidth: '900px',
                width: '100%',
                textAlign: 'center'
            }}>
                <h2 style={{ color: '#333', fontWeight: 'bold', marginBottom: '20px' }}>Remove Subject</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#4db8ff', color: 'white' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Select</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Year</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Semester</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Subject ID</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Subject Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject) => (
                            <tr key={subject._id} style={{ backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <td style={{ padding: '10px' }}>
                                    <input
                                        type="checkbox"
                                        value={subject._id}
                                        checked={selectedSubjects.includes(subject._id)}
                                        onChange={() => handleCheckboxChange(subject._id)}
                                        style={{ marginRight: '10px' }}
                                    />
                                </td>
                                <td style={{ padding: '10px' }}>{subject.year}</td>
                                <td style={{ padding: '10px' }}>{subject.semester}</td>
                                <td style={{ padding: '10px' }}>{subject.subjectId}</td>
                                <td style={{ padding: '10px' }}>{subject.subjectName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        type="button"
                        onClick={handleRemoveSubjects}
                        style={{
                            padding: '12px 20px',
                            backgroundColor: '#4db8ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Remove Selected Subjects
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemoveSubject;
