import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask'; // Import InputMask
import './Questions.css';  // Importing the CSS file for styling
import toast from 'react-hot-toast';
import { useAuth } from '../context/authContext';

const Questions = () => {
    const { userInfo, updateUserInfo } = useAuth();
    const [formData, setFormData] = useState({});
    const [step, setStep] = useState(1); // Track the current step in the form
    const [isMarried, setIsMarried] = useState(false); // To toggle spouse questions
    const [errors, setErrors] = useState({}); // Track errors for validation

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setFormData(userInfo);
                if (userInfo.maritalStatus === 'Married') {
                    setIsMarried(true);
                }
            } catch (error) {
                console.error('Error while getting user:', error);
            }
        };

        fetchUserData();
    }, []); // Empty dependency array means this will run once on component mount

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

        if (name === 'maritalStatus') {
            if (value === 'Married') {
                setIsMarried(true);
            } else {
                setIsMarried(false);
            }
        }
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Step 1: Marital Status validation
        if (!formData.maritalStatus) {
            newErrors.maritalStatus = 'Marital status is required';
        }

        // Step 2: Filing status (only if Married)
        if (step === 2 && isMarried && !formData.filingStatus) {
            newErrors.filingStatus = 'Filing status is required';
        }

        // Step 3: Taxpayer information validation
        if (step === 3) {
            if (!formData.ssn) {
                newErrors.ssn = 'SSN is required';
            }
            if (!formData.firstName) {
                newErrors.firstName = 'First name is required';
            }
            if (!formData.lastName) {
                newErrors.lastName = 'Last name is required';
            }
            if (!formData.dateOfBirth) {
                newErrors.dateOfBirth = 'Date of birth is required';
            }
            if (!formData.phoneNumber) {
                newErrors.phoneNumber = 'Phone number is required';
            }
            if (!formData.streetAddress) {
                newErrors.streetAddress = 'Street address is required';
            }
            if (!formData.city) {
                newErrors.city = 'City is required';
            }
            if (!formData.state) {
                newErrors.state = 'State is required';
            }
            if (!formData.zipCode) {
                newErrors.zipCode = 'Zip code is required';
            }
        }

        // Step 4: Spouse information validation (only if Married)
        if (step === 4 && isMarried) {
            if (!formData.spouseSSN) {
                newErrors.spouseSSN = 'Spouse SSN is required';
            }
            if (!formData.spouseFirstName) {
                newErrors.spouseFirstName = 'Spouse first name is required';
            }
            if (!formData.spouseLastName) {
                newErrors.spouseLastName = 'Spouse last name is required';
            }
            if (!formData.spouseDob) {
                newErrors.spouseDob = 'Spouse date of birth is required';
            }
            if (!formData.spousePhoneNumber) {
                newErrors.spousePhoneNumber = 'Spouse Phone number is required';
            }
            if (!formData.spouseStreetAddress) {
                newErrors.spouseStreetAddress = 'Spouse street address is required';
            }
            if (!formData.spouseCity) {
                newErrors.spouseCity = 'Spouse city is required';
            }
            if (!formData.spouseState) {
                newErrors.spouseState = 'Spouse state is required';
            }
            if (!formData.spouseZipCode) {
                newErrors.spouseZipCode = 'Spouse zip code is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post('/saveTaxpayerQuestions', formData);
                toast.success('User updated successfully!');
                updateUserInfo(response.data);
                console.log('Updated user:', response.data);
            } catch (error) {
                console.error('Error updating user:', error);
                toast.error('An error occurred while updating the user.');
            }
        } else {
            toast.error('Please correct the errors before submitting.');
        }
    };

    const nextStep = () => {
        if (validateForm()) {
            if (step === 1 && formData.maritalStatus === 'Single') {
                setStep(3);
            } else if (step === 1 && formData.maritalStatus === 'Married') {
                setStep(2);
            } else if (step === 2) {
                setStep(3);
            } else if (step === 3) {
                setStep(4);
            }
        }
    };

    const prevStep = () => {
        if (step === 3 && formData.maritalStatus === 'Single') {
            setStep(1);
        } else if (step === 4) {
            setStep(3);
        } else {
            setStep(step - 1);
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
                            {errors.maritalStatus && <div className="error-message">{errors.maritalStatus}</div>}
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
                            {errors.filingStatus && <div className="error-message">{errors.filingStatus}</div>}
                        </div>
                    </div>
                )}

                {/* Step 3: Taxpayer Information */}
                {step === 3 && (
                    <div className="question-section">
                        <h3>{isMarried ? "3. Taxpayer Information" : "2. Taxpayer Information"}</h3>
                        <div className="input-group">
                            <label>Social Security Number (SSN)</label>
                            <InputMask
                                mask="999-99-9999"
                                name="ssn"
                                value={formData.ssn}
                                onChange={handleInputChange}
                                placeholder="XXX-XX-XXXX"
                            />
                            {errors.ssn && <div className="error-message">{errors.ssn}</div>}
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
                            {errors.firstName && <div className="error-message">{errors.firstName}</div>}
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
                            {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                        </div>

                        <div className="input-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                            />
                            {errors.dateOfBirth && <div className="error-message">{errors.dateOfBirth}</div>}
                        </div>

                        <div className="input-group">
                            <label>hone Number</label>
                            <InputMask
                                mask="(999) 999-9999"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="(___) ___-____"
                            />
                            {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
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
                            {errors.streetAddress && <div className="error-message">{errors.streetAddress}</div>}
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
                            {errors.city && <div className="error-message">{errors.city}</div>}
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
                            {errors.state && <div className="error-message">{errors.state}</div>}
                        </div>

                        <div className="input-group">
                            <label>Zip Code</label>
                            <InputMask
                                mask="99999"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                placeholder="Enter your ZIP code"
                            />
                            {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                        </div>
                    </div>
                )}

                {/* Step 4: Spouse Information (Only if Married) */}
                {step === 4 && isMarried && (
                    <div className="question-section">
                        <h3>4. Spouse Information</h3>
                        <div className="input-group">
                            <label>Social Security Number (SSN)</label>
                            <InputMask
                                mask="999-99-9999"
                                name="spouseSSN"
                                value={formData.spouseSSN}
                                onChange={handleInputChange}
                                placeholder="XXX-XX-XXXX"
                            />
                            {errors.spouseSSN && <div className="error-message">{errors.spouseSSN}</div>}
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
                            {errors.spouseFirstName && <div className="error-message">{errors.spouseFirstName}</div>}
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
                            {errors.spouseLastName && <div className="error-message">{errors.spouseLastName}</div>}
                        </div>

                        <div className="input-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="spouseDob"
                                value={formData.spouseDob}
                                onChange={handleInputChange}
                            />
                            {errors.spouseDob && <div className="error-message">{errors.spouseDob}</div>}
                        </div>

                        <div className="input-group">
                            <label>Phone Number</label>
                            <InputMask
                                mask="(999) 999-9999"
                                name="spousePhoneNumber"
                                value={formData.spousePhoneNumber}
                                onChange={handleInputChange}
                                placeholder="(___) ___-____"
                            />
                            {errors.spousePhoneNumber && <div className="error-message">{errors.spousePhoneNumber}</div>}
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
                            {errors.spouseStreetAddress && <div className="error-message">{errors.spouseStreetAddress}</div>}
                        </div>

                        <div className="input-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="spouseCity"
                                value={formData.spouseCity}
                                onChange={handleInputChange}
                                placeholder="Enter spouse's city"
                            />
                            {errors.spouseCity && <div className="error-message">{errors.spouseCity}</div>}
                        </div>

                        <div className="input-group">
                            <label>State</label>
                            <input
                                type="text"
                                name="spouseState"
                                value={formData.spouseState}
                                onChange={handleInputChange}    
                                placeholder="Enter spouse's state"
                            />
                            {errors.spouseState && <div className="error-message">{errors.spouseState}</div>}
                        </div>

                        <div className="input-group">
                            <label>Zipcode</label>
                            <InputMask
                                mask="99999"
                                name="spouseZipCode"
                                value={formData.spouseZipCode}
                                onChange={handleInputChange}
                                placeholder="Enter spouse's zipcode"
                            />
                            {errors.spouseZipCode && <div className="error-message">{errors.spouseZipCode}</div>}
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
