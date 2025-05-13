import React, { useState, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, Table, Modal, ButtonIcon , Input, Button } from '../../components';
import { FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import { usePage } from '@inertiajs/inertia-react';
import { usePermissions } from '../../utils/usePermissions';

const Index = ({ customerServices, filters = {}, services = [], statuses = [] }) => {
    const { props } = usePage();
    const userPermissions = props.auth?.permissions || [];

    const [isModalOpen, setModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [searchFilters, setSearchFilters] = useState({
            name: filters.name || '',
            service_id: filters.service_id || '',
            status: filters.status || 0,
        });
    const [isLoadingExport, setIsLoadingExport] = useState(false);

    const { checkMenuPermissions } = usePermissions(userPermissions);
    const { canCreate, canEdit, canDelete, canExport } = checkMenuPermissions('Customer Services');

    const columns = React.useMemo(() => [
        { header: 'Name', field: 'customer.user.name' },
        { header: 'Service', field: 'service.title' },
        { header: 'Status', field: 'status' },
        { header: 'Start Date', field: 'start_date' },
        { header: 'End Date', field: 'end_date' },
    ], []);

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

    const handleFilter = () => {
        Inertia.post(route('customer-services.filter'), searchFilters, { preserveState: true });
    };

    const handleExport = () => {
        setIsLoadingExport(true); 
        const query = new URLSearchParams(searchFilters).toString();
        window.location.href = `/customer-services/export?${query}`;

        setTimeout(() => {
            setIsLoadingExport(false); 
        }, 2000); 
    };

    const handleReset = () => {
        const resetFilters = {
            name: '',
            service_id: '',
            status: '',
        };
        setSearchFilters(resetFilters);
        Inertia.post(route('customer-services.filter'), resetFilters, { preserveState: true });
    };

    const RowActions = ({ rowId }) => (
        <>
            {canEdit && (
                <ButtonIcon
                    href={`/customer-services/${rowId}/edit`}
                    icon={<FaEdit />}
                    iconColor="text-blue-500"
                    hoverColor="hover:text-blue-700"
                    tooltip="Edit"
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
                    tooltip="Delete"
                    size="lg"
                    shadow
                />
            )}
        </>
    );

    return (
        <div className="container mx-auto p-5 mt-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-3xl font-bold dark:text-white">Customer Services</h1>
                {canCreate && (
                    <Link href="/customer-services/create">Add Customer Service</Link>
                )}
            </div>

            <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex flex-col w-full sm:w-1/4">
                    <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-white">Customer Name</label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Filter by Name"
                        value={searchFilters.name}
                        onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
                        className="mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    />
                </div>

                <div className="flex flex-col w-full sm:w-1/4">
                    <label htmlFor="service" className="text-sm font-semibold text-gray-700 dark:text-white">Services</label>
                    <select
                        id="service_id"
                        name="service_id"
                        value={searchFilters.service_id} 
                        onChange={(e) => {
                            setSearchFilters({
                                ...searchFilters,
                                service_id: e.target.value, 
                            });
                        }}
                        className="mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    >
                        <option value="">Select Service</option> 
                        {services.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col w-full sm:w-1/4">
                    <label htmlFor="status" className="text-sm font-semibold text-gray-700 dark:text-white">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={searchFilters.status} 
                        onChange={(e) => {
                            setSearchFilters({
                                ...searchFilters,
                                status: e.target.value, 
                            });
                        }}
                        className="mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    >
                        <option value="">Select Status</option>
                        {statuses.map(s => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-between gap-4 mt-6">
                <div className="flex gap-4">
                    <Button
                        onClick={handleFilter}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    >
                        Search
                    </Button>

                    <Button
                        onClick={handleReset}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all"
                    >
                        Reset
                    </Button>
                </div>

                {canExport && (
                    <Button
                        onClick={handleExport}
                        className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                    >
                        {isLoadingExport ? (
                            <span>Exporting...</span>
                        ) : (
                            <>
                                <FaDownload /> Export
                            </>
                        )}
                    </Button>
                )}
            </div>

            <Table
                columns={columns}
                tableData={customerServices}
                actions={(row) => <RowActions rowId={row.id} />}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this customer service record?"
                buttonText="Delete"
            />
        </div>
    );
};

export default Index;
