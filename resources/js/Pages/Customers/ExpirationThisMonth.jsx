import React, { useState, useCallback } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import { Link, Table } from '../../components';
import useIsMobile from '@/utils/useIsMobile';

const ExpirationsThisMonth = ({ customers, activeType, filters = {} }) => {
    const { props, url } = usePage();
    const userPermissions = props.auth?.permissions || [];
    const expiryCounts = usePage().props.expiryCounts || {};
    const canEdit = userPermissions.includes('Edit Customer');
    const isMobile = useIsMobile();

    const [activeTab, setActiveTab] = useState(activeType || 'passport');
    const [searchFilters, setSearchFilters] = useState({
        customer_id: filters.customer_id || ''
    });

    const expiryTabs = [
        {
            key: 'passport',
            label: (
                <>
                    Passport Expiry{expiryCounts.passport > 0 && (
                        <span className="text-red-500 font-bold text-lg"> *</span>
                    )}
                </>
            ),
        },
        {
            key: 'visa',
            label: (
                <>
                    Visa Expiry{expiryCounts.visa > 0 && (
                        <span className="text-red-500 font-bold text-lg"> *</span>
                    )}
                </>
            ),
        },
        {
            key: 'pinkcard',
            label: (
                <>
                    Pink Card Expiry{expiryCounts.pinkcard > 0 && (
                        <span className="text-red-500 font-bold text-lg"> *</span>
                    )}
                </>
            ),
        },
        {
            key: 'ci',
            label: (
                <>
                    CI Card Expiry{expiryCounts.ci > 0 && (
                        <span className="text-red-500 font-bold text-lg"> *</span>
                    )}
                </>
            ),
        },
    ];



    const getColumnsByTab = (tab) => {
        const base = [
            { header: 'Customer ID', field: 'customer_id' },
            { header: 'Name (ENG)', field: 'user.name' },
            { header: 'Name (MM)', field: 'name_mm' },
            { header: 'NRC No.', field: 'nrc_no' },
        ];

        switch (tab) {
            case 'passport':
                return [...base, { header: 'Passport No.', field: 'passport_no' }, { header: 'Passport Expiry Date', field: 'passport_expiry' }];
            case 'visa':
                return [...base, { header: 'Visa Type', field: 'visa_type' }, { header: 'Visa Expiry Date', field: 'visa_expiry' }];
            case 'pinkcard':
                return [...base, { header: 'Pink Card No.', field: 'pink_card_no' }, { header: 'Pink Card Expiry Date', field: 'pink_card_expiry' }];
            case 'ci':
                return [...base, { header: 'CI No.', field: 'ci_no' }, { header: 'CI Expiry Date', field: 'ci_expiry' }];
            default:
                return base;
        }
    };

    const RowActions = ({ rowId }) => (
        <Link
            href={`/customers/${rowId}/edit`}
            className="text-black underline bg-transparent border-none hover:bg-transparent"
        >
            View
        </Link>
    );

    const handleFilter = useCallback(() => {
        Inertia.get(route('customers.expiry'), { ...searchFilters, type: activeTab }, {
            preserveScroll: true,
            preserveState: true,
        });
    }, [searchFilters, activeTab]);


    const renderMobile = () => (
        <div className="container mx-auto p-4 space-y-6 bg-white">
            <div className='text-sm'>
                <div className="flex">
                    {expiryTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setActiveTab(tab.key);
                                setSearchFilters({ customer_id: '' });
                                Inertia.get(route('customers.expiry'), { type: tab.key }, { preserveState: true, replace: true });
                            }}
                            className={`w-1/4 px-2 py-2 font-semibold ${activeTab === tab.key ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className='my-4'>
                    <label htmlFor="search" className="block text-sm font-medium mb-1">Please type customer ID</label>
                    <div className="flex">
                        <input
                            type="text"
                            id="search"
                            placeholder="Enter Customer ID..."
                            className="w-2/3 flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none"
                            value={searchFilters.customer_id}
                            onChange={(e) =>
                                setSearchFilters((prev) => ({
                                    ...prev,
                                    customer_id: e.target.value
                                }))
                            }
                        />
                        <button className="w-1/3 bg-gray-300 text-black px-4 rounded-r" onClick={handleFilter}>
                            Search
                        </button>
                    </div>
                </div>

                {customers.data.map((customer, index) => (
                    <div
                        key={customer.id}
                        className={`flex px-3 py-2 text-sm ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'}`}
                    >
                        <div className="w-1/3 flex flex-col justify-start items-center text-black pr-2">
                            <div className="font-bold mb-1 text-center">{customer.user?.name || ''}</div>
                            <img
                                className="w-10 h-10 rounded-full object-cover"
                                src="/assets/images/profile.jpg"
                                alt="User"
                            />
                        </div>
                        <div className="w-2/3 text-black flex flex-col justify-between pl-2 pt-2 break-words whitespace-normal">
                            <div className="space-y-1 leading-snug">
                                <div>ID: {customer.customer_id || ''}</div>
                                <div>NRC: {customer.nrc_no || ''}</div>
                                <div>Passport: {customer.passport_no || ''}</div>
                                <div>Visa: {customer.visa_type || ''} ({customer.visa_expiry || ''})</div>
                            </div>
                            <div className="flex justify-end">
                                <Link
                                    href={`/customers/${customer.id}/edit`}
                                    className="text-sm text-white bg-transparent"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {customers.next_page_url && (
                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
                        onClick={() => Inertia.get(customers.next_page_url, {}, { preserveScroll: true })}
                    >
                        Load More
                    </button>
                )}
            </div>
        </div>
    );

    const renderDesktop = () => (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex space-x-2">
                {expiryTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => {
                            setActiveTab(tab.key);
                            Inertia.get(route('customers.expiry'), { type: tab.key }, { preserveState: true, replace: true });
                        }}
                        className={`px-4 py-2 font-semibold rounded-t ${activeTab === tab.key ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <Table
                columns={getColumnsByTab(activeTab)}
                tableData={customers}
                actions={(row) => <RowActions rowId={row.id} />}
            />
        </div>
    );

    return isMobile ? renderMobile() : renderDesktop();
};

export default ExpirationsThisMonth;
