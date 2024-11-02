// UploadDocument.js
import React, { useState } from 'react';
import axios from 'axios';

const Documents = ({ userEmail }) => {
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userEmail', userEmail); // Include userEmail in the form data

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      setUploadedFile(response.data.document.filename); // Save the uploaded file name for download
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/download/${userEmail}/${uploadedFile}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', uploadedFile);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('File download failed');
    }
  };

  return (
    <div>
      <h2>Upload Document</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf, .doc, .docx" onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>
      {uploadedFile && (
        <div>
          <h3>Uploaded File: {uploadedFile}</h3>
          <button onClick={handleDownload}>Download</button>
        </div>
      )}
    </div>
  );
};

export default Documents;
