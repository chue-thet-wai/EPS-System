import React, { useState, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, Table, Modal, ButtonIcon } from '../../components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { usePage } from '@inertiajs/inertia-react';
import { usePermissions } from '../../utils/usePermissions';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const Index = ({ agents }) => {
    const { props } = usePage();
    const agentPermissions = props.auth?.permissions || [];

    const { language } = useLanguage();
    const t = translations[language];

    const [isModalOpen, setModalOpen] = useState(false);
    const [agentToDelete, setAgentToDelete] = useState(null);

    const { checkMenuPermissions } = usePermissions(agentPermissions);
    const { canCreate, canEdit, canDelete, canExport } = checkMenuPermissions('Agents');

    const columns = React.useMemo(() => [
        { header: t.name, field: 'user.name' },
        { header: t.bizName, field: 'biz_name' },
        { header: t.email, field: 'user.email' },
        { header: t.phoneNumber, field: 'phone' },
    ], [t]);

    const handleDeleteClick = useCallback((id) => {
        setAgentToDelete(id);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback(() => {
        if (agentToDelete) {
            Inertia.delete(`/agents/${agentToDelete}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    setAgentToDelete(null);
                },
            });
        }
    }, [agentToDelete]);

    const RowActions = ({ rowId }) => (
        <>
            {canEdit && (
                <ButtonIcon
                    href={`/agents/${rowId}/edit`}
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
                />
            )}
        </>
    );

    return (
        <div className="container mx-auto p-5 mt-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold dark:text-white">{t.agents}</h1>
                {canCreate && (
                    <Link href="/agents/create">{t.addAgent}</Link>
                )}
            </div>

            <Table
                columns={columns}
                tableData={agents}
                onPageChange={(page) => {
                    Inertia.get(`/agents?page=${page}`, { preserveState: true });
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
