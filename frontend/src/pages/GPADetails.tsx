import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import userImage from "../assets/user.png";

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


  // Retrieve username from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username;
  const indexNumber = user.indexNumber || "N/A"; // Assuming index number is stored in user

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
    <div style={{backgroundColor:"rgb(196, 243, 225)" }}>
    <div style={{ padding: "20px" }}>
      <div style={{ display: 'flex', flexDirection: 'column'  }}>


         {/* Navigation Bar */}
      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "30px", 
        backgroundColor: 'rgb(252, 254, 255)', 
        borderRadius: "10px", 
        marginTop:"20px",
        marginBottom: "20px", 
        boxShadow: "0 5px 8px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ color: "black", fontSize: "35px", fontWeight: "500" }}>
          <span>WELCOME! {username}</span> 
        </div>
        <div>
        <img src={user?.image || userImage} alt="User" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
        </div>
      </div>

      <div style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginBottom: '50px' 
        }}>
          <button 
        onClick={handleNavigateToPrediction}
        style={{
          padding: '12px 24px',
          backgroundColor: 'darkcyan',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
        }}
  onMouseOver={(e) => e.target.style.backgroundColor = '#1e2a47'}
  onMouseOut={(e) => e.target.style.backgroundColor = 'darkcyan'}
  onMouseDown={(e) => e.target.style.transform = 'scale(0.96)'}
  onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
>
  Prediction Page
</button>

        </div>
        
        {/* Semester-wise Table */}
        <div style={{ width: '100%', marginBottom: '20px' }}>

        <div style={{
  marginBottom: "40px", 
  background: "rgb(255, 255, 255)", 
  padding: "25px", 
  borderRadius: "10px", 
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
}}>
  <h2 style={{
    color: "#1e2a47", fontSize: "22px", marginBottom: "15px"
  }}>
    SEMESTER-WISE GPA
  </h2>
  <table style={{
    width: "100%", 
    borderCollapse: "collapse", 
    boxSizing: "border-box",
    borderRadius: "5px",
    overflow: "hidden"
}}>

<thead>
  <tr style={{ 
    backgroundColor: "cadetblue", 
    color: "#fff", 
    fontWeight: "bold" }}>
    {["Year", "Semester", "Semester GPA"].map((heading, index) => (
      <th key={index} 
      style={{ 
        border: "1px solid #ddd", 
        padding: "12px", 
        textAlign:"center"
        }}>
        {heading}
      </th>
    ))}
  </tr>
</thead>
<tbody style={{backgroundColor:"lightcyan"}}>
  {semesterGPAValues.map((semester, index, array) => {
    const isFirstOfYear = index === 0 || semester.year !== array[index - 1].year;
    const rowSpan = array.filter((s) => s.year === semester.year).length;

    return (
      <tr key={index} style={{ transition: "background-color 0.3s ease" }}>
        {isFirstOfYear && (
          <td
            rowSpan={rowSpan}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              textAlign: "center",
              verticalAlign: "middle",
              fontWeight: "bold",
            }}
          >
            {semester.year}
          </td>
        )}
        <td style={{ 
          border: "1px solid #ddd", 
          padding: "10px",
          textAlign: "center" }}>
          {semester.semester}
        </td>
        <td
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            textAlign: "center",
            color: "#1e2a47",
          }}
        >
          {semester.semGPA.toFixed(2)}
        </td>
      </tr>
    );
  })}
</tbody>

  </table>
