import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Table, ButtonIcon } from '../../components';
import { FaEye } from 'react-icons/fa';
import { usePage } from '@inertiajs/inertia-react';
import { usePermissions } from '../../utils/usePermissions';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const Index = ({ applicants }) => {
    const { props } = usePage();
    const applicantPermissions = props.auth?.permissions || [];

    const { language } = useLanguage();
    const t = translations[language];

    const { checkMenuPermissions } = usePermissions(applicantPermissions);
    const { canEdit } = checkMenuPermissions('Applicants');

    const columns = React.useMemo(() => [
        { header: t.name, field: 'customer.user.name' },
        { header: t.email, field: 'customer.user.email' }
    ], [t]);

    const RowActions = ({ rowId }) => (
        <>
            <ButtonIcon
                href={`/applicants/${rowId}`}
                icon={<FaEye />}
                iconColor="text-blue-500"
                hoverColor="hover:text-blue-700"
                tooltip={t.view}
                size="lg"
                shadow={true}
            />
        </>
    );

    return (
        <div className="container mx-auto p-5 mt-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold dark:text-white">{t.applicants}</h1>
            </div>

            <Table
                columns={columns}
                tableData={applicants}
                onPageChange={(page) => {
                    Inertia.get(`/applicants?page=${page}`, { preserveState: true });
                }}
                actions={(row) => <RowActions rowId={row.id} />}
            />
        </div>
    );
};

export default Index;
