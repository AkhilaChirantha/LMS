import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SemesterGPA {
  semGPA: number;
  year: string;
  semester: string;
}

interface YearGPA {
  year: string;
  yearGPA: number;
}

const GPAdetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve semester GPA values passed via navigation state
  const semesterGPAValues: SemesterGPA[] = location.state?.semesterGPAValues || [];

  // Calculate year-wise GPA using useMemo for performance optimization
  const yearWiseGPA = useMemo(() => {
  const yearGPAMap = new Map<string, number[]>();

    // Group semester GPAs by year
    semesterGPAValues.forEach(semester => {
      if (!yearGPAMap.has(semester.year)) {
        yearGPAMap.set(semester.year, []);
      }
      yearGPAMap.get(semester.year)?.push(semester.semGPA);
    });

    // Calculate average GPA for each year
    const yearGPAs: YearGPA[] = [];
    yearGPAMap.forEach((semGPAs, year) => {
      const yearGPA = semGPAs.reduce((sum, gpa) => sum + gpa, 0) / semGPAs.length;
      yearGPAs.push({ year, yearGPA });
    });

    return yearGPAs.sort((a, b) => Number(a.year) - Number(b.year));
  }, [semesterGPAValues]);

  // Calculate Final GPA
  const finalGPA = useMemo(() => {
    const weightedGPAs = yearWiseGPA.map((yearData, index) => {
      const weights = [10, 20, 30, 40];
      return yearData.yearGPA * (weights[index] / 100);
    });

    return weightedGPAs.reduce((sum, weightedGPA) => sum + weightedGPA, 0);
  }, [yearWiseGPA]);


    // Calculate Current GPA
    const currentGPA = useMemo(() => {
      const nonZeroYearGPAs = yearWiseGPA.filter(yearData => yearData.yearGPA > 0);
      const totalYearGPA = nonZeroYearGPAs.reduce((sum, yearData) => sum + yearData.yearGPA, 0);
      return nonZeroYearGPAs.length > 0 ? totalYearGPA / nonZeroYearGPAs.length : 0;
    }, [yearWiseGPA]);

  // Check if no data is available
  if (semesterGPAValues.length === 0) {
    return (
      <p>No GPA details available. Please navigate from the dashboard to view details.</p>
    );
  }

  const handleNavigateToPrediction = () => {
    navigate('/prediction', { 
      state: { 
        semesterGPAValues: semesterGPAValues 
      } 
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>

      <div style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginBottom: '20px' 
        }}>
          <button 
            onClick={handleNavigateToPrediction}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Go to Prediction Page
          </button>
        </div>
        
        {/* Semester-wise Table */}
        <div style={{ width: '100%', marginBottom: '20px' }}>
          <h2>Semester-wise GPA</h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "10px" }}>Year</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Semester</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Semester GPA</th>
              </tr>
            </thead>
            <tbody>
              {semesterGPAValues.map((semester, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {semester.year}
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {semester.semester}
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {semester.semGPA.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Year-wise Table */}
        <div style={{ width: '100%', marginBottom: '20px' }}>
          <h2>Year-wise GPA</h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
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
            </tbody>
          </table>
        </div>

        {/* Current GPA */}
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
        </div>

        {/* Final GPA */}
        <div style={{ width: '100%', marginTop: '20px' }}>
          <h2>Final GPA Calculation</h2>
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
                <th style={{ border: "1px solid black", padding: "10px" }}>Weight</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Weighted GPA</th>
              </tr>
            </thead>
            <tbody>
              {yearWiseGPA.map((yearData, index) => {
                const weights = [10, 20, 30, 40];
                const weightedGPA = yearData.yearGPA * (weights[index] / 100);
                return (
                  <tr key={index}>
                    <td style={{ border: "1px solid black", padding: "10px" }}>
                      {yearData.year}
                    </td>
                    <td style={{ border: "1px solid black", padding: "10px" }}>
                      {yearData.yearGPA.toFixed(2)}
                    </td>
                    <td style={{ border: "1px solid black", padding: "10px" }}>
                      {weights[index]}%
                    </td>
                    <td style={{ border: "1px solid black", padding: "10px" }}>
                      {weightedGPA.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={3} style={{ border: "1px solid black", padding: "10px", fontWeight: 'bold' }}>
                  Final GPA
                </td>
                <td style={{ border: "1px solid black", padding: "10px", fontWeight: 'bold' }}>
                  {finalGPA.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GPAdetails;