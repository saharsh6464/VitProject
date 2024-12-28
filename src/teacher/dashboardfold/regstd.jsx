import { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { dataContext } from '../../store/data';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';

const encodeKey = (key) => key.replace(/\./g, ",");

const fetchSubjects = async (teacherEmail) => {
  try {
    const encodedEmail = encodeKey(teacherEmail);
    const db = getDatabase();
    const teacherRef = ref(db, `teachers/${encodedEmail}/subjects`);

    const snapshot = await get(teacherRef);
    if (snapshot.exists()) {
      const subjectsString = snapshot.val(); // Example: "math science english"
      return subjectsString.split(" ");
    }
    return [];
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
};

const Register = () => {
  const { personDetails, registerStudent } = useContext(dataContext);
  const navigate = useNavigate();
  const studentNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [subjects, setSubjects] = useState([]);

  // Fetch subjects on component mount
  useEffect(() => {
    const loadSubjects = async () => {
      const data = await fetchSubjects(personDetails.email);
      setSubjects(data);
    };
    loadSubjects();
  }, [personDetails.email]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const studentDetails = {
      studentId: personDetails.email,
      studentName: studentNameRef.current.value,
      course: subjects,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    registerStudent(studentDetails);

    studentNameRef.current.value = '';
    emailRef.current.value = '';
    passwordRef.current.value = '';

    navigate('/teacher-login/dashboard');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Register New Student</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="student-name"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="student-name"
              ref={studentNameRef}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            id="register"
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
