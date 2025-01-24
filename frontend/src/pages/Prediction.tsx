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

const Prediction: React.FC = () => {
  const location = useLocation();

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

  // Check if no data is available
  if (semesterGPAValues.length === 0) {
    return (
      <p>No GPA details available. Please navigate from the dashboard to view details.</p>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Semester-wise Table */}
        <div style={{ width: '45%' }}>
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
        <div style={{ width: '45%' }}>
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
      </div>
    </div>
  );
};

export default Prediction;