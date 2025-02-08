import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SubjectList: React.FC = () => {
    const [subjects, setSubjects] = useState<any[]>([]);
    const navigate = useNavigate();

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

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ maxWidth: '1000px', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', backgroundColor: '#f9f9f9', color: '#333', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
                <h2 style={{ color: '#008080', marginBottom: '20px' }}>Subjects</h2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <table style={{ width: '80%', borderCollapse: 'collapse', marginTop: '20px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#008080', color: '#fff', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>Year</th>
                                <th style={{ padding: '12px' }}>Semester</th>
                                <th style={{ padding: '12px' }}>Subject ID</th>
                                <th style={{ padding: '12px' }}>Subject Name</th>
                                <th style={{ padding: '12px' }}>Credits</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject, index) => (
                                <tr key={subject._id} style={{ backgroundColor: index % 2 === 0 ? '#f1f1f1' : '#fff', borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '12px' }}>{subject.year}</td>
                                    <td style={{ padding: '12px' }}>{subject.semester}</td>
                                    <td style={{ padding: '12px' }}>{subject.subjectId}</td>
                                    <td style={{ padding: '12px' }}>{subject.subjectName}</td>
                                    <td style={{ padding: '12px' }}>{subject.credit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <button style={{ ...buttonStyle, backgroundColor: '#007BFF' }} onClick={() => navigate('/subjectadd')}>Add Subject</button>
                    <button style={{ ...buttonStyle, backgroundColor: '#28A745' }} onClick={() => navigate('/enrollsubject')}>Enroll Student</button>
                    <button style={{ ...buttonStyle, backgroundColor: '#FFC107', color: '#000' }} onClick={() => navigate('/enrolllec')}>Enroll Lecturer</button>
                    <button style={{ ...buttonStyle, backgroundColor: '#DC3545' }} onClick={() => navigate('/removesubject')}>Remove Subject</button>
                </div>
            </div>
        </div>
    );
};

const buttonStyle = {
    color: '#fff',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background 0.3s ease, transform 0.2s ease',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
};

export default SubjectList;