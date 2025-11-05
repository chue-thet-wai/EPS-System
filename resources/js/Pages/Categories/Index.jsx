import React, { useState, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, Table, Modal, ButtonIcon } from '../../components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { usePage } from '@inertiajs/inertia-react';
import { usePermissions } from '../../utils/usePermissions';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const Index = ({ categories }) => {
    const { props } = usePage();
    const userPermissions = props.auth?.permissions || [];
    const { language } = useLanguage();
    const t = translations[language];

    const [isModalOpen, setModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const { checkMenuPermissions } = usePermissions(userPermissions);
    const { canCreate, canEdit, canDelete } = checkMenuPermissions('Categories');

    const columns = React.useMemo(() => [
        { header: t.name, field: 'name' },
    ], [t]);

    const handleDeleteClick = useCallback((id) => {
        setCategoryToDelete(id);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback(() => {
        if (categoryToDelete) {
            Inertia.delete(`/categories/${categoryToDelete}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    setCategoryToDelete(null);
                },
            });
        }
    }, [categoryToDelete]);

    const RowActions = ({ rowId }) => (
        <>
            {canEdit && (
                <ButtonIcon
                    href={`/categories/${rowId}/edit`}
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
                <h1 className="text-2xl font-bold dark:text-white">{t.categories}</h1>
                {canCreate && (
                    <Link href="/categories/create">{t.addCategory}</Link>
                )}
            </div>

            <Table
                columns={columns}
                tableData={categories} 
                onPageChange={(page) => {
                    Inertia.get(`/categories?page=${page}`, { preserveState: true });
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
