import  { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBriefcase, faCalendar, faCog, faComment, faCompress, faDashboard, faHome, faLifeRing, faListAlt, faOutdent, faSearch, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faTwitterSquare, faYoutubeSquare, faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import logo from "../assets/image.png";


function HeroPage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Top Section */}
      <div
        style={{display: "flex",alignItems: "center",backgroundColor: "#114f3c",padding: "4px",}}>
        {/* Notification Icon */}
        <div style={{ position: "relative", marginLeft: "auto", cursor: "pointer" }}>
          <FontAwesomeIcon icon={faBell} style={{fontSize: "20px",color: "#fff",}}/>
          <span
            style={{position: "absolute",top: "-5px",right: "-10px",backgroundColor: "red",color: "#fff",borderRadius: "50%",fontSize: "12px",padding: "1px 6px",}}>
            15
          </span>
        </div>

        <FontAwesomeIcon
          icon={faComment}
          style={{
            fontSize: "20px",
            color: "#fff",
            marginLeft: "25px",
            cursor: "pointer",
          }}
        />

        {/* Username with Dropdown */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative", // Added position relative to parent
            cursor: "pointer",
            marginLeft: "20px",
          }}
          onClick={toggleDropdown}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#fff",
              marginRight: "10px",
            }}
          >
            20APC4914 WICKRAMASEKARA B.N.N.
          </span>
          <img
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
            src="https://vle.sab.ac.lk/theme/image.php/adaptable/core/1711357418/u/f1"
            alt="Profile"
          />
          <span style={{ color: "#fff", fontSize: "16px" }}>▼</span>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%", // Aligns below the parent container
                right: "0",
                backgroundColor: "#fff",
                color: "#000",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                overflow: "hidden",
                zIndex: 10,
                width: "200px",
              }}
            >
              <a
                href="/dashboard"
                style={{
                  display: "block",
                  padding: "10px 20px",
                  textDecoration: "none",
                  color: "#000",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <FontAwesomeIcon
              icon={faDashboard}
              style={{
                fontSize: "15px",
                color: "gray",
                marginRight:'7px'
              }}
            />
                Dashboard
              </a>
              <a
                href="/profile"
                style={{
                  display: "block",
                  padding: "10px 20px",
                  textDecoration: "none",
                  color: "#000",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <FontAwesomeIcon
              icon={faUser}
              style={{
                fontSize: "15px",
                color: "gray",
                marginRight:'7px'
              }}
            />
                View Profile
              </a>
              <a
                href="/edit-profile"
                style={{
                  display: "block",
                  padding: "10px 20px",
                  textDecoration: "none",
                  color: "#000",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <FontAwesomeIcon
              icon={faCog}
              style={{
                fontSize: "15px",
                color: "gray",
                marginRight:'7px'
              }}
            />
                Edit Profile
              </a>
              <a
                href="/grades"
                style={{
                  display: "block",
                  padding: "10px 20px",
                  textDecoration: "none",
                  color: "#000",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <FontAwesomeIcon
              icon={faListAlt}
              style={{
                fontSize: "15px",
                color: "gray",
                marginRight:'7px'
              }}
            />
                Grades
              </a>
              <a
                href="/preferences"
                style={{
                  display: "block",
                  padding: "10px 20px",
                  textDecoration: "none",
                  color: "#000",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <FontAwesomeIcon
              icon={faCog}
              style={{
                fontSize: "15px",
               color: "gray",
                marginRight:'7px'
              }}
            />
                Preferences
              </a>
              <a
                href="/calendar"
                style={{
                  display: "block",
                  padding: "10px 20px",
                  textDecoration: "none",
                  color: "#000",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <FontAwesomeIcon
              icon={faCalendar}
              style={{
                fontSize: "15px",
                color: "gray",
                marginRight:'7px'
              }}
            />
                Calendar
              </a>
              <a
                href="/logout"
                style={{
                  display: "block",
                  padding: "10px 20px",
                  textDecoration: "none",
                 color: "black",
                marginRight:'7px'
                }}
              >
                <FontAwesomeIcon
              icon={faSignOut}
              style={{
                fontSize: "15px",
                color: "gray",
                marginRight:'7px'
              }}
            />
                Log Out
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Header Section */}
      <header
        style={{
          backgroundColor: "#00796b",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="University Logo" style={{ height: "100px", marginRight: "15px" }} />
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "48px",
                fontWeight: "bold",
                lineHeight: "1.2",
                fontStyle:"Roboto Condensed, sans-serif"
                
              }}
            >
              Sabaragamuwa University of Sri Lanka
            </h1>
            <h2
              style={{
                margin: 0,
                fontSize: "48px",
              }}
            >
              GPA Prediction
            </h2>
          </div>
        </div>

        {/* Social Media Icons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "75px",
          }}
        >

          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                fontSize: "26px",
                color: "#fff",
                
              }}
            />
          </a>

          <a
            href="https://www.facebook.com/susl.official"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faFacebookSquare}
              style={{
                fontSize: "28px",
                color: "#fff",
                
              }}
            />
          </a>
          <a
            href="https://twitter.com/susl_official"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faTwitterSquare}
              style={{
                fontSize: "28px",
                color: "#fff",
              }}
            />
          </a>
          <a
            href="https://www.youtube.com/channel/UCr6N1fR_Lb9ftvHwqCsadSg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faYoutubeSquare}
              style={{
                fontSize: "28px",
                color: "#fff",
              }}
            />
          </a>
          <a
            href="https://linkedin.com/school/sabaragamuwa-university"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faLinkedin}
              style={{
                fontSize: "28px",
                color: "#fff",
              }}
            />
          </a>
        </div>
      </header>


      <div
      style={{
        fontSize: "14px",
        marginTop: "12px",
        color: "#222",
        fontWeight: "400",
        display: "flex",
        gap:"50px",
        marginLeft:"65px",
        alignItems: "center",
        lineHeight: "35px",
        textAlign: "center",
              }}
    >
      <a href="https://vle.sab.ac.lk/?redirect=0" style={{ textDecoration: "none", color: "black" }}>
        <FontAwesomeIcon icon={faHome} style={{ fontSize: "15px", marginRight: "5px" }} />
        Home
      </a>
      <a href="https://vle.sab.ac.lk/my/index.php" style={{ textDecoration: "none", color: "black" }}>
        <FontAwesomeIcon icon={faDashboard} style={{ fontSize: "15px", marginRight: "5px" }} />
        Dashboard
      </a>
      <a href="https://vle.sab.ac.lk/calendar/view.php" style={{ textDecoration: "none", color: "black" }}>
        <FontAwesomeIcon icon={faCalendar} style={{ fontSize: "15px", marginRight: "5px" }} />
        Events
      </a>
      <a href="/my-course" style={{ textDecoration: "none", color: "black" }}>
        <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: "15px", marginRight: "5px" }} />
        My Courses
      </a>
      <a href="/help-desk" style={{ textDecoration: "none", color: "black" }}>
        <FontAwesomeIcon icon={faLifeRing} style={{ fontSize: "15px", marginRight: "5px" }} />
        Help Desk
      </a>
      <button
        style={{
          padding: "8px 16px",
          backgroundColor: "#4CAF50",
          color: "white",
          borderRadius: "4px",
          border: "none",
          cursor: "pointer",
          marginLeft: "210px",
        }}
       
      >
        Customise this page
      </button>

      <div>
      <a href="/my-course" style={{ textDecoration: "none", color: "black",marginLeft:"-30px" }}>
        <FontAwesomeIcon icon={faOutdent} style={{ fontSize: "15px", marginRight: "5px" }} />
        Hide Blocks
      </a>

      <a href="/my-course" style={{ textDecoration: "none", color: "black",marginLeft:"20px",fontSize:"14px"}}>
        <FontAwesomeIcon icon={faCompress} style={{ fontSize: "15px", marginRight: "5px" }} />
       Stand View
      </a>

      </div>
    </div>



<hr style={{ height: '4px', backgroundColor: '#00796b', border: 'none' }} />

<div style={{ fontFamily: "Arial, sans-serif", margin: "20px", border: "1px solid #ccc", borderRadius: "4px" }}>
      {/* Announcement Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#333",
          color: "white",
          padding: "10px",
          borderRadius: "4px 4px 0 0",
        }}
      >
        <strong style={{ marginRight: "10px", fontSize: "14px" }}>ANNOUNCEMENTS</strong>
        <span style={{ fontSize: "14px" }}>
          Welcome to the Virtual Learning Environment of the Sabaragamuwa University of Sri Lanka
        </span>
      </div>

      
    </div>


    </div>
  );
}

export default HeroPage;
