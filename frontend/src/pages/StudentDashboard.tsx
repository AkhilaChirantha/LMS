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

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username;

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError("");

        if (!username) {
          setError("Username is required. Please log in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:5001/api/enrolments/byuser/${username}`
        );
        setEnrollments(response.data);
      } catch (err: any) {
        setError("Failed to load enrollments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [username]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Group enrollments by year and semester
  const groupedEnrollments = enrollments.reduce((acc, enrollment) => {
    const year = enrollment.subjectDetails?.year;
    const semester = enrollment.subjectDetails?.semester;

    if (year && semester) {
      const key = `${year}-${semester}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(enrollment);
    }

    return acc;
  }, {} as Record<string, Enrollment[]>);

  // Sort the groups by year and semester
  const sortedGroups = Object.entries(groupedEnrollments).sort(([keyA], [keyB]) => {
    const [yearA, semesterA] = keyA.split("-").map(Number);
    const [yearB, semesterB] = keyB.split("-").map(Number);
    if (yearA === yearB) {
      return semesterA - semesterB;
    }
    return yearA - yearB;
  });

  // Sort the enrollments within each group
  sortedGroups.forEach(([key, enrollmentGroup]) => {
    enrollmentGroup.sort((a, b) => {
      if (a.subjectDetails && b.subjectDetails) {
        return a.subjectDetails.subjectName.localeCompare(b.subjectDetails.subjectName);
      }
      return 0;
    });
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {username}</h1>
      <h2>Your Enrolled Subjects</h2>
      {sortedGroups.length === 0 ? (
        <p>No enrolled subjects found.</p>
      ) : (
        sortedGroups.map(([key, enrollmentGroup]) => {
          const [year, semester] = key.split("-");

          return (
            <div key={key} style={{ marginBottom: "40px" }}>
              <h3>
                Year {year}, Semester {semester}
              </h3>
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
                  {enrollmentGroup.map((enrollment, index) => (
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
            </div>
          );
        })
      )}
    </div>
  );
};

export default StudentDashboard;
