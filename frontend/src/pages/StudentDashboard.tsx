import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserImage from "../assets/user.png";

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
  const indexNumber = user.indexNumber || "N/A"; // Assuming index number is stored in user

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

  // Handle navigation to the GPA Details page
  const handleViewDetails = (semesterGPAValues: { year: string; semester: string; semGPA: number }[]) => {
    navigate("/gpadetails", {
      state: { semesterGPAValues },
    });
  };

  return (
    <div style={{
      padding: "20px", 
      background: 'linear-gradient(135deg,rgb(96, 161, 158), #FFFFFFFF)' ,
      minHeight: "100vh",
      
    }}>
      {/* Navigation Bar */}
      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "20px", 
        backgroundColor: "#E0F7FA", 
        borderRadius: "10px", 
        marginBottom: "20px", 
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ color: "Black", fontSize: "35px", fontWeight: "500" }}>
          <span>WELCOME! {username}</span> 
        </div>
        <div>
          <img src={user?.image || UserImage} alt="" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
        </div>
      </div>

      {sortedGroups.length === 0 ? (
        <p style={{ fontSize: "18px", color: "#333", fontWeight: "300" }}>No enrolled subjects found.</p>
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
              <div key={key} style={{
                marginBottom: "40px", 
                background: "#fff", 
                padding: "25px", 
                borderRadius: "10px", 
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}>
                <h3 style={{ color: "#1e2a47", fontSize: "22px", marginBottom: "15px" }}>
                  Year {year}, Semester {semester}
                </h3>
                <table style={{
                  width: "100%", 
                  borderCollapse: "collapse", 
                  backgroundColor: "#f9f9f9", 
                  borderRadius: "12px", 
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
                }}>
                  <thead>
  <tr>
    <th style={{ border: "2px solid #ddd", padding: "12px", backgroundColor: "powderblue", textAlign: "center" }}>Subject ID</th>
    <th style={{ border: "2px solid #ddd", padding: "12px", backgroundColor: "powderblue", textAlign: "center" }}>Subject Name</th>
    <th style={{ border: "2px solid #ddd", padding: "12px", backgroundColor: "powderblue", textAlign: "center" }}>Credits</th>
    <th style={{ border: "2px solid #ddd", padding: "12px", backgroundColor: "powderblue", textAlign: "center" }}>Grade</th>
    <th style={{ border: "2px solid #ddd", padding: "12px", backgroundColor: "powderblue", textAlign: "center" }}>GPA Value</th>
  </tr>
</thead>
<tbody>
  {enrollmentGroup.map((enrollment, index) => (
    <tr key={index}>
      <td style={{ border: "2px solid #ddd", padding: "12px", textAlign: "center" }}>
        {enrollment.subjectDetails?.subjectId || "N/A"}
      </td>
      <td style={{ border: "2px solid #ddd", padding: "12px", textAlign: "center" }}>
        {enrollment.subjectDetails?.subjectName || "N/A"}
      </td>
      <td style={{ border: "2px solid #ddd", padding: "12px", textAlign: "center" }}>
        {enrollment.subjectDetails?.credit || "N/A"}
      </td>
      <td style={{ border: "2px solid #ddd", padding: "12px", textAlign: "center" }}>
        {enrollment.grade || "N/A"}
      </td>
      <td style={{ border: "2px solid #ddd", padding: "12px", textAlign: "center" }}>
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
                  <p style={{ color: "red", fontSize: "18px", fontWeight: "500" }}>
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
            style={{
              backgroundColor: "darkcyan",
              color: "white",
              padding: "12px 25px",
              fontSize: "16px",
              border: "2px solid #1c1c3c",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              marginTop: "20px",
              boxShadow: "0 4px 6px hsla(210, 2.60%, 54.90%, 0.10)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "onClick";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "onClick";
              e.currentTarget.style.transform = "scale(1)";
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
