import React, { useState } from 'react';
import { FormWrapper, Label, Input, Button } from '../../components';
import { Inertia } from '@inertiajs/inertia';
import useIsMobile from '@/utils/useIsMobile';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';


const ProfileForm = ({ user }) => {
  const { language } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const isMobile = useIsMobile();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setProcessing(true);

    Inertia.post('/profile/update', formData, {
      onError: (errorResponse) => {
        setErrors(errorResponse);
        setProcessing(false);
      },
      onSuccess: () => {
        setProcessing(false);
      },
    });
  };

  const renderMobile = () => (
    <div className="mx-4 my-6 sm:mx-10 sm:my-10 text-sm">
      <h1 className="text-xl font-bold mb-5 dark:text-white">{t.editProfile}</h1>

      <FormWrapper onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name" required>{t.name}</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t.enterYourName}
            error={errors.name}
            className="bg-gray-100"
          />
        </div>

        <div>
          <Label htmlFor="email" required>{t.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t.enterYourEmail}
            error={errors.email}
            className="bg-gray-100"
          />
        </div>

        <div>
          <Label htmlFor="password">
            {t.password} <span className="text-xs text-gray-500">({t.leaveBlankPassword})</span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t.newPassword}
            error={errors.password}
            className="bg-gray-100"
          />
        </div>

        <div>
          <Label htmlFor="password_confirmation">{t.confirmPassword}</Label>
          <Input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder={t.confirmNewPassword}
            error={errors.password_confirmation}
            className="bg-gray-100"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <Button
            onClick={() => Inertia.visit('/dashboard')}
            variant="secondary"
            disabled={processing}
          >
            {t.cancel}
          </Button>
          <Button type="submit" disabled={processing}>
            {processing ? t.updating : t.updateProfile}
          </Button>
        </div>
      </FormWrapper>
    </div>
  );

  const renderDesktop = () => (
    <div className="mx-4 my-6 sm:mx-10 sm:my-10">
      <h1 className="text-2xl font-bold mb-5 dark:text-white">{t.editProfile}</h1>

      <FormWrapper onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name" required>{t.name}</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t.enterYourName}
            error={errors.name}
          />
        </div>

        <div>
          <Label htmlFor="email" required>{t.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t.enterYourEmail}
            error={errors.email}
          />
        </div>

        <div>
          <Label htmlFor="password">
            {t.password} <span className="text-xs text-gray-500">({t.leaveBlankPassword})</span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t.newPassword}
            error={errors.password}
          />
        </div>

        <div>
          <Label htmlFor="password_confirmation">{t.confirmPassword}</Label>
          <Input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder={t.confirmNewPassword}
            error={errors.password_confirmation}
          />
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <Button
            onClick={() => Inertia.visit('/dashboard')}
            variant="secondary"
            disabled={processing}
          >
            {t.cancel}
          </Button>
          <Button type="submit" disabled={processing}>
            {processing ? t.updating : t.updateProfile}
          </Button>
        </div>
      </FormWrapper>
    </div>
  );

  return isMobile ? renderMobile() : renderDesktop();
};

export default ProfileForm;
