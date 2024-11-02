import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function PDFUpload() {
    const [title, setTitle] = useState('');
    const [fileName, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !fileName) {
            toast.error('Please provide both a title and PDF file.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', fileName);

        try {
            const response = await axios.post('http://localhost:5174/upload-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true // Include cookies in the request
            });

            if (response.data.status === 'Document is uploaded') {
                toast.success('PDF uploaded successfully!');
                setTitle('');
                setFile(null);
            } else {
                toast.error('Failed to upload PDF.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while uploading the PDF.');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
            <h2>Upload PDF Document</h2>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <label>PDF File</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <button type="submit">Upload PDF</button>
            </form>
        </div>
    );
}
