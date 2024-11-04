import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Questions.css';

const Questions = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('user'));
                setUserInfo(userInfo);
                setFormData(userInfo);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userEmail = JSON.parse(localStorage.getItem('user'))?.email;
            await axios.put(`http://localhost:8000/user/${userEmail}`, formData);
            setUserInfo(formData);
            setIsEditing(false);
            alert('User information updated successfully!');
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('Failed to update user information');
        }
    };

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="questions-container">
            <h2 className="questions-header">User Information</h2>
            <form onSubmit={handleSubmit}>
                {/* Filing Status */}
                <div className="question">
                    <strong>Filing Status:</strong>
                    {isEditing ? (
                        <select
                            name="filingStatus"
                            value={formData.filingStatus}
                            onChange={handleInputChange}
                        >
                            <option value="Single">Single</option>
                            <option value="Married Filing Jointly">Married Filing Jointly</option>
                            <option value="Married Filing Separately">Married Filing Separately</option>
                            <option value="Head of Household">Head of Household</option>
                            <option value="Qualifying Widow(er)">Qualifying Widow(er)</option>
                        </select>
                    ) : (
                        <span>{userInfo.filingStatus}</span>
                    )}
                </div>

                {/* Personal Information */}
                <div className="question">
                    <strong>Taxpayer Info - SSN:</strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="ssn"
                            value={formData.ssn}
                            onChange={handleInputChange}
                            placeholder="___-__-____"
                        />
                    ) : (
                        <span>{userInfo.ssn}</span>
                    )}
                </div>

                <div className="question">
                    <strong>First Name:</strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <span>{userInfo.firstName}</span>
                    )}
                </div>

                <div className="question">
                    <strong>Last Name:</strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <span>{userInfo.lastName}</span>
                    )}
                </div>

                <div className="question">
                    <strong>Date of Birth:</strong>
                    {isEditing ? (
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <span>{userInfo.dateOfBirth}</span>
                    )}
                </div>

                <div className="question">
                    <strong>Home Address:</strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <span>{userInfo.streetAddress}</span>
                    )}
                </div>

                <div className="question">
                    <strong>City:</strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <span>{userInfo.city}</span>
                    )}
                </div>

                <div className="question">
                    <strong>State:</strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <span>{userInfo.state}</span>
                    )}
                </div>

                <div className="question">
                    <strong>ZIP Code:</strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <span>{userInfo.zipCode}</span>
                    )}
                </div>

                <div className="button-group">
                    <button type="button" onClick={handleEditToggle}>
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    {isEditing && <button type="submit">Save Changes</button>}
                </div>
            </form>
        </div>
    );
};

export default Questions;
