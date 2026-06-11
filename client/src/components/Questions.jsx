//copy of stepards not for use
import React, { useState } from 'react';
import './Style/Questions.css';
import SuccessNotification from '../components/Notifications/SuccessNotification.jsx'; // import your notification component
import { useNavigate } from 'react-router-dom';

export default function Questions() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        phoneNumber: '',
        email: '',
        profileLink: '',
        location: '',
        dob: '',
        careerObjective: '',
        education: {
            degree: '',
            institution: '',
            eduLocation: '',
            years: '',
            cgpa: '',
        },
        workExperience: {
            jobTitle: '',
            companyName: '',
            workLocation: '',
            workYears: '',
        },
        skills: {
            technical: '',
            soft: '',
        },
    });

    const [showSuccess, setShowSuccess] = useState(false);

    // Helper to update nested state
    const updateNested = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/submitCv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowSuccess(true); // Show success notification
                setTimeout(() => {
                    setShowSuccess(false);
                    navigate('/Templates'); // Redirect after a short delay
                }, 2000);
            } else {
                alert('Error: ' + (data.message || 'Something went wrong'));
            }
        } catch (error) {
            alert('Server error. Please try again later.');
            console.error(error);
        }
    };

    return (
        <>
            {showSuccess && (
                <SuccessNotification
                    message="DATA SAVED SUCCESSFULLY"
                    onClose={() => setShowSuccess(false)}
                />
            )}

            <form id="ques" className="cv-form" onSubmit={handleSubmit}>
                <h1>CV Information Form</h1>
                <ol>
                    {/* Personal Info */}
                    <li>
                        <strong>Personal Information</strong>
                        <ul>
                            <li>
                                Full Name:{' '}
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </li>
                            <li>
                                Phone Number:{' '}
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={formData.phoneNumber}
                                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    required
                                />
                            </li>
                            <li>
                                Email Address:{' '}
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </li>
                            <li>
                                LinkedIn / Portfolio / GitHub:{' '}
                                <input
                                    type="url"
                                    placeholder="Enter your profile link"
                                    value={formData.profileLink}
                                    onChange={e => setFormData({ ...formData, profileLink: e.target.value })}
                                />
                            </li>
                            <li>
                                Current City & Country:{' '}
                                <input
                                    type="text"
                                    placeholder="Enter your location"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </li>
                            <li>
                                Date of Birth:{' '}
                                <input
                                    type="date"
                                    value={formData.dob}
                                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                />
                            </li>
                        </ul>
                    </li>

                    {/* Career Objective */}
                    <li>
                        <strong>Career Objective / Summary</strong>
                        <textarea
                            placeholder="Write 2–3 sentences"
                            value={formData.careerObjective}
                            onChange={e => setFormData({ ...formData, careerObjective: e.target.value })}
                        />
                    </li>

                    {/* Education */}
                    <li>
                        <strong>Education</strong>
                        <ul>
                            <li>
                                Degree Name:{' '}
                                <input
                                    type="text"
                                    value={formData.education.degree}
                                    onChange={e => updateNested('education', 'degree', e.target.value)}
                                />
                            </li>
                            <li>
                                Institution Name:{' '}
                                <input
                                    type="text"
                                    value={formData.education.institution}
                                    onChange={e => updateNested('education', 'institution', e.target.value)}
                                />
                            </li>
                            <li>
                                Location:{' '}
                                <input
                                    type="text"
                                    value={formData.education.eduLocation}
                                    onChange={e => updateNested('education', 'eduLocation', e.target.value)}
                                />
                            </li>
                            <li>
                                Start & End Year:{' '}
                                <input
                                    type="text"
                                    placeholder="e.g. 2020 - 2024"
                                    value={formData.education.years}
                                    onChange={e => updateNested('education', 'years', e.target.value)}
                                />
                            </li>
                            <li>
                                CGPA:{' '}
                                <input
                                    type="number"
                                    value={formData.education.cgpa}
                                    onChange={e => updateNested('education', 'cgpa', e.target.value)}
                                />
                            </li>
                        </ul>
                    </li>

                    {/* Work Experience */}
                    <li>
                        <strong>Work Experience</strong>
                        <ul>
                            <li>
                                Job Title:{' '}
                                <input
                                    type="text"
                                    value={formData.workExperience.jobTitle}
                                    onChange={e => updateNested('workExperience', 'jobTitle', e.target.value)}
                                />
                            </li>
                            <li>
                                Company Name:{' '}
                                <input
                                    type="text"
                                    value={formData.workExperience.companyName}
                                    onChange={e => updateNested('workExperience', 'companyName', e.target.value)}
                                />
                            </li>
                            <li>
                                Location:{' '}
                                <input
                                    type="text"
                                    value={formData.workExperience.workLocation}
                                    onChange={e => updateNested('workExperience', 'workLocation', e.target.value)}
                                />
                            </li>
                            <li>
                                Start & End Date:{' '}
                                <input
                                    type="text"
                                    placeholder="e.g. Jan 2022 - Dec 2024"
                                    value={formData.workExperience.workYears}
                                    onChange={e => updateNested('workExperience', 'workYears', e.target.value)}
                                />
                            </li>
                        </ul>
                    </li>

                    {/* Skills */}
                    <li>
                        <strong>Skills</strong>
                        <ul>
                            <li>
                                Technical Skills:{' '}
                                <textarea
                                    placeholder="e.g. JavaScript, Python, React"
                                    value={formData.skills.technical}
                                    onChange={e => updateNested('skills', 'technical', e.target.value)}
                                />
                            </li>
                            <li>
                                Soft Skills:{' '}
                                <textarea
                                    placeholder="e.g. Communication, Leadership"
                                    value={formData.skills.soft}
                                    onChange={e => updateNested('skills', 'soft', e.target.value)}
                                />
                            </li>
                        </ul>
                    </li>
                </ol>

                <button type="submit" className="submit-btn">
                    SUBMIT
                </button>
            </form>
        </>
    );
}
