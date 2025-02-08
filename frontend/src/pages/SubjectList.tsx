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
<<<<<<< HEAD
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',background:'rgba(246, 177, 231, 0.2)' }}>
            <div style={{ width: '90%', maxWidth: '1000px', padding: '20px', borderRadius: '12px', boxShadow: ' 2px 4px 10px rgba(0, 0, 0, 0.2)', backgroundColor: '#f9f9f9', color: '#333', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
                <h2 style={{ color: '#008080', marginBottom: '20px' }}>Subjects</h2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
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
=======
        <div style={{
            background: 'linear-gradient(to right, #fef9d7, #d299c2)',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{ 
                maxWidth: '1000px', 
                padding: '30px', 
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontFamily: 'Arial, sans-serif',
                width: '100%',
                textAlign: 'center'
            }}>
                <h2 style={{ color: '#333', fontSize: '28px', marginBottom: '20px', fontWeight: 'bold' }}>Subjects List</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#4db8ff', color: '#ffffff' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Year</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Semester</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Subject ID</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Subject Name</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Credits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject) => (
                            <tr key={subject._id} style={{ borderBottom: '1px solid #ddd', transition: '0.3s' }}>
                                <td style={{ padding: '12px', background: '#ffffff' }}>{subject.year}</td>
                                <td style={{ padding: '12px', background: '#ffffff' }}>{subject.semester}</td>
                                <td style={{ padding: '12px', background: '#ffffff' }}>{subject.subjectId}</td>
                                <td style={{ padding: '12px', background: '#ffffff' }}>{subject.subjectName}</td>
                                <td style={{ padding: '12px', background: '#ffffff' }}>{subject.credit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '10px' }}>
                    <button onClick={() => navigate('/subjectadd')} style={buttonStyle}>Add Subject</button>
                    <button onClick={() => navigate('/enrollsubject')} style={buttonStyle}>Enroll Student</button>
                    <button onClick={() => navigate('/enrolllec')} style={buttonStyle}>Enroll Lecturer</button>
                    <button onClick={() => navigate('/removesubject')} style={{ ...buttonStyle, backgroundColor: '#e74c3c' }}>Remove Subject</button>
>>>>>>> origin/main
                </div>
            </div>
        </div>
    );
};

<<<<<<< HEAD
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
=======
const buttonStyle: React.CSSProperties = {
    padding: '12px 20px',
    backgroundColor: '#45aaf2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: '0.3s',
    textTransform: 'uppercase',
    fontWeight: 'bold',
};

export default SubjectList;
>>>>>>> origin/main
