import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Select, FileInput, Button, FieldSet } from '../../components';

const TeacherForm = ({ teacher = null, users = [], positions = [] }) => {
    const [formData, setFormData] = useState({
        user_id: teacher?.user_id || '',
        name: teacher?.name || '',
        name_mm: teacher?.name_mm || '',
        login_name: teacher?.login_name || '',
        startworking_date: teacher?.startworking_date || '',
        gender: teacher?.gender || '',
        email: teacher?.email || '',
        contact_number: teacher?.contact_number || '',
        address: teacher?.address || '',
        remark: teacher?.remark || '',
        resign_status: teacher?.resign_status || 1,
        resign_date: teacher?.resign_date || '',
        profile_image: '',
        father_name: teacher?.father_name || '',
        mother_name: teacher?.mother_name || '',
        position: teacher?.position || '',
        qualification_name: teacher?.qualification_name || '',
        year_attended: teacher?.year_attended || '',
        qualification_desc: '',
        job_title: teacher?.job_title || '',
        company_name: teacher?.company_name || '',
        start_date: teacher?.start_date || '',
        end_date: teacher?.end_date || '',
        university: teacher?.university || '',
        education_year: teacher?.education_year || '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [expandedFieldsets, setExpandedFieldsets] = useState({
        personalInfo: true,
        familyInfo: true,
        qualification: true,
        employmentHistory: true
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        const action = teacher ? 'put' : 'post';
        const url = teacher ? `/teachers/${teacher.id}` : '/teachers';

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        Inertia[action](url, formDataToSend, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                Inertia.visit('/teachers');
                setProcessing(false);
            },
        });
    };

    const toggleFieldset = (fieldset) => {
        setExpandedFieldsets((prevState) => ({
            ...prevState,
            [fieldset]: !prevState[fieldset],
        }));
    };

    return (
        <div className="m-10">
            <h1 className="text-2xl font-bold mb-5 dark:text-white">
                {teacher ? 'Edit Teacher' : 'Add Teacher'}
            </h1>
            <FormWrapper onSubmit={handleSubmit}>
                {/* Personal Information */}
                <FieldSet
                    title="Personal Information"
                    expanded={expandedFieldsets.personalInfo}
                    onToggle={() => toggleFieldset('personalInfo')}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="name" required className="text-sm font-medium text-gray-600">Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="name_mm" required className="text-sm font-medium text-gray-600">Name (Myanmar)</Label>
                            <Input id="name_mm" name="name_mm" value={formData.name_mm} onChange={handleChange} error={errors.name_mm} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                        <div>
                            <Label htmlFor="gender" required className="text-sm font-medium text-gray-600">Gender</Label>
                            <Select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]}
                                error={errors.gender}
                            />
                        </div>

                        <div>
                            <Label htmlFor="email" required className="text-sm font-medium text-gray-600">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                        </div>
                    </div>
                </FieldSet>

                {/* Family Information */}
                <FieldSet
                    title="Family Information"
                    expanded={expandedFieldsets.familyInfo}
                    onToggle={() => toggleFieldset('familyInfo')}
                >
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="father_name">Father Name</Label>
                            <Input id="father_name" name="father_name" value={formData.father_name} onChange={handleChange} />
                        </div>

                        <div className="flex-1">
                            <Label htmlFor="mother_name">Mother Name</Label>
                            <Input id="mother_name" name="mother_name" value={formData.mother_name} onChange={handleChange} />
                        </div>
                    </div>
                </FieldSet>

                {/* Qualification */}
                <FieldSet
                    title="Qualification"
                    expanded={expandedFieldsets.qualification}
                    onToggle={() => toggleFieldset('qualification')}
                >
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="qualification_name">Qualification Name</Label>
                            <Input id="qualification_name" name="qualification_name" value={formData.qualification_name} onChange={handleChange} />
                        </div>

                        <div className="flex-1">
                            <Label htmlFor="qualification_desc">Upload Qualification Description</Label>
                            <FileInput id="qualification_desc" name="qualification_desc" onChange={handleChange} />
                        </div>
                    </div>
                </FieldSet>


                {/* Employment History */}
                <FieldSet
                    title="Employment History"
                    expanded={expandedFieldsets.employmentHistory}
                    onToggle={() => toggleFieldset('employmentHistory')}
                >
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="job_title">Job Title</Label>
                            <Input id="job_title" name="job_title" value={formData.job_title} onChange={handleChange} />
                        </div>
                    </div>
                </FieldSet>

                {/* Resign Status */}
                <div>
                    <Label htmlFor="resign_status">Resign Status</Label>
                    <Select
                        id="resign_status"
                        name="resign_status"
                        value={formData.resign_status}
                        onChange={handleChange}
                        options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                    />
                </div>

                {/* Profile Image */}
                <div>
                    <Label htmlFor="profile_image">Profile Image</Label>
                    <FileInput
                        id="profile_image"
                        name="profile_image"
                        onChange={handleChange}
                        previewImage={true} // Enable preview for profile image
                    />
                </div>

                <div className="flex justify-end mt-4 space-x-3">
                    <Button type="button" onClick={() => Inertia.visit('/teachers')} variant="secondary">Cancel</Button>
                    <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save'}</Button>
                </div>
            </FormWrapper>
        </div>
    );
};

export default TeacherForm;
