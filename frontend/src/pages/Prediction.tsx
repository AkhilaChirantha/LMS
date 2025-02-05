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

  if (semesterGPAValues.length === 0) {
    return <p>No GPA details available. Please navigate from the dashboard to view details.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Prediction Page</h1>
        <CurrentGPATable semesterGPAValues={semesterGPAValues} />
        <Prediction semesterGPAValues={semesterGPAValues} />
    </div>
  );
};

// 2 nd Section -- here is the code that creating functionalities and interface.
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
    const totalSemesters = useMemo(() => {
      const uniqueSemesters = new Set(
        semesterGPAValues.map((sem) => `${sem.year}-${sem.semester}`)
      );
      return uniqueSemesters.size;
    }, [semesterGPAValues]); 

    const requiredGPA = (nextClassThreshold * totalSemesters  ) - currentGPA ;

    return {
      currentClass,
      nextClass,
      requiredGPA: requiredGPA > 0 ? requiredGPA : null,
    };
  };

  const degreeClassification = getDegreeClassification(currentGPA);
  const { nextClass, requiredGPA } = calculateGPAToNextClass(currentGPA);

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


// 3 rd Section -- This section is used for the prediction to the next semester credits.
const Prediction: React.FC<{ semesterGPAValues: SemesterGPA[] }>= ({semesterGPAValues}) => { 
  const [nextSemesterSubjects, setNextSemesterSubjects] = useState<Subject[]>([]);
  const [allCombinations, setAllCombinations] = useState<
    { combination: string[]; totalPoints: number; gpa: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Determine next semester
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

  // Grade mapping
  const grades: { [key: string]: number } = {
    A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0,
  };

  // Compute total credits
  const totalCredits = useMemo(() => {
    return nextSemesterSubjects.reduce((sum, subject) => sum + subject.credit, 0);
  }, [nextSemesterSubjects]);

  // Calculate total points
  const calculateTotalPoints = (combination: string[]): number => {
    return combination.reduce((total, grade, index) => {
      const credit = nextSemesterSubjects[index]?.credit || 0;
      return total + (grades[grade] || 0) * credit;
    }, 0);
  };

  // Generate all possible grade combinations
  const generateGradeCombinations = (gradesList: string[], repeat: number): string[][] => {
    if (repeat === 0) return [[]];
    const smallerCombinations = generateGradeCombinations(gradesList, repeat - 1);
    return gradesList.flatMap(grade => smallerCombinations.map(combination => [grade, ...combination]));
  };

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!nextSemester) return;

      try {
        setIsLoading(true);
        const response = await axios.get<Subject[]>('http://localhost:5001/api/subjects/sem', {
          params: { year: nextSemester.year, semester: nextSemester.semester }
        });

        console.log('Fetched subjects:', response.data);
        setNextSemesterSubjects(response.data);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [nextSemester]);

  // Generate all grade combinations when subjects are available
  useEffect(() => {
    if (nextSemesterSubjects.length === 0) return;

    const gradesList = Object.keys(grades);
    const gradeCombinations = generateGradeCombinations(gradesList, nextSemesterSubjects.length);

    console.log('Generated combinations:', gradeCombinations.length);

    // Calculate GPA for each combination
    const calculatedResults = gradeCombinations.map((combination) => {
      const totalPoints = calculateTotalPoints(combination);
      const gpa = totalPoints / totalCredits;
      return { combination, totalPoints, gpa };
    });

    console.log('Generated all grade combinations:', calculatedResults);
    setAllCombinations(calculatedResults);
  }, [nextSemesterSubjects]);

  if (isLoading) {
    return <div>Loading subjects and generating grade combinations...</div>;
  }

  if (nextSemesterSubjects.length === 0) {
    return <div>No subjects found for the next semester.</div>;
  }

  return (
    <div>
      <div style={{ fontSize: '30px', paddingTop: '50px', fontFamily: 'Gotu', color: 'red' }}>
        Prediction Combination
      </div>
      <div>
        <p>Number of subjects: {nextSemesterSubjects.length}</p>
        <p>Total credits: {totalCredits}</p>
      </div>
      <table border={1} style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Credit</th>
            <th>Grade</th>
            <th>GPA</th>
          </tr>
        </thead>
        <tbody>
          {allCombinations.length > 0 ? (
            allCombinations.map((result, index) => (
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
                <br></br>
                <tr className="h-4" />
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No grade combinations generated.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p>Total grade combinations: {allCombinations.length}</p>
    </div>
  );
};








export default PredictionPage;