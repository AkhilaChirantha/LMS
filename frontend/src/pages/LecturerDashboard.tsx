import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SubjectDetails {
  subjectId: string;
  subjectName: string;
  year: string;
  semester: string;
  credit: number;
}

interface LecEnrollment {
  username: string;
  subjectId: string;
  subjectDetails: SubjectDetails | null;
  grade: string;
}

const LecturerDashboard: React.FC = () => {
  const [enrollments, setEnrollments] = useState<LecEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
          `http://localhost:5001/api/lecenrollments/bylecturer/${username}`
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
  }, {} as Record<string, LecEnrollment[]>);

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
    <div
  style={{
    backgroundImage: 'linear-gradient(90deg,rgb(37, 85, 217),rgb(32, 151, 225))',
    minHeight: "100vh",
    padding: "20px",
  }}
>
      <div
        style={{
          backgroundColor: " #303030",
          color: "white",
          textAlign: "center",
          padding: "15px",
          fontSize: "24px",
          fontWeight: "bold",
          borderRadius: "15px",
          margin: "20px auto",
          width: "60%",
        }}
      >
        Welcome, {username}
      </div>
      <h2 style={{ textAlign: "center" }}>Your Enrolled Subjects</h2>
      {sortedGroups.length === 0 ? (
        <p style={{ textAlign: "center" }}>No enrolled subjects found.</p>
      ) : (
        sortedGroups.map(([key, enrollmentGroup]) => {
          return (
            <div key={key} style={{ marginBottom: "40px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  backgroundColor: "#ededf1",
                  borderRadius: "10px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#aaacaa", color: "white" }}>
                    <th style={{ border: "1px solid black", padding: "10px" }}>Subject ID</th>
                    <th style={{ border: "1px solid black", padding: "10px" }}>Subject Name</th>
                    <th style={{ border: "1px solid black", padding: "10px" }}>Add Grades</th>
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
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "10px",
                          textAlign: "center",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            navigate("/addgrades", {
                              state: { subjectId: enrollment.subjectDetails?.subjectId },
                            })
                          }
                          style={{
                            backgroundColor: "#23dc26",
                            color: "white",
                            border: "none",
                            padding: "8px 15px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Go
                        </button>
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

export default LecturerDashboard;
