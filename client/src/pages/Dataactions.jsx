import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Documents.css';
import { useAuth } from '../context/authContext';

const Documents = () => {
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const { userInfo } = useAuth();

    const userEmail = userInfo.email;

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userEmail', userEmail);

        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);
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
            const response = await axios.get(`/download/${userEmail}/${file.filename}`, {
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
            const response = await axios.get(`/files/${userEmail}`);
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
        <div className="documents-container">
            <h2>Upload Document</h2>
            <div className="upload-section">
                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="file-upload">
                        <input
                            type="file"
                            accept=".pdf, .doc, .docx, .xlsx, .jpg, .jpeg, .png"
                            onChange={handleFileChange}
                            required
                            className="file-input"
                        />
                        <button type="submit" className="upload-button">Upload</button>
                    </div>
                </form>
            </div>

            <h2>Uploaded Files</h2>
            <div className="table-container">
                <table className="file-table">
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
                                    <button onClick={() => handleDownload(file)} className="download-button">Download</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Documents;
