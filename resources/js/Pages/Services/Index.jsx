import React, { useState, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, Table, Modal, ButtonIcon } from '../../components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { usePage } from '@inertiajs/inertia-react';
import { usePermissions } from '../../utils/usePermissions';

const Index = ({ services }) => {
    const { props } = usePage();
    const userPermissions = props.auth?.permissions || [];

    const [isModalOpen, setModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    const { checkMenuPermissions } = usePermissions(userPermissions);
    const { canCreate, canEdit, canDelete, canExport } = checkMenuPermissions('Services');

    const columns = React.useMemo(() => [
        { header: 'Title', field: 'title' },
        { header: 'Category', field: 'category.name' },
        { header: 'Agent', field: 'user.name' },
    ], []);

    const handleDeleteClick = useCallback((id) => {
        setServiceToDelete(id);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback(() => {
        if (serviceToDelete) {
            Inertia.delete(`/services/${serviceToDelete}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    setServiceToDelete(null);
                },
            });
        }
    }, [serviceToDelete]);

    const RowActions = ({ rowId }) => (
        <>
            {canEdit && (
                <ButtonIcon
                    href={`/services/${rowId}/edit`}
                    icon={<FaEdit />}
                    iconColor="text-blue-500"
                    hoverColor="hover:text-blue-700"
                    tooltip="Edit"
                    size="lg"
                    shadow={true}
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
                    shadow={true}
                />
            )}
        </>
    );

    return (
        <div className="container mx-auto p-5 mt-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-3xl font-bold dark:text-white">Services</h1>
                {canCreate && (
                    <Link href="/services/create">Add Service</Link>
                )}
            </div>

            <Table
                columns={columns}
                tableData={services}
                onPageChange={(page) => {
                    Inertia.get(`/services?page=${page}`, { preserveState: true });
                }}
                actions={(row) => <RowActions rowId={row.id} />}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this service?"
                buttonText="Delete"
            />
        </div>
    );
};

export default Index;
