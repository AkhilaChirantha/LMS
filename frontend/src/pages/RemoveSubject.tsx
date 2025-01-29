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
            await Promise.all(selectedSubjects.map(subjectId => axios.delete(`http://localhost:5001/api/subjects/${subjectId}`)));
            setSubjects(prevSubjects => prevSubjects.filter(subject => !selectedSubjects.includes(subject._id)));
            setSelectedSubjects([]);
            alert('Selected subjects removed successfully.');
        } catch (error) {
            console.error('Error removing subjects:', error);
            alert('Failed to remove selected subjects.');
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center' }}>Remove Subject</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Select</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Year</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Semester</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Subject ID</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Subject Name</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject) => (
                        <tr key={subject._id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>
                                <input
                                    type="checkbox"
                                    value={subject._id}
                                    checked={selectedSubjects.includes(subject._id)}
                                    onChange={() => handleCheckboxChange(subject._id)}
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
                <button type="button" onClick={handleRemoveSubjects} style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>Remove Selected Subjects</button>
            </div>
        </div>
    );
};

export default RemoveSubject;
