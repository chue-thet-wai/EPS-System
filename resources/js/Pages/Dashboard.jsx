import React, { useState, useEffect } from 'react';
import { Link, Table } from '../components';
import { Inertia } from '@inertiajs/inertia';
import useIsMobile from '@/utils/useIsMobile';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/lang';

import { HiSquaresPlus } from "react-icons/hi2";
import { BsPersonFill } from "react-icons/bs";
import { TbMessageUser } from "react-icons/tb";
import { FaUsers, FaUserPlus, FaCheckCircle, FaCalendarTimes } from 'react-icons/fa';

const StatCard = ({ icon, label, value }) => (
  <div className="bg-secondary-theme-color p-0 sm:p-1 md:p-2 lg:p-4 flex flex-col justify-between h-full min-h-[80px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[140px] xl:min-h-[140px]">
    <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
      <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl px-1 sm:px-1 md:px-2 bg-transparent rounded-full text-black">
        {icon}
      </div>
      <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg font-bold text-gray-700">{label}</p>
    </div>
    <div className="mt-auto">
      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-center font-bold">{value}</p>
    </div>
  </div>
);

const Dashboard = ({ role, stats, searchId: initialSearchId }) => {
  const [searchId, setSearchId] = useState(initialSearchId || '');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const isMobile = useIsMobile();

  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    setFilteredCustomers(stats.customerTableData || []);
  }, [stats.customerTableData]);

  const handleSearch = () => {
    Inertia.visit(searchId ? `/dashboard?searchId=${searchId}` : '/dashboard');
  };

  const columns = [
    { header: t.customerId, field: 'customer_id' },
    { header: t.nameEng, field: 'user.name' },
    { header: t.nameMm, field: 'name_mm' },
    { header: t.nrcNo, field: 'nrc_no' },
    { header: t.passportNo, field: 'passport_no' },
    { header: t.passportExpiry, field: 'passport_expiry' },
    { header: t.visaType, field: 'visa_type' },
    { header: t.visaExpiry, field: 'visa_expiry' },
  ];

  const RowActions = ({ rowId }) => (
    <Link href={`/customers/${rowId}/edit`} className="text-black underline">{t.view}</Link>
  );

  const renderMobileView = () => {
    const hasCustomerData = searchId && filteredCustomers.data && filteredCustomers.data.length > 0;
    const customer = hasCustomerData ? filteredCustomers.data[0] : null;

    return (
      <div className="p-4 space-y-4 bg-white text-sm">
        {role === 'Admin' && (
          <div className="grid grid-cols-2 gap-4">
            <Link href={`/agents`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
              <StatCard icon={<FaUsers />} label={t.totalAgents} value={stats.totalAgentCount} />
            </Link>
            <Link href={`/agents`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
              <StatCard icon={<FaUserPlus />} label={t.agentsThisMonth} value={stats.agentCountThisMonth} />
            </Link>
            <Link href={`/`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
              <StatCard icon={<FaCheckCircle />} label={t.totalCustomers} value={stats.totalCustomerCount} />
            </Link>
            <Link href={`/`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
              <StatCard icon={<FaCalendarTimes />} label={t.customersThisMonth} value={stats.customerCountThisMonth} />
            </Link>
          </div>
        )}

        {role === 'Agent' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Link href={`/customers`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
                <StatCard icon={<FaUsers />} label={t.allCustomers} value={stats.totalCustomers} />
              </Link>
              <Link href={`/customers/expiry`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
                <StatCard icon={<BsPersonFill />} label={t.customerExpiryThisMonth} value={stats.expiringThisMonth || 0} />
              </Link>
              <Link href={`/customers/new`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
                <StatCard icon={<HiSquaresPlus />} label={t.newCustomersThisMonth} value={stats.newCustomersThisMonth || 0} />
              </Link>
              <Link href={`/customer-services`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
                <StatCard icon={<TbMessageUser />} label={t.activeServiceActivity} value={stats.activeServices || 0} />
              </Link>
            </div>

            <div className="mt-6">
              <p className="font-medium mb-1">{t.pleaseType} <strong>{t.customerId}</strong></p>
              <div className="flex max-w-md w-full">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder={t.enterCustomerId}
                  className="w-2/3 flex-1 px-4 py-2 border rounded-l-md border-gray-300"
                />
                <button
                  onClick={handleSearch}
                  className="w-1/3 px-4 py-2 bg-gray-200 border border-gray-300 rounded-r-md hover:bg-gray-300"
                >
                  {t.search}
                </button>
              </div>
            </div>

            {hasCustomerData && (
              <div className="space-y-3">
                {[
                  { label: t.customerId, value: customer.customer_id },
                  { label: t.nameEng, value: customer?.user?.name },
                  { label: t.nameMm, value: customer.name_mm },
                  { label: t.nrcNo, value: customer.nrc_no },
                  { label: t.passportNo, value: customer.passport_no },
                  { label: t.passportExpiry, value: customer.passport_expiry },
                  { label: t.visaType, value: customer.visa_type },
                  { label: t.visaExpiry, value: customer.visa_expiry },
                ].map(({ label, value }, index) => (
                  <div key={index} className="flex justify-between items-center mb-3">
                    <label className="w-1/3 text-sm font-semibold text-gray-700">{label}</label>
                    <input type="text" readOnly value={value || ''} className="w-2/3 px-2 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700" />
                  </div>
                ))}
                <div className="flex justify-between items-center mb-3">
                  <label className="w-1/3 text-sm font-semibold text-gray-700">{t.address}</label>
                  <textarea
                    readOnly
                    value={customer.address || t.noDataAvailable}
                    className="w-2/3 px-2 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderDesktopView = () => (
    <div className="p-6 space-y-6">
      {role === 'Admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 p-0">
          <Link href={`/agents`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
            <StatCard icon={<FaUsers />} label={t.totalAgents} value={stats.totalAgentCount} />
          </Link>
          <Link href={`/agents`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
            <StatCard icon={<FaUserPlus />} label={t.agentsThisMonth} value={stats.agentCountThisMonth} />
          </Link>
          <Link href={`/`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
            <StatCard icon={<FaCheckCircle />} label={t.totalCustomers} value={stats.totalCustomerCount} />
          </Link>
          <Link href={`/`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
            <StatCard icon={<FaCalendarTimes />} label={t.customersThisMonth} value={stats.customerCountThisMonth} />
          </Link>
        </div>
      )}

      {role === 'Agent' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-8">
            <Link href={`/customers`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
              <StatCard icon={<FaUsers />} label={t.allCustomers} value={stats.totalCustomers} />
            </Link>
            <Link href={`/customers/expiry`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
              <StatCard icon={<BsPersonFill />} label={t.customerExpiryThisMonth} value={stats.expiringThisMonth || 0} />
            </Link>
            <Link href={`/customers/new`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
              <StatCard icon={<HiSquaresPlus />} label={t.newCustomersThisMonth} value={stats.newCustomersThisMonth || 0} />
            </Link>
            <Link href={`/customer-services`}  className="bg-secondary-theme-color shadow rounded-lg outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0">
              <StatCard icon={<TbMessageUser />} label={t.activeServiceActivity} value={stats.activeServices || 0} />
            </Link>
          </div>

          <div className="mt-6">
            <p className="font-medium mb-1">{t.pleaseType} <strong>{t.customerId}</strong></p>
            <div className="flex max-w-md">
              <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder={t.enterCustomerId} className="flex-1 px-4 py-2 border rounded-l-md border-gray-300" />
              <button onClick={handleSearch} className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-r-md">{t.search}</button>
            </div>
          </div>

          <div className="mt-6">
            <Table columns={columns} tableData={filteredCustomers} actions={(row) => <RowActions rowId={row.id} />} />
          </div>
        </>
      )}
    </div>
  );

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default Dashboard;
