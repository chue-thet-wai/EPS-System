import React, { useState, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, Table, Modal, ButtonIcon } from '../../components';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Index = ({ users }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const columns = React.useMemo(() => [
        { header: 'ID', field: 'id' },
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
            <ButtonIcon
                href="/users/1/edit"
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
                <h1 className="text-3xl font-bold dark:text-white">Users</h1>
                <Link href="/users/create">Add User</Link>
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
