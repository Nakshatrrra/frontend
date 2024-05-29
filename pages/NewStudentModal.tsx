import React, { useState } from 'react';
import Modal from 'react-modal';

interface NewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void; // Function to handle new student creation
}

const NewStudentModal: React.FC<NewStudentModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    studentCollege: '',
    status: '',
    dsaScore: 0,
    webdScore: 0,
    reactScore: 0,
    interviewDate: '',
    interviewCompany: '',
    interviewStudentResult: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Make API request to create new student
      const response = await fetch('http://localhost:5000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include access token
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Student created successfully
        onCreate();
        onClose(); // Close the modal
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Create New Student</h2>
      <form onSubmit={handleSubmit}>
        {/* Add form fields for creating a new student */}
        {/* Example: */}
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        <input type="text" name="studentCollege" value={formData.studentCollege} onChange={handleChange} placeholder="College" />
        {/* Add other form fields here */}
        <button type="submit">Create</button>
      </form>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

export default NewStudentModal;
