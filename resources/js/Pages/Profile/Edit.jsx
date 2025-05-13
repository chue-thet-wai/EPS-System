import React, { useState } from 'react';
import { FormWrapper, Label, Input, Button } from '../../components';
import { Inertia } from '@inertiajs/inertia';

const ProfileForm = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors
    setProcessing(true);

    Inertia.post('/profile/update', formData, {
      onError: (errorResponse) => {
        setErrors(errorResponse);
        setProcessing(false);
      },
      onSuccess: (response) => {
        setProcessing(false);
      },
    });
  };

  return (
    <div className="m-10">
      <h1 className="text-2xl font-bold mb-5 dark:text-white">Edit Profile</h1>

      <FormWrapper onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name" required>Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            error={errors.name}
          />
        </div>

        <div>
          <Label htmlFor="email" required>Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
          />
        </div>

        <div>
          <Label htmlFor="password">
            Password <span className="text-xs text-gray-500">(leave blank to keep current password)</span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New password"
            error={errors.password}
          />
        </div>

        <div>
          <Label htmlFor="password_confirmation">Confirm Password</Label>
          <Input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm new password"
            error={errors.password_confirmation}
          />
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <Button
            onClick={() => Inertia.visit('/dashboard')}
            variant="secondary"
            disabled={processing}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={processing}>
            {processing ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </FormWrapper>
    </div>
  );
};

export default ProfileForm;
