// Assuming you have already set up MongoDB and imported necessary modules

const express = require('express');
const router = express.Router();
const ApprovedStudent = require('../../models/Officer/ApprovedStudents'); // Import ApprovedStudent model/schema
const RemovedStudent = require('../../models/Officer/NotApprovedstudents'); // Import RemovedStudent model/schema

// Route to fetch approved students
router.get('/approvedStudents', async (req, res) => {
    try {
        // Fetch all approved students from the database
        const approvedStudents = await ApprovedStudent.find();
        res.json(approvedStudents);
    } catch (error) {
        console.error('Error fetching approved students:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/officer/approvedStudents', async (req, res) => {
  try {
      // Fetch all approved students from the database
      const approvedStudents = await ApprovedStudent.find();
      res.json(approvedStudents);
  } catch (error) {
      console.error('Error fetching approved students:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.put('/updateStudent/:studentId', async (req, res) => {
  const  studentId  = req.params.studentId;
  try {
    const updatedStudent = await ApprovedStudent.findByIdAndUpdate(studentId, req.body, { new: true });
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// PUT endpoint to update approved student details
router.put('/student/:id', async (req, res) => {
  const studentId = req.params.id;
  const updatedStudentData = req.body;
  
  try {
    // Find the approved student by ID and update their details
    const updatedStudent = await ApprovedStudent.findByIdAndUpdate(
      studentId,
      updatedStudentData,
      { new: true } // Return the updated student data after the update
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(updatedStudent); // Send the updated student data in the response
  } catch (error) {
    console.error('Error updating student details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch removed students
router.get('/removedStudents', async (req, res) => {
    try {
        // Fetch all removed students from the database
        const removedStudents = await RemovedStudent.find();
        res.json(removedStudents);
    } catch (error) {
        console.error('Error fetching removed students:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/approvedstudentDetails/:id', async (req, res) => {
    try {
      const studentId = req.params.id;
  
      // Fetch student details including parentDetails from the database
      const student = await ApprovedStudent.findById(studentId);
  
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      const { name, admissionType, admissionId,admissionNumber, allotmentCategory, feeCategory, address,permanentAddress, photo, pincode, religion, community, gender, dateOfBirth, bloodGroup, mobileNo, whatsappNo, email, entranceExam, entranceRollNo, entranceRank, aadharNo, course, annualIncome, nativity } = student;
      const { parentDetails } = student;
      const { bankDetails } = student;
      const { achievements } = student;
      const { qualify } = student;
      const photoUrl = photo ? `${req.protocol}://${req.get('host')}/${photo}` : null;
  
      res.json({
        studentDetails: {
          name,
          admissionType,
          admissionId,
          admissionNumber,
          allotmentCategory,
          feeCategory,
          address,
          permanentAddress,
          pincode,
          religion,
          community,
          gender,
          dateOfBirth,
          bloodGroup,
          mobileNo,
          whatsappNo,
          email,
          entranceExam,
          entranceRollNo,
          entranceRank,
          aadharNo,
          course,
          annualIncome,
          nativity,
          photoUrl,
          qualify: {
            exam: qualify.exam,
            board: qualify.board,
            regNo: qualify.regNo,
            examMonthYear: qualify.examMonthYear,
            percentage: qualify.percentage,
            institution: qualify.institution,
            cgpa:qualify.cgpa,
  
          },
          parentDetails: {
            fatherName: parentDetails.fatherName,
            fatherOccupation: parentDetails.fatherOccupation,
            fatherMobileNo: parentDetails.fatherMobileNo,
            motherName: parentDetails.motherName,
            motherOccupation: parentDetails.motherOccupation,
            motherMobileNo: parentDetails.motherMobileNo,
          },
          bankDetails: {
            bankName: bankDetails.bankName,
            branch: bankDetails.branch,
            accountNo: bankDetails.accountNo,
            ifscCode: bankDetails.ifscCode,
          },
          achievements: {
            arts: achievements.arts,
            sports: achievements.sports,
            other: achievements.other,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching student details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports = router;
