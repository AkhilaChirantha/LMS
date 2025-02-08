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

        // ✅ Fixed: Corrected string interpolation in the API call
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

  if (loading) return <div style={{ textAlign: "center", fontSize: "20px", marginTop: "20px" }}>Loading...</div>;
  if (error) return <div style={{ textAlign: "center", color: "red", marginTop: "20px" }}>{error}</div>;

  // ✅ Fixed: Corrected string interpolation for "year" and "semester"
  const groupedEnrollments = enrollments.reduce((acc, enrollment) => {
    const year = enrollment.subjectDetails?.year;
    const semester = enrollment.subjectDetails?.semester;
    
    if (year && semester) {
      const key = `${year}-${semester}`; // ✅ Corrected template literal
      if (!acc[key]) acc[key] = [];
      acc[key].push(enrollment);
    }

    return acc;
  }, {} as Record<string, LecEnrollment[]>);

  const sortedGroups = Object.entries(groupedEnrollments).sort(([a], [b]) => {
    const [yearA, semesterA] = a.split("-").map(Number);
    const [yearB, semesterB] = b.split("-").map(Number);
    return yearA === yearB ? semesterA - semesterB : yearA - yearB;
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to right, #fef9d7, #d299c2)", padding: "20px" }}>
      <div style={{ backgroundColor: "#f8f9fa", color: "#333", textAlign: "center", padding: "15px", fontSize: "26px", fontWeight: "bold", borderRadius: "10px", margin: "20px auto", width: "70%", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", letterSpacing: "1px" }}>
        🎓 Welcome, <span style={{ color: "#e44d26", textTransform: "uppercase" }}>{username}</span> 🎉
      </div>
      <h2 style={{ textAlign: "center", color: "#555" }}>Your Enrolled Subjects</h2>
      {sortedGroups.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555", marginTop: "10px" }}>No enrolled subjects found.</p>
      ) : (
        sortedGroups.map(([key, enrollmentGroup]) => (
          <div key={key} style={{ marginTop: "20px" }}>
            <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>Year {key.split("-")[0]} - Semester {key.split("-")[1]}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "10px" }}>
                {enrollmentGroup.map((enrollment, index) => (
                  <div key={index} style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", transition: "0.3s", cursor: "pointer" }}>
                    <p style={{ fontWeight: "bold", color: "#333" }}>{enrollment.subjectDetails?.subjectName || "N/A"}</p>
                    <p style={{ fontSize: "14px", color: "#555" }}>ID: {enrollment.subjectDetails?.subjectId || "N/A"}</p>
                    <button
                      style={{ marginTop: "10px", backgroundColor: "#ff9800", color: "white", padding: "8px 15px", borderRadius: "5px", border: "none", cursor: "pointer", transition: "0.3s" }}
                      onClick={() =>
                        navigate("/addgrades", {
                          state: { subjectId: enrollment.subjectDetails?.subjectId },
                        })
                      }
                    >
                      Add Grades
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LecturerDashboard;