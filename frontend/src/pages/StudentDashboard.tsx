import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the structure for SubjectDetails and Enrollment interfaces
interface SubjectDetails {
  subjectId: string;
  subjectName: string;
  year: string;
  semester: string;
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

  // Retrieve username from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username;

  // Map grades to GPA values
  const gradeToGPA: Record<string, number> = {
    "A+": 4.0,
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "C-": 1.7,
    "D+": 1.3,
    "D": 1.0,
    "D-": 0.0,
  };

  // Function to calculate GPA value for a grade and credit
  const calculateGPA = (grade: string, credit: number) => {
    const gpa = gradeToGPA[grade] || 0;
    return gpa * credit;
  };

  const navigate = useNavigate();

  // Fetch enrollments for the logged-in user
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

  // Sort groups by year and semester
  const sortedGroups = Object.entries(groupedEnrollments).sort(([keyA], [keyB]) => {
    const [yearA, semesterA] = keyA.split("-");
    const [yearB, semesterB] = keyB.split("-");
    if (yearA === yearB) {
      return Number(semesterA) - Number(semesterB);
    }
    return Number(yearA) - Number(yearB);
  });

  // Handle navigation to the Prediction page
  const handleViewDetails = (semesterGPAValues: { year: string; semester: string; semGPA: number }[]) => {
    navigate("/prediction", {
      state: { semesterGPAValues },
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {username}</h1>
      {sortedGroups.length === 0 ? (
        <p>No enrolled subjects found.</p>
      ) : (
        <>
          {sortedGroups.map(([key, enrollmentGroup]) => {
            const [year, semester] = key.split("-");
            let totalCredits = 0;
            let totalGPA = 0;

            enrollmentGroup.forEach((enrollment) => {
              const credit = enrollment.subjectDetails?.credit || 0;
              const gpaValue = calculateGPA(enrollment.grade, credit);
              totalCredits += credit;
              totalGPA += gpaValue;
            });

            const semGPA = totalCredits > 0 ? totalGPA / totalCredits : 0;

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
                      <th style={{ border: "1px solid black", padding: "10px" }}>Credits</th>
                      <th style={{ border: "1px solid black", padding: "10px" }}>Grade</th>
                      <th style={{ border: "1px solid black", padding: "10px" }}>GPA Value</th>
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
                          {enrollment.subjectDetails?.credit || "N/A"}
                        </td>
                        <td style={{ border: "1px solid black", padding: "10px" }}>
                          {enrollment.grade || "N/A"}
                        </td>
                        <td style={{ border: "1px solid black", padding: "10px" }}>
                          {enrollment.grade
                            ? calculateGPA(enrollment.grade, enrollment.subjectDetails?.credit || 0).toFixed(2)
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: "15px" }}>
                  <p>Total GPA: {totalGPA.toFixed(2)}</p>
                  <p>Total Credits: {totalCredits}</p>
                  <p style={{ color: "blue", fontSize: "20px" }}>
                    Semester Final GPA: {semGPA.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
          <button
            onClick={() => {
              const semesterGPAValues = sortedGroups.map(([key, enrollmentGroup]) => {
                const [year, semester] = key.split("-");
                let totalCredits = 0;
                let totalGPA = 0;

                enrollmentGroup.forEach((enrollment) => {
                  const credit = enrollment.subjectDetails?.credit || 0;
                  const gpaValue = calculateGPA(enrollment.grade, credit);
                  totalCredits += credit;
                  totalGPA += gpaValue;
                });

                const semGPA = totalCredits > 0 ? totalGPA / totalCredits : 0;
                return { year, semester, semGPA };
              });
              handleViewDetails(semesterGPAValues);
            }}
          >
            View All Semester GPA Details
          </button>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;