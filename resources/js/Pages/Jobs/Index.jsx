import React, { useState, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, Table, Modal, ButtonIcon } from '../../components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { usePage } from '@inertiajs/inertia-react';
import { usePermissions } from '../../utils/usePermissions';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const Index = ({ jobs,types=[] }) => {
    const { props } = usePage();
    const jobPermissions = props.auth?.permissions || [];

    const { language } = useLanguage();
    const t = translations[language]; 

    const [isModalOpen, setModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    const { checkMenuPermissions } = usePermissions(jobPermissions);
    const { canCreate, canEdit, canDelete, canExport } = checkMenuPermissions('Jobs');

    const columns = React.useMemo(() => [
        { header: t.title, field: 'title' },
        {
            header: t.type,
            field: 'type',
            render: (row) => {
                const type = types.find(s => s.value === row.type);
                return type ? type.label : row.type;
            },
        },
        { header: t.location, field: 'location' },
        { header: t.salary, field: 'salary' },
    ], [t]);

    const handleDeleteClick = useCallback((id) => {
        setJobToDelete(id);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback(() => {
        if (jobToDelete) {
            Inertia.delete(`/jobs/${jobToDelete}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    setJobToDelete(null);
                },
            });
        }
    }, [jobToDelete]);

    const RowActions = ({ rowId }) => (
        <>
            {canEdit && (
                <ButtonIcon
                    href={`/jobs/${rowId}/edit`}
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
                <h1 className="text-2xl font-bold dark:text-white">{t.jobs}</h1>
                {canCreate && (
                    <Link href="/jobs/create">{t.addJob}</Link>
                )}
            </div>

            <Table
                columns={columns}
                tableData={jobs}
                onPageChange={(page) => {
                    Inertia.get(`/jobs?page=${page}`, { preserveState: true });
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
