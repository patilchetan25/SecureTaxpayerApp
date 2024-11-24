// services/userService.js
import axios from 'axios';

// Function to get the list of users
export const getUsers = async () => {
    try {
        const response = await axios.get('/listUsers');
        return response.data; // Returns the data obtained
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error; // Throw the error to handle it in the component
    }
};


export const updateUser = async (id, updatedData) => {
    try {
        const response = await axios.put(`/updateUser/${id}`, updatedData);
        return response.data; // Returns the data obtained
    } catch (error) {
        console.error("Error updating user:", error);
        throw error; // Throw the error to handle it in the component
    }
};

export const fetchFiles = async (userEmail) => {
    try {
        const response = await axios.get(`/filesuser/${userEmail}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching files:', error);
        throw error;
    }
};

// Function to download a file
export const downloadFile = async (userEmail, filename, originalname) => {
    try {
        const response = await axios.get(`/downloadadmin/${userEmail}/${filename}`, {
            responseType: 'blob', // Ensures it is downloaded as a binary file

        });

        // Create a temporary link for download
        const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', originalname);
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
};