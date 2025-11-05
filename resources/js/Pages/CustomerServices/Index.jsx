import React, { useState, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, Table, Modal, ButtonIcon } from '../../components';
import { FaTrash, FaSearch, FaSyncAlt, FaPlus } from 'react-icons/fa';
import { usePage } from '@inertiajs/inertia-react';
import { usePermissions } from '../../utils/usePermissions';
import moment from 'moment';
import useIsMobile from '@/utils/useIsMobile';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const Index = ({ customerServices, filters = {}, customers = [], services = [], statuses = [], statusSummary = {} }) => {
    const { props } = usePage();
    const userPermissions = props.auth?.permissions || [];
    const isMobile = useIsMobile();
    const { language } = useLanguage();
    const t = translations[language];

    const [isModalOpen, setModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    const [searchFilters, setSearchFilters] = useState({
        customer_id: filters.customer_id || '',
        service_id: filters.service_id || '',
        status: filters.status || '',
    });

    const { checkMenuPermissions } = usePermissions(userPermissions);
    const { canCreate, canEdit, canDelete } = checkMenuPermissions('Customer Services');

    const columns = React.useMemo(() => [
        { header: t.customerId, field: 'customer.cus_id' },
        { header: t.nameEng, field: 'customer.user.name' },
        { header: t.serviceRequestType, field: 'service.title' },
        { header: t.requestDate, field: 'created_at', render: (row) => moment(row.created_at).format('YYYY-MM-DD H:m:s') },
        { header: t.requestBy, field: 'creator.name' },
        { header: t.serviceStatus, field: 'status' },
    ], [t]);

    const handleDeleteClick = useCallback((id) => {
        setRecordToDelete(id);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback(() => {
        if (recordToDelete) {
            Inertia.delete(`/customer-services/${recordToDelete}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    setRecordToDelete(null);
                },
            });
        }
    }, [recordToDelete]);

    const RowActions = ({ rowId }) => (
        <>
            {canEdit && (
                <Link
                    href={`/customer-services/${rowId}/edit`}
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
        </>
    );

    const handleFilter = () => {
        Inertia.get(route('customer-services.index'), searchFilters);
    };

    const handleReset = () => {
        setSearchFilters({ customer_id: '', service_id: '', status: '' });
        Inertia.get(route('customer-services.index'));
    };

    const renderMobile = () => (
        <div className="p-4 bg-white text-sm">
            {canCreate && (
                <div className="mb-4 flex justify-end">
                    <Link
                        href="/customer-services/create"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        <FaPlus />
                        {t.addService}
                    </Link>
                </div>
            )}

            <div className='my-4'>
                <label htmlFor="search" className="block text-sm font-medium mb-1">{t.searchCustomer}</label>
                <div className="flex">
                    <input
                        type="text"
                        id="search"
                        placeholder={t.enterCustomerId}
                        value={searchFilters.customer_id}
                        onChange={(e) => setSearchFilters({ ...searchFilters, customer_id: e.target.value })}
                        className="w-2/3 flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none"
                    />
                    <button className="w-1/3 bg-gray-300 text-black px-4 rounded-r" onClick={handleFilter}>
                        {t.search}
                    </button>
                </div>
            </div>

            {customerServices.data.map((cservice, index) => (
                <div
                    key={cservice.customer.id}
                    className={`flex px-3 py-2 text-sm ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'}`}
                >
                    <div className="w-1/3 flex flex-col justify-start items-center text-black pr-2">
                        <div className="font-bold mb-1 text-center">{cservice.customer.user?.name || ''}</div>
                        <img
                            className="w-10 h-10 rounded-full object-cover"
                            src="/assets/images/profile.jpg"
                            alt="User"
                        />
                    </div>

                    <div className="w-2/3 text-black flex flex-col justify-between pl-2 pt-2 break-words whitespace-normal">
                        <div className="space-y-1 leading-snug">
                            <div>{t.customerId}: {cservice.customer.customer_id || ''}</div>
                            <div>{t.serviceRequestType}: {cservice.service.title || ''}</div>
                            <div>{t.requestDate}: {moment(cservice.created_at).format('YYYY-MM-DD') || ''}</div>
                            <div>{t.serviceStatus}: {cservice.status || ''} </div>
                        </div>
                        <div className="flex justify-end">
                            <Link
                                href={`/customer-services/${cservice.id}/edit`}
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
        <div className="container mx-auto p-5 mt-5">
            <div className="flex justify-end items-center mb-5">
                {canCreate && (
                    <Link href="/customer-services/create">{t.addServiceActivity}</Link>
                )}
            </div>

            <div className="grid grid-cols-5 text-center text-white font-semibold my-6">
                {Object.entries(statusSummary).map(([label, count], index) => (
                    <div key={index} className="border border-gray-100">
                        <div className="bg-black py-2 border-b border-gray-100">{label}</div>
                        <div className="bg-gray-300 py-2 text-black font-normal border-t border-gray-100">{count}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-end gap-4 mt-6 mb-10">
                <div className="flex flex-col">
                    <label htmlFor="customer_id" className="text-sm font-semibold text-gray-700 dark:text-white">{t.customerId}</label>
                    <select
                        id="customer_id"
                        name="customer_id"
                        value={searchFilters.customer_id}
                        onChange={(e) => setSearchFilters({ ...searchFilters, customer_id: e.target.value })}
                        className="w-56 mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">{t.selectCustomer}</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.cus_id}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="status" className="text-sm font-semibold text-gray-700 dark:text-white">{t.serviceStatus}</label>
                    <select
                        id="status"
                        name="status"
                        value={searchFilters.status}
                        onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value })}
                        className="w-56 mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">{t.selectStatus}</option>
                        {statuses.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="service_id" className="text-sm font-semibold text-gray-700 dark:text-white">{t.serviceRequestType}</label>
                    <select
                        id="service_id"
                        name="service_id"
                        value={searchFilters.service_id}
                        onChange={(e) => setSearchFilters({ ...searchFilters, service_id: e.target.value })}
                        className="w-56 mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">{t.selectService}</option>
                        {services.map(s => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-wrap justify-start md:ml-auto md:justify-end gap-2 mt-4 md:mt-0 w-full md:w-auto">
                    <button
                        onClick={handleFilter}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                        <FaSearch />
                        {t.search}
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 border border-gray-300 bg-gray-100 text-black px-4 py-2 rounded-lg hover:bg-gray-200"
                    >
                        <FaSyncAlt />
                        {t.refresh}
                    </button>
                </div>
            </div>

            <Table
                columns={columns}
                tableData={customerServices}
                onPageChange={(page) => {
                    Inertia.get('/customer-services', { ...searchFilters, page }, { preserveState: true });
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
