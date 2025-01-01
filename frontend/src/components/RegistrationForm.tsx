import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [comfirmpassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [username, setUsername] = useState('');
  const [program, setProgram] = useState('');
  const [teachingSubject, setTeachingSubject] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      fname,
      lname,
      email,
      gender,
      password,
      comfirmpassword,
      role,
      phone1,
      phone2,
      username,
      program,
      teachingSubject,
      dob,
      termsAgreed,
    };

    try {
      const response = await fetch('http://localhost:5001/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('User registered successfully');
        setFName('');
        setLName('');
        setEmail('');
        setGender('');
        setPassword('');
        setConfirmPassword('');
        setRole('student');
        setPhone1('');
        setPhone2('');
        setUsername('');
        setProgram('');
        setTeachingSubject('');
        setDob('');
        setTermsAgreed(false);


        navigate('/subjectadd');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh' }}>
      {error && <p/>}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '10%',
          backgroundColor: '#f0f0f0',
          fontFamily: 'Gotu',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        {Array.from('REGISTRATION              FORM').map((char, index) => (
          <div key={index} style={{ margin: '1px 0' }}>
            {char}
          </div>
        ))}
      </div>
      
      <div style={{
          width: '90%',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
      <form onSubmit={handleSubmit} style={{ width:'75%', height:'auto', justifyContent:'center'}}>
        <label style={{display:'flex',paddingLeft:'8px'}}>Name</label>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', columnGap:'20px', marginBottom:'10px', paddingTop:'5px'}}>

                <section>
                <input
                type="text"
                placeholder="First Name"
                value={fname}
                onChange={(e) => setFName(e.target.value)}
                required
                style={{width:'438.5px', height:'40px', paddingLeft:'10px'}}
                />
                </section>

                <section>
                <input
                type="text"
                placeholder="Last Name"
                value={lname}
                onChange={(e) => setLName(e.target.value)}
                required
                style={{width:'438.5px', height:'40px', paddingLeft:'10px'}}
                />
                </section>
        </div>


<div style={{display:'flex', flexDirection:'row',  columnGap:'20px', marginBottom:'10px',marginLeft:'8px'}}>
     
        <section>
        <label style={{display:'flex'}}>BirthDay</label>
            <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            style={{width:'438.5px', height:'40px', paddingLeft:'10px', marginTop:'5px'}}
            />
        </section>

        <section >
        <label style={{display:'flex'}}>Gender</label>
        <div style={{display:'flex', margin:'16px  16px 0 ', gap:'20px'}}>
        <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={gender === 'Male'}
              onChange={(e) => setGender(e.target.value)}
            />
            Male
          </label>

          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={gender === 'Female'}
              onChange={(e) => setGender(e.target.value)}
            />
            Female
          </label>

          <label>
            <input
              type="radio"
              name="gender"
              value="NotPrefer"
              checked={gender === 'NotPrefer'}
              onChange={(e) => setGender(e.target.value)}
            />
            Not Prefer
          </label>
          </div>
        </section>
        </div>

        <label style={{display:'flex',paddingLeft:'8px'}}>Mobile Number</label>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', columnGap:'20px', marginBottom:'10px', paddingTop:'5px'}}>

                <section>
                <input
                type="tel"
                placeholder="Private"
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                required
                style={{width:'438.5px', height:'40px', paddingLeft:'10px'}}
                />
                </section>

                <section>
                <input
                type="tel"
                placeholder="Home"
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                required
                style={{width:'438.5px', height:'40px', paddingLeft:'10px'}}
                />
                </section>
        </div>

        <label  style={{display:'flex',paddingLeft:'8px'}}>Email</label>
        <div  style={{display:'flex', flexDirection:'row', justifyContent:'center', columnGap:'20px', marginBottom:'10px', paddingTop:'5px',margin:'0 8px 0 8px'}}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{width:'100%', height:'40px', paddingLeft:'10px'}}
        />
        </div>

        <div style={{display:'flex', flexDirection:'row',  columnGap:'20px', marginBottom:'10px',marginLeft:'8px', marginTop:'10px'}}>
     
        <section>
        <label style={{display:'flex'}}>User Name</label>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{width:'438.5px', height:'40px', paddingLeft:'10px', marginTop:'5px'}}
            />
        </section>

        <section >
        <label style={{display:'flex'}}> Select User</label>
        
        <div style={{display:'flex', marginTop:'5px'}}>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={{width:'455px', height:'47px', paddingLeft:'10px'}}
        >
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
          <option value="administrator">Administrator</option>
        </select>
        </div>      
        </section>
        </div>

        <label style={{display:'flex',paddingLeft:'8px',}}>Password</label>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', columnGap:'20px', marginBottom:'10px', paddingTop:'5px'}}>

                <section>
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{width:'438.5px', height:'40px', paddingLeft:'10px'}}
                />
                </section>

                <section>
                <input
                type="password"
                placeholder="Confirmed Password"
                value={comfirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{width:'438.5px', height:'40px', paddingLeft:'10px'}}
                />
                </section>
        </div>

<label style={{display:'flex',paddingLeft:'8px',}}>Select Department and Faculty </label>
<div style={{display:'flex', flexDirection:'row', justifyContent:'center', columnGap:'20px', marginBottom:'10px', paddingTop:'5px',margin:'0 8px 0 8px'}}>
        {role === 'student' && (
          <>
          <div style={{display:'flex', marginTop:'5px'}}>
        <select
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          required
          style={{width:'119.5vh', height:'47px', paddingLeft:'10px'}}
        >
          <option value="cis">Computing & Information Systems, FOC</option>
          <option value="se">Software Engineering, FOC</option>
          <option value="ds">Data Science, FOC</option>
        </select>
        </div>  
          </>
        )}
        {role === 'lecturer' && (
          <div style={{display:'flex', marginTop:'5px'}}>
          <select
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            required
            style={{width:'119.5vh', height:'47px', paddingLeft:'10px'}}
          >
            <option value="foccis">Depatment of CIS, FOC</option>
            <option value="focse">Department of SE, FOC</option>
            <option value="focds">Department of DS, FOC</option>
          </select>
          </div>
        )}
        </div>
        
      
        <div style={{display:'flex',flexDirection:'row', columnGap:'60px', paddingTop:'30px',paddingLeft:'8px',}}>
          <label>
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              required
            />
            I Agree Terms and Conditions
          </label>
        </div>

<div style={{display:'flex', justifyContent:'center', paddingTop:'30px',paddingBottom:'30px'}}>
        <button type="submit" 
        style={{display:'flex',justifyContent: 'center', alignItems: 'center', width:'40%', height:'50px', border:'none', borderRadius:'10px'}}
        >
          Register</button>
          </div>


      </form>
      </div>

      
    </div>
    </>
  );
};

export default RegistrationForm;