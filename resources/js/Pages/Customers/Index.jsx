import React, { useState, useCallback, useMemo } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { Link, Table, Modal, ButtonIcon, Input, Button } from '../../components';
import { FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import { usePermissions } from '../../utils/usePermissions';

const Index = ({ customers, filters = {} }) => {
    const { props } = usePage();
    const userPermissions = props.auth?.permissions || [];

    const [isModalOpen, setModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [searchFilters, setSearchFilters] = useState({
        customer_id: filters.customer_id || '',
        name: filters.name || '',
        phone: filters.phone || '',
    });
    const [isLoadingExport, setIsLoadingExport] = useState(false);

    const [importFile, setImportFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [isImportModalOpen, setImportModalOpen] = useState(false);

    const { checkMenuPermissions } = usePermissions(userPermissions);
    const { canCreate, canEdit, canDelete, canExport } = checkMenuPermissions('Customers');

    const columns = useMemo(() => [
        { header: 'Customer ID', field: 'customer_id' },
        { header: 'Cus ID', field: 'cus_id' },
        { header: 'Name', field: 'user.name' },
        { header: 'Email', field: 'user.email' },
        { header: 'Date of Birth', field: 'dob' },
        { header: 'Phone', field: 'phone' },
    ], []);

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

    const handleFilter = () => {
        Inertia.post(route('customers.filter'), searchFilters, { preserveState: true });
    };

    const handleExport = () => {
        setIsLoadingExport(true); 
        const query = new URLSearchParams(searchFilters).toString();
        window.location.href = `/customers/export?${query}`;

        setTimeout(() => {
            setIsLoadingExport(false); 
        }, 2000); 
    };

    const handleImport = () => {
        if (!importFile) return;
    
        const formData = new FormData();
        formData.append('file', importFile);
    
        setIsImporting(true);
    
        Inertia.post('/customers/import', formData, {
            onFinish: () => {
                setIsImporting(false);
                setImportFile(null);
                setImportModalOpen(false);
            },
        });
    };

    const handleReset = () => {
        const resetFilters = {
            customer_id: '',
            name: '',
            phone: '',
        };
        setSearchFilters(resetFilters);
        Inertia.post(route('customers.filter'), resetFilters, { preserveState: true });
    };

    const RowActions = ({ rowId }) => (
        <div className="flex gap-2 justify-center">
            {canEdit && (
                <ButtonIcon
                    href={`/customers/${rowId}/edit`}
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
        </div>
    );

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold dark:text-white">Customers</h1>
                <div className="flex gap-4">
                    {canCreate && (
                        <>
                            <Link
                                href="/customers/create"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Add Customer
                            </Link>

                            <Button
                                onClick={() => setImportModalOpen(true)}
                                className="bg-primary-theme-color text-white px-4 py-2 rounded hover:bg-secondary-theme-color transition"
                            >
                                Import Excel
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex flex-col w-full sm:w-1/4">
                    <label htmlFor="customer_id" className="text-sm font-semibold text-gray-700 dark:text-white">Customer ID</label>
                    <Input
                        id="customer_id"
                        type="text"
                        placeholder="Filter by Customer ID"
                        value={searchFilters.customer_id}
                        onChange={(e) => setSearchFilters({ ...searchFilters, customer_id: e.target.value })}
                        className="mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    />
                </div>

                <div className="flex flex-col w-full sm:w-1/4">
                    <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-white">Name</label>
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
                    <label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-white">Phone</label>
                    <Input
                        id="phone"
                        type="text"
                        placeholder="Filter by Phone"
                        value={searchFilters.phone}
                        onChange={(e) => setSearchFilters({ ...searchFilters, phone: e.target.value })}
                        className="mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    />
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
                tableData={customers}
                onPageChange={(page) => {
                    Inertia.get('/customers', { ...searchFilters, page }, { preserveState: true });
                }}
                actions={(row) => <RowActions rowId={row.id} />}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this customer?"
                buttonText="Delete"
            />

            {/* Import Excel Modal */}
            <Modal
                isOpen={isImportModalOpen}
                onClose={() => setImportModalOpen(false)}
                title="Import Customers"
                buttonText="Import"
                onConfirm={handleImport}
                buttonDisabled={!importFile || isImporting}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Upload an Excel file (.csv, .xlsx, .xls) to import customers.
                    </p>

                    <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={(e) => setImportFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-0 file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />

                    {isImporting && <p className="text-sm text-blue-600">Importing...</p>}
                </div>
            </Modal>
        </div>
    );
};

export default Index;
