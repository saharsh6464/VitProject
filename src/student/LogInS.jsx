import React, { useRef } from 'react';
import './LogIn.css'; // Ensure this CSS file styles your form properly
import { Form, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { dataContext } from '../store/data';
import { getSavedCredentials } from '../store/saveCredS';
import { resetPassword } from '../store/auth';
const LoginPageS = () => {
  const {createclass} = useContext(dataContext);

  const emailRef = useRef();
  const passwordRef = useRef();
  const customField1Ref = useRef();
  // const customField2Ref = useRef();
  const navigate = useNavigate();
  const x=getSavedCredentials();
  if(x!=null) {
    const obj={"role":"Student","email":x.studentEmail,"password":x.studentPassword,"name":x.teacherEmail};
    createclass(obj,false);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const customField1 = formData.get('customField1');
    // const customField2 = formData.get('customField2');

    // Log form data (or replace this with actual authentication logic)
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Custom Field 1:", customField1);
    // console.log("Custom Field 2:", customField2);
    const obj={"role":"Student","email":email,"password":password,"name":customField1}
    createclass(obj);
    // Redirect to the dashboard if login is successful
    
  };

  const rstPassword = () => {
    
    console.log(emailRef.current.value);
    resetPassword(emailRef.current.value);
    alert("Send to your:"+emailRef.current.value);
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <Form method="post" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            ref={emailRef}
            placeholder="Enter email"
            required
          />
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            ref={passwordRef}
            placeholder="Enter password"
            required
          />
        </div>

        {/* Custom Field 1 */}
        <div className="form-group">
          <label htmlFor="customField1">Teacher Email:</label>
          <input
            type="email"
            id="customField1"
            name="customField1"
            ref={customField1Ref}
            placeholder="Custom input 1"
            required
          />
        </div>

        {/* Custom Field 2 */}
        {/* <div className="form-group">
          <label htmlFor="customField2">Custom Field 2</label>
          <input
            type="text"
            id="customField2"
            name="customField2"
            ref={customField2Ref}
            placeholder="Custom input 2"
            required
          />
        </div> */}

        {/* Submit Button */}
        <p onClick={rstPassword}>Forget Password?</p>
        <button type="submit" className="submit-btn">Sign In</button>
      </Form>

      <p>© 2024 Your Company</p>
    </div>
  );
};

export default LoginPageS;

    