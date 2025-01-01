import React, { useEffect, useState } from "react";
import axios from "axios";

interface SubjectDetails {
  subjectId: string;
  subjectName: string;
  year: number;
  semester: number;
  credit: number;
}

interface Enrollment {
  username: string;
  subjectId: string;
  subjectDetails: SubjectDetails | null;
  grade: string;
}

const StudentDashboard: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Retrieve the logged-in user information from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Parse stored user data
  const username = user.username; // Extract the username

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError("");

        if (!username) {
          setError("Username is required. Please log in.");
          return;
        }

        console.log("Fetching enrollments for username:", username);  // Debugging log

        // Make the API request to get enrollments based on the logged-in username
        const response = await axios.get(`http://localhost:5001/api/enrolments/byuser/${username}`);
        console.log("Enrollments fetched successfully:", response.data);  // Debugging log
        setEnrollments(response.data);
      } catch (err: any) {
        console.error("Error fetching enrollments:", err);  // Log the error
        setError("Failed to load enrollments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [username]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {username}</h1>
      <h2>Your Enrolled Subjects</h2>
      {enrollments.length === 0 ? (
        <p>No enrolled subjects found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "10px" }}>Subject ID</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Subject Name</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Year</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Semester</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Credits</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {enrollment.subjectDetails?.subjectId || "N/A"}
                </td>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {enrollment.subjectDetails?.subjectName || "N/A"}
                </td>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {enrollment.subjectDetails?.year || "N/A"}
                </td>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {enrollment.subjectDetails?.semester || "N/A"}
                </td>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {enrollment.subjectDetails?.credit || "N/A"}
                </td>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {enrollment.grade || "N/A"}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentDashboard;
