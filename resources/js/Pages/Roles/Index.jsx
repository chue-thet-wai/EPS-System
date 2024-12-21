import React, { useState, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, Table, Modal, ButtonIcon } from '../../components';
import { FaEdit, FaTrash } from 'react-icons/fa';

const RoleIndex = ({ roles }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    // Define table columns for roles
    const columns = React.useMemo(() => [
        { header: 'ID', field: 'id' },
        { header: 'Name', field: 'name' },
    ], []);

    // Handle delete modal opening
    const handleDeleteClick = useCallback((id) => {
        setRoleToDelete(id);
        setModalOpen(true);
    }, []);

    // Perform role deletion
    const handleDelete = useCallback(() => {
        if (roleToDelete) {
            Inertia.delete(`/roles/${roleToDelete}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    setRoleToDelete(null);
                },
            });
        }
    }, [roleToDelete]);

    // Row actions (Edit and Delete)
    const RowActions = ({ rowId }) => (
        <>
            <ButtonIcon
                href={`/roles/${rowId}/edit`}
                icon={<FaEdit />}
                iconColor="text-blue-500"
                hoverColor="hover:text-blue-700"
                tooltip="Edit"
                size="lg"
                shadow={true}
            />
            <ButtonIcon
                onClick={() => handleDeleteClick(rowId)}
                icon={<FaTrash />}
                iconColor="text-red-500"
                hoverColor="hover:text-red-700"
                tooltip="Delete"
                size="lg"
                shadow={true}
            />
        </>
    );

    return (
        <div className="container mx-auto p-5 mt-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-3xl font-bold dark:text-white">Roles</h1>
                <Link href="/roles/create" className="btn btn-primary">Add Role</Link>
            </div>

            <Table
                columns={columns}
                tableData={roles}
                onPageChange={(page) => {
                    Inertia.get(`/roles?page=${page}`, { preserveState: true });
                }}
                actions={(row) => <RowActions rowId={row.id} />}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this role?"
                buttonText="Delete"
            />
        </div>
    );
};

export default RoleIndex;
