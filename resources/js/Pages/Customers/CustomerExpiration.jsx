import React, { useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import { Link, Table } from '../../components';
import useIsMobile from '@/utils/useIsMobile';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const CustomerExpiration = ({ customers, activeType, filters = {} }) => {
  const { props } = usePage();
  const { language } = useLanguage();
  const t = translations[language];
  const userPermissions = props.auth?.permissions || [];
  const expiryCounts = props.expiryCounts || {};
  const canEdit = userPermissions.includes('Edit Customer');
  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    customer_id: filters.customer_id || '',
  });

  const [dateRange, setDateRange] = useState({
    start: filters.start_date || null,
    end: filters.end_date || null,
  });

  const expiryTabs = [
    { key: 'expired', label: t.expired, count: expiryCounts?.expired || 0 },
    { key: 'today', label: t.expiresToday, count: expiryCounts?.today || 0 },
    { key: 'week', label: t.expiresThisWeek, count: expiryCounts?.week || 0 },
    { key: 'month', label: t.expiresThisMonth, count: expiryCounts?.month || 0 }
  ];

  const getColumnsByTab = () => [
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
    <Link
      href={`/customers/${rowId}/edit`}
      className="text-black underline bg-transparent border-none hover:bg-transparent"
    >
      {t.view}
    </Link>
  );

  const triggerFilter = ({ start, end }) => {
    Inertia.get(route('customers.expiry', activeType), {
      ...searchFilters,
      start_date: start,
      end_date: end,
    }, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const applyPredefinedRange = (type) => {
    const today = new Date();
    let startDate = '', endDate = '';

    const format = (d) => d.toISOString().split('T')[0];

    switch (type) {
      case 'expired':
        endDate = format(new Date(today.setDate(today.getDate() - 1)));
        break;
      case 'today':
        startDate = endDate = format(new Date());
        break;
      case 'week':
        startDate = format(new Date());
        endDate = format(new Date(new Date().setDate(today.getDate() + 6)));
        break;
      case 'month':
        startDate = format(new Date(today.getFullYear(), today.getMonth(), 1));
        endDate = format(new Date(today.getFullYear(), today.getMonth() + 1, 0));
        break;
    }

    setDateRange({ start: startDate, end: endDate });
    triggerFilter({ start: startDate, end: endDate });
  };

  const renderFilters = () => (
    <div className="flex flex-wrap items-start gap-2 font-semibold text-black w-full">
      <div className="flex flex-wrap gap-2 w-full">
        {expiryTabs.map(({ key, label, count }) => (
          <div
            key={key}
            className="
              cursor-pointer bg-gray-300 hover:bg-gray-200 
              px-3 sm:px-4 min-w-[90px] sm:min-w-[120px] text-center rounded 
              text-xs sm:text-sm
            "
            onClick={() => {
              setActiveTab(key);
              applyPredefinedRange(key);
            }}
          >
            <div
              className={`py-2 flex justify-center items-center ${
                activeTab === key ? "text-black font-bold" : "text-gray-500"
              }`}
            >
              {label}
              <span className="ml-1 inline-block bg-white text-black text-[10px] sm:text-xs font-bold px-1 sm:px-2 py-0.5 rounded-full">
                {count}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col px-2 py-2 rounded min-w-[150px] sm:min-w-[200px] gap-1 w-full sm:w-auto">
        <span className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0">{t.customDateRange}</span>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.start}
            max={dateRange.end || ''} 
            onChange={(e) => {
              const updatedRange = { ...dateRange, start: e.target.value };
              setDateRange(updatedRange);
              triggerFilter(updatedRange);
            }}
            className="border border-gray-400 px-2 py-2 rounded text-xs sm:text-sm w-full"
          />

          <span className="text-sm">→</span>

          <input
            type="date"
            value={dateRange.end}
            min={dateRange.start || ''} 
            onChange={(e) => {
              const updatedRange = { ...dateRange, end: e.target.value };
              setDateRange(updatedRange);
              triggerFilter(updatedRange);
            }}
            className="border border-gray-400 px-2 py-2 rounded text-xs sm:text-sm w-full"
          />
        </div>
      </div>
    </div>
  );

  const renderDesktop = () => (
    <div className="container mx-auto p-6 space-y-6">
      {renderFilters()}
      <Table
        columns={getColumnsByTab()}
        tableData={customers}
        actions={(row) => <RowActions rowId={row.id} />}
      />
    </div>
  );

  const renderMobile = () => (
    <div className="container mx-auto p-4 bg-white">
      {renderFilters()}
      <div className="my-4">
        <label htmlFor="search" className="block text-sm font-medium mb-1">
          {t.searchCustomerId}
        </label>
        <div className="flex">
          <input
            type="text"
            id="search"
            placeholder={t.enterCustomerId}
            className="w-2/3 flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none"
            value={searchFilters.customer_id}
            onChange={(e) =>
              setSearchFilters((prev) => ({
                ...prev,
                customer_id: e.target.value,
              }))
            }
          />
          <button
            className="w-1/3 bg-gray-300 text-black px-4 rounded-r"
            onClick={() => triggerFilter(dateRange)}
          >
            {t.search}
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
                    <div>{t.id}: {customer.customer_id || ''}</div>
                    <div>{t.nrc}: {customer.nrc_no || ''}</div>
                    <div>{t.passport}: {customer.passport_no || ''}</div>
                    <div>{t.visa}: {customer.visa_type || ''} ({customer.visa_expiry || ''})</div>
                </div>
                <div className="flex justify-end">
                    <Link
                        href={`/customers/${customer.id}/edit`}
                        className="text-sm text-white bg-transparent"
                    >
                        {t.viewDetails}
                    </Link>
                </div>
            </div>
        </div>
      ))}
    </div>
  );

  return isMobile ? renderMobile() : renderDesktop();
};

export default CustomerExpiration;
