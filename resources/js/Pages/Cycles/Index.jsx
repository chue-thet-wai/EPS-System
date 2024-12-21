import React, { useState, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, Table, Modal, ButtonIcon } from '../../components';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Index = ({ cycles }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [cycleToDelete, setCycleToDelete] = useState(null);

    const columns = React.useMemo(() => [
        { header: 'ID', field: 'id' },
        { header: 'Description', field: 'description' },
    ], []);

    const handleDeleteClick = useCallback((id) => {
        setCycleToDelete(id);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback(() => {
        if (cycleToDelete) {
            Inertia.delete(`/cycles/${cycleToDelete}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    setCycleToDelete(null);
                },
            });
        }
    }, [cycleToDelete]);

    const RowActions = ({ rowId }) => (
        <>
            <ButtonIcon
                href="/cycles/1/edit"
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
                <h1 className="text-3xl font-bold dark:text-white">Cycles</h1>
                <Link href="/cycles/create">Add Cycle</Link>
            </div>

            <Table
                columns={columns}
                tableData={cycles} 
                onPageChange={(page) => {
                    Inertia.get(`/cycles?page=${page}`, { preserveState: true });
                }}
                actions={(row) => <RowActions rowId={row.id} />}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this cycle?"
                buttonText="Delete"
            />
        </div>
    );
};

export default Index;
