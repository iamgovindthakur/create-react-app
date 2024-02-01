import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

// Employee model
class Employee {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

const AdminPage = () => {
  // Load employees from local storage on component mount
  const [employees, setEmployees] = useState(() => {
    const storedData = localStorage.getItem('employees');
    return storedData ? JSON.parse(storedData) : [];
  });

  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    // Save employees to local storage whenever it changes
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Read the Excel file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the Excel sheet name is 'Sheet1'
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Parse the worksheet data and extract employee name and email
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const newEmployees = rows
          .filter((row) => row.length === 2) // Filter rows with exactly 2 columns
          .map(([name, email]) => new Employee(name, email));

        setEmployees(newEmployees);
        setUploadError(null);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        setUploadError('Error parsing Excel file. Please make sure the file is in the correct format.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <h2>Welcome, Admin!</h2>

      {/* Custom-styled dropzone */}
      <div
        {...getRootProps()}
        style={{
          marginTop: '20px',
          padding: '20px',
          border: `2px dashed ${isDragActive ? 'green' : '#ccc'}`, // Change border color when dragging
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
          cursor: 'pointer'
        }}
      >
        <input {...getInputProps()} />
        <p>
          {isDragActive
            ? 'Drop the Excel file here'
            : 'Drag and drop an Excel file here, or click to select one.'}
        </p>
      </div>

      {/* Display the list of employees */}
      {employees.length > 0 && (
        <div>
          <h3>Employee List:</h3>
          <ul>
            {employees.map((employee, index) => (
              <li key={index}>{`${employee.name} - ${employee.email}`}</li>
            ))}
          </ul>
        </div>
      )}

      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
    </div>
  );
};

export default AdminPage;
