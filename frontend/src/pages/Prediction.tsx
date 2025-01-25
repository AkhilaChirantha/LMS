import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';

interface SemesterGPA {
  semGPA: number;
  year: string;
  semester: string;
}

interface Subject {
  year: string;
  semester: string;
  subjectId: string;
  subjectName: string;
  credit: number;
}

const CurrentGPATable: React.FC<{ semesterGPAValues: SemesterGPA[] }> = ({ semesterGPAValues }) => {
  const [nextSemesterSubjects, setNextSemesterSubjects] = useState<Subject[]>([]);

  // Determine the next semester to fetch subjects for
  const nextSemester = useMemo(() => {
    if (semesterGPAValues.length === 0) return null;

    // Find the first semester with zero GPA
    const zeroGPASemester = semesterGPAValues.find(sem => sem.semGPA === 0);

    if (zeroGPASemester) {
      return {
        year: zeroGPASemester.year,
        semester: zeroGPASemester.semester
      };
    }

    // If no zero GPA semester, fall back to previous logic
    const sortedSemesters = [...semesterGPAValues].sort((a, b) => {
      if (a.year !== b.year) return parseInt(a.year) - parseInt(b.year);
      return a.semester === 'First' ? -1 : 1;
    });

    const lastSemester = sortedSemesters[sortedSemesters.length - 1];
    
    // Determine next semester
    let nextYear = lastSemester.year;
    let nextSemesterName = 'Second';

    // If last semester is Second, move to next year's First semester
    if (lastSemester.semester === 'Second') {
      nextYear = (parseInt(lastSemester.year) + 1).toString();
      nextSemesterName = 'First';
    }

    return { year: nextYear, semester: nextSemesterName };
  }, [semesterGPAValues]);

  // Fetch subjects for the next semester
  useEffect(() => {
    const fetchNextSemesterSubjects = async () => {
      if (!nextSemester) return;

      try {
        const response = await axios.get<Subject[]>('http://localhost:5001/api/subjects/sem', {
          params: {
            year: nextSemester.year,
            semester: nextSemester.semester
          }
        });

        setNextSemesterSubjects(response.data);
      } catch (error) {
        console.error('Failed to fetch next semester subjects:', error);
      }
    };

    fetchNextSemesterSubjects();
  }, [nextSemester]);

  // Group semesters by year with combined GPA
  const yearWiseData = useMemo(() => {
    const yearGroups: { [key: string]: { semesters: SemesterGPA[], yearGPA: number } } = {};

    semesterGPAValues.forEach(sem => {
      if (!yearGroups[sem.year]) {
        yearGroups[sem.year] = { semesters: [], yearGPA: 0 };
      }
      yearGroups[sem.year].semesters.push(sem);
    });

    // Calculate year GPA
    Object.keys(yearGroups).forEach(year => {
      const validSemesters = yearGroups[year].semesters.filter(sem => sem.semGPA > 0);
      if (validSemesters.length > 0) {
        const totalGPA = validSemesters.reduce((sum, sem) => sum + sem.semGPA, 0);
        yearGroups[year].yearGPA = totalGPA / validSemesters.length;
      }
    });

    return yearGroups;
  }, [semesterGPAValues]);

  // Calculate overall current GPA
  const currentGPA = useMemo(() => {
    const validSemesters = semesterGPAValues.filter((sem) => sem.semGPA > 0);
    const totalGPA = validSemesters.reduce((sum, sem) => sum + sem.semGPA, 0);
    return validSemesters.length > 0 ? totalGPA / validSemesters.length : 0;
  }, [semesterGPAValues]);

  const getDegreeClassification = (currentGPA: number): string => {
    if (currentGPA >= 3.7) return "First Class Degree";
    if (currentGPA >= 3.2) return "Second Upper Class Degree";
    if (currentGPA >= 2.7) return "Second Lower Class Degree";
    if (currentGPA >= 2.0) return "General Class Degree";
    return "Below Degree Classification";
  };

  const calculateGPAToNextClass = (currentGPA: number): {
    currentClass: string;
    nextClass: string | null;
    requiredGPA: number | null;
  } => {
    let currentClass = "";
    let nextClass: string | null = null;
    let nextClassThreshold = 0;

    if (currentGPA >= 3.7) {
      currentClass = "First Class Degree";
      nextClass = null;
      return { currentClass, nextClass, requiredGPA: null };
    } else if (currentGPA >= 3.2) {
      currentClass = "Second Upper Class Degree";
      nextClass = "First Class Degree";
      nextClassThreshold = 3.7;
    } else if (currentGPA >= 2.7) {
      currentClass = "Second Lower Class Degree";
      nextClass = "Second Upper Class Degree";
      nextClassThreshold = 3.2;
    } else if (currentGPA >= 2.0) {
      currentClass = "General Class Degree";
      nextClass = "Second Lower Class Degree";
      nextClassThreshold = 2.7;
    } else {
      currentClass = "Below Degree Classification";
      nextClass = "General Class Degree";
      nextClassThreshold = 2.0;
    }

    // Simplified required GPA calculation
    const requiredGPA = nextClassThreshold;

    return {
      currentClass,
      nextClass,
      requiredGPA: requiredGPA > 0 ? requiredGPA : null,
    };
  };

  const degreeClassification = getDegreeClassification(currentGPA);
  const { currentClass, nextClass, requiredGPA } = calculateGPAToNextClass(currentGPA);

  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      <h2>Semester-Wise GPA Calculation</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "10px" }}>Year</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>Semester</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>Semester GPA</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>Year GPA</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(yearWiseData).flatMap(([year, data]) => 
            data.semesters.map((sem, index) => (
              <tr key={`${year}-${sem.semester}`}>
                {index === 0 && (
                  <td 
                    style={{ border: "1px solid black", padding: "10px" }} 
                    rowSpan={data.semesters.length}
                  >
                    {year}
                  </td>
                )}
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {sem.semester}
                </td>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {sem.semGPA.toFixed(2)}
                </td>
                {index === 0 && (
                  <td 
                    style={{ border: "1px solid black", padding: "10px" }} 
                    rowSpan={data.semesters.length}
                  >
                    {data.yearGPA.toFixed(2)}
                  </td>
                )}
              </tr>
            ))
          )}
          <tr>
            <td colSpan={3} style={{ border: "1px solid black", padding: "10px", fontWeight: "bold" }}>
              Cumulative GPA
            </td>
            <td colSpan={1} style={{ border: "1px solid black", padding: "10px", fontWeight: "bold" }}>
              {currentGPA.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: "20px" }}>
        <p><strong>Degree Classification:</strong> <strong style={{color:'#ec08d8', fontSize:'20px'}}>{degreeClassification}</strong> </p>
        {nextClass && requiredGPA !== null ? (
          <p>
            To achieve a <strong>{nextClass}</strong>, you need a GPA of <strong>{requiredGPA.toFixed(2)}</strong>.
          </p>
        ) : (
          <p>You are already at the highest degree classification.</p>
        )}
      </div>

      {/* Next Semester Subjects Section */}
      <div style={{ marginTop: "20px" }}>
        <h3>Next Semester Subjects ({nextSemester?.year} {nextSemester?.semester})</h3>
        {nextSemesterSubjects.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "10px" }}>Subject ID</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Subject Name</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Credits</th>
              </tr>
            </thead>
            <tbody>
              {nextSemesterSubjects.map((subject) => (
                <tr key={subject.subjectId}>
                  <td style={{ border: "1px solid black", padding: "10px" }}>{subject.subjectId}</td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>{subject.subjectName}</td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>{subject.credit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No subjects found for the next semester.</p>
        )}
      </div>
    </div>
  );
};

const PredictionPage: React.FC = () => {
  const location = useLocation();

  const semesterGPAValues: SemesterGPA[] = location.state?.semesterGPAValues || [];

  if (semesterGPAValues.length === 0) {
    return <p>No GPA details available. Please navigate from the dashboard to view details.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Prediction Page</h1>
      <CurrentGPATable semesterGPAValues={semesterGPAValues} />
    </div>
  );
};

export default PredictionPage;