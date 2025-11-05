import React, { useState, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, Table, Modal, ButtonIcon } from '../../components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { usePage } from '@inertiajs/inertia-react';
import { usePermissions } from '../../utils/usePermissions';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const Index = ({ users }) => {
    const { props } = usePage();
    const userPermissions = props.auth?.permissions || [];
    const { language } = useLanguage();
    const t = translations[language];

    const [isModalOpen, setModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const { checkMenuPermissions } = usePermissions(userPermissions);
    const { canCreate, canEdit, canDelete } = checkMenuPermissions('Users');

    const columns = React.useMemo(() => [
        { header: t.name, field: 'name' },
        { header: t.email, field: 'email' },
        { header: t.roles, field: 'role' },
    ], [t]);

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
                    tooltip={t.edit}
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
                    tooltip={t.delete}
                    size="lg"
                    shadow={true}
                    data-testid={`delete-btn-${rowId}`}
                />
            )}
        </>
    );

    return (
        <div className="container mx-auto p-5 mt-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold dark:text-white">{t.users}</h1>
                {canCreate && (
                    <Link href="/users/create">{t.addUser}</Link>
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
                title={t.confirmDelete}
                message={t.deleteMessage}
                buttonText={t.deleteButton}
            />
        </div>
    );
};

export default Index;
