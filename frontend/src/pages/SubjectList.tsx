import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubjectList: React.FC = () => {
    const [subjects, setSubjects] = useState<any[]>([]);

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
        <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center' }}>Subjects</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Year</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Semester</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Subject ID</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Subject Name</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Credits</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject) => (
                        <tr key={subject._id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{subject.year}</td>
                            <td style={{ padding: '10px' }}>{subject.semester}</td>
                            <td style={{ padding: '10px' }}>{subject.subjectId}</td>
                            <td style={{ padding: '10px' }}>{subject.subjectName}</td>
                            <td style={{ padding: '10px' }}>{subject.credit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubjectList;
