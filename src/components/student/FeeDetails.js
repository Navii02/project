import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './UserNavbar';
//import Footer from './Footer';
import './FeeDetails.css';

function InstallmentPage() {
  const [installments, setInstallments] = useState([]);
  const [course, setCourse] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInstallments = async () => {
      const email = localStorage.getItem('email');
      const storedCourse = localStorage.getItem('course');

      if (!email || !storedCourse) {
        setError('Email or course not found in localStorage');
        return;
      }

      setCourse(storedCourse);

      try {
        const response = await axios.post('/api/fetch-installments', {
          email,
          course: storedCourse,
        });

        setInstallments(response.data.installmentsPaid);
      } catch (err) {
        setError('Failed to fetch installments');
      }
    };

    fetchInstallments();
  }, []);

  const getInstallmentCount = (course) => {
    return course === 'MCA' ? 1 : 4;
  };

  return (
    <div className="installment-page">
      <Navbar />
      <div className="installment-container">
        <h2>Installment Payment Status</h2>
        {error && <p className="error">{error}</p>}
        {course && (
          <>
            <div className="installment-list">
              {[...Array(getInstallmentCount(course))].map((_, index) => {
                const installmentNumber = index + 1;
                const isPaid = installments.includes(installmentNumber);

                return (
                  <div key={installmentNumber} className="installment-item">
                    <p>Installment {installmentNumber}</p>
                    <p className={isPaid ? 'paid' : 'not-paid'}>
                      {isPaid ? 'Paid' : 'Not Paid'}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
     </div>
  );
 
}

export default InstallmentPage;
