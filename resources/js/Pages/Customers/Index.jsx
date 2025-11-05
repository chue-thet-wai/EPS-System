import React, { useState, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { Link, Table, Modal, ButtonIcon } from '../../components';
import { FaTrash } from 'react-icons/fa';
import { usePermissions } from '../../utils/usePermissions';
import { IoPersonAdd } from "react-icons/io5";
import useIsMobile from '@/utils/useIsMobile';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const Index = ({ customers, filters = {} }) => {
    const { props } = usePage();
    const userPermissions = props.auth?.permissions || [];
    const isMobile = useIsMobile();
    const { language } = useLanguage();
    const t = translations[language];

    const [isModalOpen, setModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const { checkMenuPermissions } = usePermissions(userPermissions);
    const { canCreate, canEdit, canDelete } = checkMenuPermissions('Customers');

    const [searchFilters, setSearchFilters] = useState({
        customer_id: filters.customer_id || ''
    });

    const handleDeleteClick = useCallback((id) => {
        setCustomerToDelete(id);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback(() => {
        if (customerToDelete) {
            Inertia.delete(`/customers/${customerToDelete}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    setCustomerToDelete(null);
                },
            });
        }
    }, [customerToDelete]);

    const handleFilter = useCallback(() => {
        Inertia.get(route('customers.index'), searchFilters, {
            preserveScroll: true,
            preserveState: true,
        });
    }, [searchFilters]);

    const handleInputChange = (e) => {
        setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
    };

    const RowActions = ({ rowId }) => (
        <div className="flex gap-2 justify-center">
            {canEdit && (
                <Link
                    href={`/customers/${rowId}/edit`}
                    className="text-black underline bg-transparent border-none hover:bg-transparent"
                >
                    {t.view}
                </Link>
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

    const columns = [
        { header: t.customerId, field: 'customer_id' },
        { header: t.nameEng, field: 'user.name' },
        { header: t.nameMm, field: 'name_mm' },
        { header: t.nrcNo, field: 'nrc_no' },
        { header: t.passportNo, field: 'passport_no' },
        { header: t.passportExpiry, field: 'passport_expiry' },
        { header: t.visaType, field: 'visa_type' },
        { header: t.visaExpiry, field: 'visa_expiry' },
    ];

    const renderMobile = () => (
        <div className="p-4 bg-white text-sm">
            <div className='my-4'>
                <label htmlFor="search" className="block text-sm font-medium mb-1">
                    {t.searchCustomerIdLabel}
                </label>
                <div className="flex">
                    <input
                        type="text"
                        id="search"
                        name="customer_id"
                        value={searchFilters.customer_id}
                        onChange={handleInputChange}
                        placeholder={t.enterCustomerId}
                        className="w-2/3 flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none"
                    />
                    <button
                        className="w-1/3 bg-gray-300 text-black px-4 rounded-r"
                        onClick={handleFilter}
                    >
                        {t.search}
                    </button>
                </div>
            </div>

            {customers.data.map((customer, index) => (
                <div
                    key={customer.id}
                    className={`flex px-3 py-2 text-sm ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'}`}
                >
                    <div className="w-1/3 flex flex-col justify-start items-center text-black pr-2">
                        <div className="font-bold mb-1 text-center">{customer.user?.name || ''}</div>
                        <img
                            className="w-10 h-10 rounded-full object-cover"
                            src="/assets/images/profile.jpg"
                            alt="User"
                        />
                    </div>
                    <div className="w-2/3 text-black flex flex-col justify-between pl-2 pt-2 break-words whitespace-normal">
                        <div className="space-y-1 leading-snug">
                            <div>{t.customerIdShort}: {customer.customer_id || ''}</div>
                            <div>{t.nrcNo}: {customer.nrc_no || ''}</div>
                            <div>{t.passportNo}: {customer.passport_no || ''}</div>
                            <div>{t.visaType}: {customer.visa_type || ''} ({customer.visa_expiry || ''})</div>
                        </div>
                        <div className="flex justify-end">
                            <Link
                                href={`/customers/${customer.id}/edit`}
                                className="text-sm text-white bg-transparent"
                            >
                                {t.viewDetails}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {customers.next_page_url && (
                <button
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
                    onClick={() => Inertia.get(customers.next_page_url, {}, { preserveScroll: true })}
                >
                    {t.loadMore}
                </button>
            )}
        </div>
    );

    const renderDesktop = () => (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-white">{t.customers}</h1>
                {canCreate && (
                    <Link
                        href="/customers/create"
                        className="flex items-center gap-2 bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 transition font-bold"
                    >
                        <IoPersonAdd /> {t.addNewCustomer}
                    </Link>
                )}
            </div>

            <div className="flex mb-4">
                <input
                    type="text"
                    name="customer_id"
                    value={searchFilters.customer_id}
                    onChange={handleInputChange}
                    placeholder={t.searchCustomerId}
                    className="px-3 py-2 border border-gray-300 rounded-l focus:outline-none"
                />
                <button
                    onClick={handleFilter}
                    className="bg-primary-theme-color text-black px-4 py-2 rounded-r hover:secondary-theme-color"
                >
                    {t.search}
                </button>
            </div>

            <Table
                columns={columns}
                tableData={customers}
                onPageChange={(page) => {
                    Inertia.get('/customers', { ...searchFilters, page }, { preserveState: true });
                }}
                actions={(row) => <RowActions rowId={row.id} />}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDelete}
                title={t.confirmDelete}
                message={t.deleteMessage}
                buttonText={t.delete}
            />
        </div>
    );

    return isMobile ? renderMobile() : renderDesktop();
};

export default Index;
