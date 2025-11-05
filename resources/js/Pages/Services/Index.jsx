import React, { useState, useCallback } from 'react';
import { Button, Modal, Table, ButtonIcon } from '../../components';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { usePermissions } from '../../utils/usePermissions';
import useIsMobile from '@/utils/useIsMobile';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const ServiceForm = ({ agent = null, services = [], statuses = [] }) => {
    const { props } = usePage();
    const userPermissions = props.auth?.permissions || [];
    const isMobile = useIsMobile();

    const { language } = useLanguage();
    const t = translations[language];

    const [formData] = useState({
        biz_name: agent?.biz_name || '',
        phone: agent?.phone || '',
        location: agent?.location || '',
        email: agent.user?.email || ''
    });

    const [expandedServiceId, setExpandedServiceId] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    const toggleService = (id) => {
        setExpandedServiceId(prev => (prev === id ? null : id));
    };

    const { checkMenuPermissions } = usePermissions(userPermissions);
    const { canEdit, canDelete } = checkMenuPermissions('Services');

    const handleDeleteClick = useCallback((id) => {
        setServiceToDelete(id);
        setModalOpen(true);
    }, []);

    const handleDelete = () => {
        if (serviceToDelete) {
            Inertia.delete(`/services/${serviceToDelete}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    setServiceToDelete(null);
                },
            });
        }
    };

    const handleEdit = (serviceId) => {
        Inertia.get(`/services/${serviceId}/edit`);
    };

    const columns = [
        { header: t.category, field: 'category.name' },
        { header: t.subcategory, field: 'subcategory.name' },
        { header: t.name, field: 'title' },
        { header: t.serviceCost, field: 'cost' },
        { header: t.serviceDuration, field: 'duration' },
        {
            header: t.serviceStatus,
            field: 'status',
            render: (row) => {
                const status = statuses.find(s => s.value === row.status);
                return status ? status.label : row.status;
            },
        },
    ];

    const RowActions = ({ rowId }) => (
        <div className="flex gap-2 justify-center">
            {canEdit && (
                <ButtonIcon
                    onClick={() => handleEdit(rowId)}
                    icon={<FaEdit />}
                    iconColor="text-blue-500"
                    hoverColor="hover:text-blue-700"
                    tooltip={t.edit}
                    size="lg"
                    shadow
                />
            )}
            {canDelete && (
                <ButtonIcon
                    onClick={() => handleDeleteClick(rowId)}
                    icon={<FaTrash />}
                    iconColor="text-red-500"
                    hoverColor="hover:text-red-700"
                    tooltip={t.delete}
                    size="lg"
                    shadow
                    data-testid={`delete-btn-${rowId}`}
                />
            )}
        </div>
    );

    const renderMobileView = () => (
        <div className="p-6 text-sm bg-white">
            <div className="grid gap-4">
                {[
                    { label: t.bizName, field: 'biz_name' },
                    { label: t.phoneNumber, field: 'phone' },
                    { label: t.location, field: 'location' },
                    { label: t.emailAddress, field: 'email' }
                ].map(({ label, field }, index) => (
                    <div key={index} className="grid grid-cols-3 items-center gap-2">
                        <label className="font-medium">{label}</label>
                        <input
                            type="text"
                            value={formData[field] || ''}
                            readOnly
                            className="col-span-2 border px-3 py-2 rounded bg-gray-100 cursor-not-allowed w-full"
                        />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 space-y-4 mb-4">
                <div className="md:col-span-1">
                    <h2 className="font-bold mt-6">{t.availableServices}</h2>
                </div>

                <div className="md:col-span-3 space-y-4 my-4">
                    {Array.isArray(services?.data) &&
                        services.data.map((service) => (
                            <div key={service.id} className="border rounded">
                                <button
                                    onClick={() => toggleService(service.id)}
                                    className="w-full flex justify-between items-center text-left px-4 py-3 font-medium bg-secondary-theme-color hover:bg-gray-200 rounded-t"
                                >
                                    <span>{service.title || service.name}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-300 transform ${expandedServiceId === service.id ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {expandedServiceId === service.id && (
                                    <div className="px-4 py-4 bg-white border-t space-y-2">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">{t.serviceDuration}</label>
                                                    <input
                                                        type="text"
                                                        className="w-full border rounded px-3 py-2 bg-gray-200 text-sm"
                                                        readOnly
                                                        value={service.duration || ''}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">{t.serviceCost}</label>
                                                    <input
                                                        type="text"
                                                        className="w-full border rounded px-3 py-2 bg-gray-200 text-sm"
                                                        readOnly
                                                        value={service.cost || ''}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">{t.serviceDetail}</label>
                                                <div
                                                    className="w-full border rounded px-3 py-2 bg-gray-200 text-sm"
                                                    dangerouslySetInnerHTML={{ __html: service.detail || t.noDetails }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button onClick={() => handleEdit(service.id)} className="bg-blue-500 text-white px-2 py-1 rounded">
                                                {t.edit}
                                            </Button>
                                            <Button onClick={() => handleDeleteClick(service.id)} className="bg-gray-500 text-white px-2 py-1 rounded">
                                                {t.delete}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDelete}
                title={t.confirmDelete}
                message={t.deleteMessage}
                buttonText={t.deleteButton}
            />
        </div>
    );

    const renderDesktopView = () => (
        <div className="mx-4 my-6 sm:mx-10 sm:my-10">
            <div className="grid gap-4">
                {[
                    { label: t.bizName, field: 'biz_name' },
                    { label: t.phoneNumber, field: 'phone' },
                    { label: t.location, field: 'location' },
                    { label: t.emailAddress, field: 'email' }
                ].map(({ label, field }, index) => (
                    <div key={index} className="grid grid-cols-3 items-center gap-2">
                        <label className="font-medium">{label}</label>
                        <input
                            type="text"
                            value={formData[field] || ''}
                            readOnly
                            className="col-span-2 border px-3 py-2 rounded bg-gray-100 cursor-not-allowed w-full"
                        />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 space-y-6 mb-4">
                <div className="md:col-span-1">
                    <h2 className="font-bold mt-6 mb-4">{t.availableServices}</h2>
                </div>
            </div>

            <Table
                columns={columns}
                tableData={services}
                onPageChange={(page) => {
                    Inertia.get(`/services?page=${page}`, { preserveState: true });
                }}
                actions={(row) => <RowActions rowId={row.id} />}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDelete}
                title={t.confirmDelete}
                message={t.deleteMessage}
                buttonText={t.deleteButton}
            />
        </div>
    );

    return isMobile ? renderMobileView() : renderDesktopView();
};

export default ServiceForm;
