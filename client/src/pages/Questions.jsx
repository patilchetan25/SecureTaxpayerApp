import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Questions.css';  // Importing the CSS file for styling

const Questions = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [formData, setFormData] = useState({});
    const [step, setStep] = useState(1); // Track the current step in the form
    const [isMarried, setIsMarried] = useState(false); // To toggle spouse questions

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

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Update marital status and conditionally handle next step
        if (name === 'maritalStatus') {
            if (value === 'Married') {
                setIsMarried(true);
            } else {
                setIsMarried(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userEmail = JSON.parse(localStorage.getItem('user'))?.email;
            await axios.put(`http://localhost:8000/user/${userEmail}`, formData);
            alert('User information updated successfully!');
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('Failed to update user information');
        }
    };

    const nextStep = () => {
        if (step === 1 && formData.maritalStatus === 'Single') {
            setStep(3); // Skip to taxpayer info if Single
        } else if (step === 1 && formData.maritalStatus === 'Married') {
            setStep(2); // Go to filing status if Married
        } else if (step === 2) {
            setStep(3); // Go to taxpayer info after filing status
        } else if (step === 3) {
            setStep(4); // Go to spouse info after taxpayer info (if married)
        }
    };

    const prevStep = () => {
        if (step === 3 && formData.maritalStatus === 'Single') {
            setStep(1); // Go back to marital status if single and on taxpayer info
        } else if (step === 4) {
            setStep(3); // Go back to taxpayer info if on spouse info
        } else {
            setStep(step - 1); // Go to the previous step
        }
    };

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="questions-container">
            <h2 className="questions-header">Tax Return Information</h2>
            <form onSubmit={handleSubmit} className="form-container">
                {/* Step 1: Marital Status */}
                {step === 1 && (
                    <div className="question-section">
                        <h3>1. Were you single or married as of December 31st, 2023?</h3>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="maritalStatus"
                                    value="Single"
                                    checked={formData.maritalStatus === 'Single'}
                                    onChange={handleRadioChange}
                                />
                                Single
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="maritalStatus"
                                    value="Married"
                                    checked={formData.maritalStatus === 'Married'}
                                    onChange={handleRadioChange}
                                />
                                Married
                            </label>
                        </div>
                    </div>
                )}

                {/* Step 2: Filing Status (Only if Married) */}
                {step === 2 && isMarried && (
                    <div className="question-section">
                        <h3>2. Are you going to file separately or jointly?</h3>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="filingStatus"
                                    value="Separately"
                                    checked={formData.filingStatus === 'Separately'}
                                    onChange={handleInputChange}
                                />
                                Separately
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="filingStatus"
                                    value="Jointly"
                                    checked={formData.filingStatus === 'Jointly'}
                                    onChange={handleInputChange}
                                />
                                Jointly
                            </label>
                        </div>
                    </div>
                )}

                {/* Step 3: Taxpayer Information */}
                {step === 3 && (
                    <div className="question-section">
                        <h3>3. Taxpayer Information</h3>
                        <div className="input-group">
                            <label>Social Security Number (SSN)</label>
                            <input
                                type="text"
                                name="taxpayerSSN"
                                value={formData.taxpayerSSN}
                                onChange={handleInputChange}
                                placeholder="XXX-XX-XXXX"
                            />
                        </div>

                        <div className="input-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="Enter your first name"
                            />
                        </div>

                        <div className="input-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Enter your last name"
                            />
                        </div>

                        <div className="input-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Cell Phone Number</label>
                            <input
                                type="tel"
                                name="cellPhone"
                                value={formData.cellPhone}
                                onChange={handleInputChange}
                                placeholder="(___) ___-____"
                            />
                        </div>

                        <div className="input-group">
                            <label>Home Address</label>
                            <input
                                type="text"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={handleInputChange}
                                placeholder="Enter your address"
                            />
                        </div>

                        <div className="input-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="Enter your city"
                            />
                        </div>

                        <div className="input-group">
                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="Enter your state"
                            />
                        </div>

                        <div className="input-group">
                            <label>Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                placeholder="Enter your ZIP code"
                            />
                        </div>
                    </div>
                )}

                {/* Step 4: Spouse Information (Only if Married) */}
                {step === 4 && isMarried && (
                    <div className="question-section">
                        <h3>4. Spouse Information</h3>
                        <div className="input-group">
                            <label>Social Security Number (SSN)</label>
                            <input
                                type="text"
                                name="spouseSSN"
                                value={formData.spouseSSN}
                                onChange={handleInputChange}
                                placeholder="XXX-XX-XXXX"
                            />
                        </div>

                        <div className="input-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="spouseFirstName"
                                value={formData.spouseFirstName}
                                onChange={handleInputChange}
                                placeholder="Enter spouse's first name"
                            />
                        </div>

                        <div className="input-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="spouseLastName"
                                value={formData.spouseLastName}
                                onChange={handleInputChange}
                                placeholder="Enter spouse's last name"
                            />
                        </div>

                        <div className="input-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="spouseDob"
                                value={formData.spouseDob}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Cell Phone Number</label>
                            <input
                                type="tel"
                                name="spouseCellPhone"
                                value={formData.spouseCellPhone}
                                onChange={handleInputChange}
                                placeholder="(___) ___-____"
                            />
                        </div>

                        <div className="input-group">
                            <label>Home Address</label>
                            <input
                                type="text"
                                name="spouseStreetAddress"
                                value={formData.spouseStreetAddress}
                                onChange={handleInputChange}
                                placeholder="Enter spouse's address"
                            />
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="button-group">
                    {step > 1 && <button type="button" onClick={prevStep}>Previous</button>}
                    {step < (isMarried ? 4 : 3) && <button type="button" onClick={nextStep}>Next</button>}
                    {step === (isMarried ? 4 : 3) && <button type="submit">Submit</button>}
                </div>
            </form>
        </div>
    );
};

export default Questions;