</div>


        {/* Year-wise Table */}
        <div style={{ width: '100%', marginBottom: '20px', }}>

        <div style={{
                marginBottom: "40px", 
                background: "rgb(255, 255, 255)", 
                padding: "25px", 
                borderRadius: "10px", 
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}>


          <h2 style={{ color: "#1e2a47", fontSize: "22px", marginBottom: "15px" }}>YEAR-WISE GPA</h2>
          <table style={{
    width: "100%", 
    borderCollapse: "collapse", 
    boxSizing: "border-box",
    borderRadius: "5px",
    overflow: "hidden",
    border: "1px solid #ddd"
}}>

<thead>
  <tr style={{ 
    backgroundColor: "cadetblue", 
    color: "#fff", 
    fontWeight: "bold"
  }}>
    <th style={{ 
      border: "2px solid #ddd", 
      padding: "12px", 
      textAlign: "center"
    }}>
      Year
    </th>
    <th style={{ 
      border: "1px solid #ddd", 
      padding: "12px", 
      textAlign: "center"
    }}>
      Year GPA
    </th>
  </tr>
</thead>

<tbody style={{ backgroundColor: "lightcyan" }}>
  {yearWiseGPA.map((yearData, index) => (
    <tr key={index} style={{ transition: "background-color 0.3s ease" }}>
      <td style={{ 
        border: "1px solid #ddd", 
        padding: "10px", 
        textAlign: "center", 
        
      }}>
        {yearData.year}
      </td>
      <td style={{ 
        border: "1px solid #ddd", 
        padding: "12px", 
        textAlign: "center", 
        color: "#1e2a47" 
      }}>
        {yearData.yearGPA.toFixed(2)}
      </td>
    </tr>
  ))}
</tbody>

</table>

        </div>
        </div>

        {/* Current GPA */}
        <div style={{ width: '100%', marginTop: '20px' }}>

        <div style={{
                marginBottom: "40px", 
                background: "rgb(255, 255, 255)",  
                padding: "25px", 
                borderRadius: "12px", 
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}>

          <h2 style={{ color: "#1e2a47", fontSize: "22px", marginBottom: "15px" }}>CURRENT GPA CALCULATION</h2>
          <table
            style={{
              width: "100%", 
              borderCollapse: "collapse", 
              boxSizing: "border-box",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid #ddd"
            }}
          >
            <thead>
              <tr style={{ 
                          backgroundColor: "cadetblue", 
                          color: "#fff", 
                          fontWeight: "bold",
              border: "1px solid #ddd",
              padding: "12px"
                        }}>
                <th style={{ border: "1px solid #ddd", padding: "12px" }}>Year</th>
                <th style={{ border: "1px solid #ddd", padding: "12px" }}>Year GPA</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "lightcyan",
                    border: "1px solid #ddd", 
                    padding: "12px", 
                    textAlign: "center", 

             }}>
              {yearWiseGPA.map((yearData, index) => (
                <tr key={index} style={{ transition: "background-color 0.3s ease" }}>
                  <td style={{ border: "2px solid #ddd", padding: "10px" }}>
                    {yearData.year}
                  </td>
                  <td style={{ border: "2px solid #ddd", padding: "10px" }}>
                    {yearData.yearGPA.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={1} style={{ border: "2px solid #ddd", padding: "10px", fontWeight: 'bold' }}>
                  Current GPA
                </td>
                <td style={{ border: "2px solid #ddd", padding: "10px", fontWeight: 'bold' }}>
                  {currentGPA.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>

        {/* Final GPA */}
        <div style={{ width: '100%', marginTop: '20px' }}>
        <div style={{
                marginBottom: "40px", 
                background: "rgb(255, 255, 255)", 
                padding: "25px", 
                borderRadius: "10px", 
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}>
          <h2 style={{ color: "#1e2a47", fontSize: "22px", marginBottom: "15px" }}>FINAL GPA CALCULATION</h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ddd",
            }}
          >
            <thead>
              <tr
               style={{ 
                backgroundColor: "cadetblue", 
                color: "#fff", 
                fontWeight: "bold",
    
    padding: "12px"
              }}
              >
                <th style={{ border: "2px solid #ddd", padding: "10px" }}>Year</th>
                <th style={{ border: "2px solid #ddd", padding: "10px" }}>Year GPA</th>
                <th style={{ border: "2px solid #ddd", padding: "10px" }}>Weight</th>
                <th style={{ border: "2px solid #ddd", padding: "10px" }}>Weighted GPA</th>
              </tr>
            </thead>
            <tbody
            style={{ backgroundColor: "lightcyan",
              border: "2px solid #ddd", 
              padding: "12px", 
              textAlign: "center", 

       }}
            >
              {yearWiseGPA.map((yearData, index) => {
                const weights = [10, 20, 30, 40];
                const weightedGPA = yearData.yearGPA * (weights[index] / 100);
                return (
                  <tr key={index}>
                    <td style={{border: "2px solid #ddd", padding: "10px" }}>
                      {yearData.year}
                    </td>
                    <td style={{ border: "2px solid #ddd", padding: "10px" }}>
                      {yearData.yearGPA.toFixed(2)}
                    </td>
                    <td style={{ border: "2px solid #ddd", padding: "10px" }}>
                      {weights[index]}%
                    </td>
                    <td style={{ border: "2px solid #ddd", padding: "10px" }}>
                      {weightedGPA.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={3} style={{ border: "2px solid #ddd", padding: "10px", fontWeight: 'bold' }}>
                  Final GPA
                </td>
                <td style={{ border: "2px solid #ddd", padding: "10px", fontWeight: 'bold' }}>
                  {finalGPA.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default GPAdetails;