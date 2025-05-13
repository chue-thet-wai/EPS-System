import React, { useState, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, Table, Modal, ButtonIcon } from '../../components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { usePage } from '@inertiajs/inertia-react';
import { usePermissions } from '../../utils/usePermissions';

const Index = ({ users }) => {
    const { props } = usePage();
    const userPermissions = props.auth?.permissions || [];

    const [isModalOpen, setModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const { checkMenuPermissions } = usePermissions(userPermissions);
    const { canCreate, canEdit, canDelete, canExport } = checkMenuPermissions('Users');

    const columns = React.useMemo(() => [
        { header: 'Name', field: 'name' },
        { header: 'Email', field: 'email' },
        { header: 'Role', field: 'role' },
    ], []);

    const handleDeleteClick = useCallback((id) => {
        setUserToDelete(id);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback(() => {
        if (userToDelete) {
            Inertia.delete(`/users/${userToDelete}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    setUserToDelete(null);
                },
            });
        }
    }, [userToDelete]);

    const RowActions = ({ rowId }) => (
        <>
            {canEdit && (
                <ButtonIcon
                    href={`/users/${rowId}/edit`}
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
                <h1 className="text-3xl font-bold dark:text-white">Users</h1>
                {canCreate && (
                    <Link href="/users/create">Add User</Link>
                )}
            </div>

            <Table
                columns={columns}
                tableData={users} 
                onPageChange={(page) => {
                    Inertia.get(`/users?page=${page}`, { preserveState: true });
                }}
                actions={(row) => <RowActions rowId={row.id} />}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this user?"
                buttonText="Delete"
            />
        </div>
    );
};

export default Index;
