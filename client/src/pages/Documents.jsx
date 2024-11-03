import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/NavBar';

const Documents = () => {
    const [file, setFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileList, setFileList] = useState([]);

    const userEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : null;

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userEmail', userEmail); // Include userEmail in the form data

        try {
            const response = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);
            setUploadedFile(response.data.file);
            fetchFiles(); // Refresh file list after upload
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('File upload failed');
        }
    };

    const handleDownload = async (file) => {
        if (!file.filename) {
            alert('No file to download.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8000/download/${userEmail}/${file.filename}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.originalname);
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('File download failed');
        }
    };

    const fetchFiles = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/files/${userEmail}`);
            setFileList(response.data);
        } catch (error) {
            console.error('Error fetching files:', error);
            alert('Failed to fetch files');
        }
    };

    useEffect(() => {
        if (userEmail) {
            fetchFiles(); // Fetch files on component mount
        }
    }, [userEmail]);

    return (
        <div>
                    <Navbar></Navbar>
            <h2>Upload Document</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept=".pdf, .doc, .docx, .xlsx, .jpg, .jpeg, .png"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit">Upload</button>
            </form>
            {uploadedFile && (
                <div>
                    <h3>Uploaded File: {uploadedFile.originalname}</h3>
                    <button onClick={() => handleDownload(uploadedFile)}>Download</button>
                </div>
            )}
            <h2>Uploaded Files</h2>
            <table>
                <thead>
                    <tr>
                        <th>Original Name</th>
                        <th>Filename</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fileList.map((file) => (
                        <tr key={file._id}>
                            <td>{file.originalname}</td>
                            <td>{file.filename}</td>
                            <td>
                                <button onClick={() => handleDownload(file)}>Download</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Documents;
