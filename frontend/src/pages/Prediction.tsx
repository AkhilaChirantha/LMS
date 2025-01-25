import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

interface SemesterGPA {
  semGPA: number;
  year: string;
  semester: string;
}

interface YearGPA {
  year: string;
  yearGPA: number;
}

const calculateYearWiseGPA = (semesterGPAValues: SemesterGPA[]): YearGPA[] => {
  const yearGPAMap = new Map<string, number[]>();

  semesterGPAValues.forEach(semester => {
    if (!yearGPAMap.has(semester.year)) {
      yearGPAMap.set(semester.year, []);
    }
    yearGPAMap.get(semester.year)?.push(semester.semGPA);
  });

  const yearGPAs: YearGPA[] = [];
  yearGPAMap.forEach((semGPAs, year) => {
    const yearGPA = semGPAs.reduce((sum, gpa) => sum + gpa, 0) / semGPAs.length;
    yearGPAs.push({ year, yearGPA });
  });

  return yearGPAs.sort((a, b) => Number(a.year) - Number(b.year));
};

const calculateCurrentGPA = (yearWiseGPA: YearGPA[]): number => {
  const nonZeroYearGPAs = yearWiseGPA.filter(yearData => yearData.yearGPA > 0);
  const totalYearGPA = nonZeroYearGPAs.reduce((sum, yearData) => sum + yearData.yearGPA, 0);
  return nonZeroYearGPAs.length > 0 ? totalYearGPA / nonZeroYearGPAs.length : 0;
};

  const getDegreeClassification = (currentGPA: number): string => {
    if (currentGPA >= 3.7) return "First Class Degree";
    if (currentGPA >= 3.2) return "Second Upper Class Degree";
    if (currentGPA >= 2.7) return "Second Lower Class Degree";
    if (currentGPA >= 2.0) return "General Class Degree";
    return "Below Degree Classification";
  }

  const calculateGPAToNextClass = (currentGPA: number): { 
    currentClass: string, 
    nextClass: string | null, 
    requiredGPA: number | null 
  } => {
    // Determine current classification
    let currentClass = "";
    let nextClass: string | null = null;
    let nextClassThreshold = 0;
  
    if (currentGPA >= 3.7) {
      currentClass = "First Class Degree";
      nextClass = null; // Already at the highest classification
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
  
    // Calculate required GPA for next class
    // Assuming one more semester will be added to the current GPA calculation
    const requiredGPA = (
      (nextClassThreshold * (currentGPA < 1 ? 1 : 2)) - currentGPA
    );
  
    return {
      currentClass,
      nextClass,
      requiredGPA: requiredGPA > 0 ? requiredGPA : null
    };
  };


  const CurrentGPATable: React.FC<{ yearWiseGPA: YearGPA[] }> = ({ yearWiseGPA }) => {
    const currentGPA = calculateCurrentGPA(yearWiseGPA);
    const degreeClass = getDegreeClassification(currentGPA);
    const gpaPrediction = calculateGPAToNextClass(currentGPA);

  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <h2>Current GPA Calculation</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "10px" }}>Year</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>Year GPA</th>
          </tr>
        </thead>
        <tbody>
          {yearWiseGPA.map((yearData, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid black", padding: "10px" }}>
                {yearData.year}
              </td>
              <td style={{ border: "1px solid black", padding: "10px" }}>
                {yearData.yearGPA.toFixed(2)}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={1} style={{ border: "1px solid black", padding: "10px", fontWeight: 'bold' }}>
              Current GPA
            </td>
            <td style={{ border: "1px solid black", padding: "10px", fontWeight: 'bold' }}>
              {currentGPA.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
     
      <div style={{ marginTop: '20px' }}>
        <div>Degree Classification: <strong style={{color:'blue'}}>{degreeClass}</strong></div>
        
        {gpaPrediction.nextClass && gpaPrediction.requiredGPA !== null ? (
          <div style={{ marginTop: '10px', color: 'green' }}>
            To reach {gpaPrediction.nextClass}, you need to score at least {gpaPrediction.requiredGPA.toFixed(2)} GPA in the next semester.
          </div>
        ) : (
          <div style={{ marginTop: '10px', color: 'green' }}>
            You are already at the highest degree classification!
          </div>
        )}
      </div>
    </div>
    
  );
};

const PredictionPage: React.FC = () => {
  const location = useLocation();

  const semesterGPAValues: SemesterGPA[] = location.state?.semesterGPAValues || [];

  const yearWiseGPA = useMemo(() => {
    return calculateYearWiseGPA(semesterGPAValues);
  }, [semesterGPAValues]);

  if (semesterGPAValues.length === 0) {
    return (
      <p>No GPA details available. Please navigate from the dashboard to view details.</p>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Prediction Page</h1>
      
      {/* Current GPA Table */}
      <CurrentGPATable yearWiseGPA={yearWiseGPA} />

    
    </div>
    
  );
};

export default PredictionPage;