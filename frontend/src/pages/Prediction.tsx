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


// First Section --In this section shows all the content. here is the place that calling the following sections.
const PredictionPage: React.FC = () => {
  const location = useLocation();
  const semesterGPAValues: SemesterGPA[] = location.state?.semesterGPAValues || [];
  const [requiredGPA, setRequiredGPA] = useState<number | null>(null);

  if (semesterGPAValues.length === 0) {
    return <p>No GPA details available. Please navigate from the dashboard to view details.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Prediction Page</h1>
      <CurrentGPATable semesterGPAValues={semesterGPAValues} setRequiredGPA={setRequiredGPA} />
      <Prediction semesterGPAValues={semesterGPAValues} requiredGPA={requiredGPA} />
    </div>
  );
};

// 2 nd Section -- here is the code that creating functionalities and interface.
const CurrentGPATable: React.FC<{ semesterGPAValues: SemesterGPA[], setRequiredGPA: (gpa: number | null) => void }> = ({ semesterGPAValues, setRequiredGPA }) => {
  const [nextSemesterSubjects, setNextSemesterSubjects] = useState<Subject[]>([]);

  const currentGPA = useMemo(() => {
    const validSemesters = semesterGPAValues.filter((sem) => sem.semGPA > 0);
    const totalGPA = validSemesters.reduce((sum, sem) => sum + sem.semGPA, 0);
    return validSemesters.length > 0 ? totalGPA / validSemesters.length : 0;
  }, [semesterGPAValues]);

  const calculateGPAToNextClass = (currentGPA: number): number | null => {
    if (currentGPA >= 3.7) return null;
    if (currentGPA >= 3.2) return (3.7 * 2 - currentGPA);
    if (currentGPA >= 2.7) return (3.2 * 2 - currentGPA);
    if (currentGPA >= 2.0) return (2.7 * 2 - currentGPA);
    return (2.0 * 2 - currentGPA);
  };

  const requiredGPA = calculateGPAToNextClass(currentGPA);
  useEffect(() => { setRequiredGPA(requiredGPA); }, [requiredGPA, setRequiredGPA]);



  const nextSemester = useMemo(() => {
    if (semesterGPAValues.length === 0) return null;
    const zeroGPASemester = semesterGPAValues.find(sem => sem.semGPA === 0);
    if (zeroGPASemester) {
      return { year: zeroGPASemester.year, semester: zeroGPASemester.semester };
    }
    const sortedSemesters = [...semesterGPAValues].sort((a, b) => {
      if (a.year !== b.year) return parseInt(a.year) - parseInt(b.year);
      return a.semester === 'First' ? -1 : 1;
    });
    const lastSemester = sortedSemesters[sortedSemesters.length - 1];
    let nextYear = lastSemester.year;
    let nextSemesterName = 'Second';
    if (lastSemester.semester === 'Second') {
      nextYear = (parseInt(lastSemester.year) + 1).toString();
      nextSemesterName = 'First';
    }
    return { year: nextYear, semester: nextSemesterName };
  }, [semesterGPAValues]);

  useEffect(() => {
    const fetchNextSemesterSubjects = async () => {
      if (!nextSemester) return;
      try {
        const response = await axios.get<Subject[]>('http://localhost:5001/api/subjects/sem', {
          params: { year: nextSemester.year, semester: nextSemester.semester }
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


  const getClass = (gpa: number) => {
    if (gpa >= 3.7) return "First Class";
    if (gpa >= 3.2) return "Second Upper";
    if (gpa >= 2.7) return "Second Lower";
    if (gpa >= 2.0) return "General";
    return "Fail";
  };

  const getNextClass = (gpa: number) => {
    if (gpa >= 3.7) return null;
    if (gpa >= 3.2) return "First Class";
    if (gpa >= 2.7) return "Second Upper";
    if (gpa >= 2.0) return "Second Lower";
    return "General";
  };


  const currentClass = getClass(currentGPA);
  const nextClass = getNextClass(currentGPA);

  return (
<div style={{ width: "100%", marginTop: "20px", fontFamily: "Arial, sans-serif", color: "#333" }}>
  <h3 style={{ textAlign: "center", color: "#007bff", marginBottom: "20px" }}>
    Semester-Wise GPA Calculation
  </h3>

  <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
    <thead>
      <tr style={{ backgroundColor: "#007bff", color: "white" }}>
        <th style={{ padding: "12px", border: "1px solid #ddd" }}>Year</th>
        <th style={{ padding: "12px", border: "1px solid #ddd" }}>Semester</th>
        <th style={{ padding: "12px", border: "1px solid #ddd" }}>Semester GPA</th>
        <th style={{ padding: "12px", border: "1px solid #ddd" }}>Year GPA</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(yearWiseData).flatMap(([year, data]) =>
        data.semesters.map((sem, index) => (
          <tr key={`${year}-${sem.semester}`} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white", textAlign: "center" }}>
            {index === 0 && (
              <td rowSpan={data.semesters.length} style={{ padding: "12px", border: "1px solid #ddd", fontWeight: "bold" }}>
                {year}
              </td>
            )}
            <td style={{ padding: "12px", border: "1px solid #ddd" }}>{sem.semester}</td>
            <td style={{ padding: "12px", border: "1px solid #ddd", fontWeight: "bold", color: "#28a745" }}>
              {sem.semGPA.toFixed(2)}
            </td>
            {index === 0 && (
              <td rowSpan={data.semesters.length} style={{ padding: "12px", border: "1px solid #ddd", fontWeight: "bold", color: "#dc3545" }}>
                {data.yearGPA.toFixed(2)}
              </td>
            )}
          </tr>
        ))
      )}
      <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
        <td colSpan={3} style={{ padding: "12px", border: "1px solid #ddd", paddingLeft:'30px',backgroundColor:'#cbc8cb' }}>
          Cumulative GPA
        </td>
        <td style={{ padding: "12px", border: "1px solid #ddd", color: "#007bff", textAlign: "center", backgroundColor:'#cbc8cb'  }}>
          {currentGPA.toFixed(2)}
        </td>
      </tr>
    </tbody>
  </table>

  <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
    <p style={{ fontSize: "18px" }}>
      The Current GPA Value is 
      <span style={{ fontSize: "22px", fontWeight: "bold", color: "#007bff", }}> {currentGPA.toFixed(2)} </span>
      Current Class of Degree is <span style={{ fontSize: "22px", fontWeight: "bold", color: "#007bff", }}>{currentClass}</span>
    </p>
    {requiredGPA !== null ? (
      <p style={{ fontSize: "16px", color: "#6c757d" }}>
        You can Achieve <span style={{ fontSize: "20px", fontWeight: "bold", color: "#28a745" }}>{nextClass}</span> degree in next Semester.
        For that you need a GPA of <span style={{ fontSize: "20px", fontWeight: "bold", color: "#28a745" }}>{requiredGPA.toFixed(2)}</span>
      </p>
    ) : (
      <p style={{ fontSize: "16px", color: "#6c757d" }}>You are already at the highest degree classification.</p>
    )}
  </div>

  {/* Next Semester Subjects Section */}
  <div style={{ marginTop: "20px" }}>
    <h3 style={{ color: "#007bff", marginBottom: "15px" }}>
      Next Semester Subjects ({nextSemester?.year} {nextSemester?.semester})
    </h3>
    {nextSemesterSubjects.length > 0 ? (
      <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
        <thead>
          <tr style={{ backgroundColor: "#28a745", color: "white" }}>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>Subject ID</th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>Subject Name</th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>Credits</th>
          </tr>
        </thead>
        <tbody>
          {nextSemesterSubjects.map((subject, index) => (
            <tr key={subject.subjectId} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white", textAlign: "center" }}>
              <td style={{ padding: "12px", border: "1px solid #ddd", fontWeight: "bold" }}>{subject.subjectId}</td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>{subject.subjectName}</td>
              <td style={{ padding: "12px", border: "1px solid #ddd", fontWeight: "bold", color: "#28a745" }}>{subject.credit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p style={{ fontSize: "16px", color: "#6c757d" }}>No subjects found for the next semester.</p>
    )}
  </div>
</div>

  
  );
};



// 3 rd Section -- This section is used for the prediction to the next semester credits.
const Prediction: React.FC<{ semesterGPAValues: SemesterGPA[], requiredGPA: number | null }>= ({ semesterGPAValues, requiredGPA }) => { 
  const [nextSemesterSubjects, setNextSemesterSubjects] = useState<Subject[]>([]);
  const [filteredCombinations, setFilteredCombinations] = useState<
    { combination: string[]; totalPoints: number; gpa: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const nextSemester = useMemo(() => {
    if (semesterGPAValues.length === 0) return null;

    const zeroGPASemester = semesterGPAValues.find(sem => sem.semGPA === 0);
    if (zeroGPASemester) {
      return { year: zeroGPASemester.year, semester: zeroGPASemester.semester };
    }

    const sortedSemesters = [...semesterGPAValues].sort((a, b) => {
      if (a.year !== b.year) return parseInt(a.year) - parseInt(b.year);
      return a.semester === 'First' ? -1 : 1;
    });

    const lastSemester = sortedSemesters[sortedSemesters.length - 1];
    
    let nextYear = lastSemester.year;
    let nextSemesterName = 'Second';

    if (lastSemester.semester === 'Second') {
      nextYear = (parseInt(lastSemester.year) + 1).toString();
      nextSemesterName = 'First';
    }

    return { year: nextYear, semester: nextSemesterName };
  }, [semesterGPAValues]);

  const grades: { [key: string]: number } = {
    "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0,
  };

  const totalCredits = useMemo(() => {
    return nextSemesterSubjects.reduce((sum, subject) => sum + subject.credit, 0);
  }, [nextSemesterSubjects]);

  const calculateTotalPoints = (combination: string[]): number => {
    return combination.reduce((total, grade, index) => {
      const credit = nextSemesterSubjects[index]?.credit || 0;
      return total + (grades[grade] || 0) * credit;
    }, 0);
  };

  const generateGradeCombinations = (gradesList: string[], repeat: number): string[][] => {
    if (repeat === 0) return [[]];
    const smallerCombinations = generateGradeCombinations(gradesList, repeat - 1);
    return gradesList.flatMap(grade => smallerCombinations.map(combination => [grade, ...combination]));
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!nextSemester) return;
      try {
        setIsLoading(true);
        const response = await axios.get<Subject[]>('http://localhost:5001/api/subjects/sem', {
          params: { year: nextSemester.year, semester: nextSemester.semester }
        });
        setNextSemesterSubjects(response.data);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubjects();
  }, [nextSemester]);

  useEffect(() => {
    if (nextSemesterSubjects.length === 0) return;
    const gradesList = Object.keys(grades);
    const gradeCombinations = generateGradeCombinations(gradesList, nextSemesterSubjects.length);

    const calculatedResults = gradeCombinations.map((combination) => {
      const totalPoints = calculateTotalPoints(combination);
      const gpa = totalPoints / totalCredits;
      return { combination, totalPoints, gpa };
    });

    let filteredResults = calculatedResults;
    if (requiredGPA !== null) {
      const higherMatches = calculatedResults.filter(result => result.gpa >= requiredGPA);
      if (higherMatches.length > 0) {
        const minHigherGPA = Math.min(...higherMatches.map(result => result.gpa));
        filteredResults = higherMatches.filter(result => result.gpa === minHigherGPA);
      } else {
        filteredResults = [];
      }
    }
    setFilteredCombinations(filteredResults);
  }, [nextSemesterSubjects, requiredGPA]);

  if (isLoading) return <div>Loading subjects and generating grade combinations...</div>;
  if (nextSemesterSubjects.length === 0) return <div>No subjects found for the next semester.</div>;

  return (
    <div>
      <h2 style={{ fontSize: '30px', paddingTop: '50px', fontFamily: 'Gotu', color: 'red' }}>
        Prediction Combination
      </h2>
      <p>Number of subjects: {nextSemesterSubjects.length}</p>
      <p>Total credits: {totalCredits}</p>
      {requiredGPA !== null && <p>Required GPA for next classification: {requiredGPA.toFixed(2)}</p>}

      <div style={{ fontFamily: 'Gotu', fontSize: '20px', color: 'red' }}>To Achieve that GPA, You should achieve this Target in your next Semester. </div>
      <table border={1} style={{ width: '100%', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
          <tr >
            <th>Subject</th>
            <th>Credit</th>
            <th>Grade</th>
            <th>GPA</th>
          </tr>
        </thead>
        <br></br>
        <tbody>
          {filteredCombinations.length > 0 ? (
            filteredCombinations.map((result, index) => (
              <React.Fragment key={index}>
                {nextSemesterSubjects.map((subject, i) => (
                  <tr key={`${index}-${i}`}>
                    <td>{subject.subjectName}</td>
                    <td>{subject.credit}</td>
                    <td>{result.combination[i]}</td>
                    {i === 0 && (
                      <td rowSpan={nextSemesterSubjects.length}>{result.gpa.toFixed(2)}</td>
                    )}
                  </tr>
                ))}
                <br/>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>
                No matching grade combinations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p>Total filtered grade combinations: {filteredCombinations.length}</p>
    </div>
  );
};










export default PredictionPage;