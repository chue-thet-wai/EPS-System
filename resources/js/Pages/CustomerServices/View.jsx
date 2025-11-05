import React from 'react';

const InfoRow = ({ label, value }) => (
  <div className="flex mb-2 text-md">
    <div className="w-1/2 text-gray-900">{label}</div>
    <div className="w-1/2 text-gray-900">{value || '-'}</div>
  </div>
);


const Section = ({ title, children }) => (
  <div className="border border-emerald-50 bg-emerald-50 py-2 px-6 rounded shadow-sm h-full flex flex-col">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="flex-1">{children}</div>
  </div>
);

const CustomerServiceView = ({ customerService, agentData, service_statuses }) => {
  const customer = customerService?.customer;

  const getStatusLabel = (value) => {
    const status = service_statuses?.find(s => s.value === value);
    return status ? status.label : 'Unknown';
  };

  if (!customer) {
    return <p className="text-center text-red-500">No customer data found.</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Service Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex-1">
            <Section title="Basic Information">
              <InfoRow label="Customer ID" value={customer.id} />
              <InfoRow label="Name (ENG)" value={customer.user?.name} />
              <InfoRow label="Name (MM)" value={customer.name_mm} />
              <InfoRow label="Date of Birth" value={customer.dob} />
              <InfoRow label="NRC No." value={customer.nrc_no} />
              <InfoRow label="Nationality" value={customer.nationality} />
            </Section>
          </div>

          <div className="flex-1">
            <Section title="Service Info">
              <InfoRow label="Customer Service ID" value={customerService.id} />
              <InfoRow label="Customer Plan" value={customerService.service?.title} />
              <InfoRow label="Category" value={customerService.service.category?.name || '-'} />
              <InfoRow label="Status" value={getStatusLabel(customerService.status)} />
            </Section>
          </div>
        </div>

        <div className="grid grid-rows-3 gap-6 h-full">
          <Section title="Contact Information">
            <InfoRow label="Biz Name" value={agentData.agent?.biz_name} />
            <InfoRow label="Phone" value={agentData.agent?.phone} />

            <div className="flex justify-center items-center my-4">
              <a
                href={`tel:${agentData.agent?.phone}`}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 text-sm font-medium"
              >
                Call to Agent
              </a>
            </div>

          </Section>

          <Section title="Passport & Visa">
            <InfoRow label="Passport No." value={customer.passport_no} />
            <InfoRow label="Passport Expiry Date" value={customer.passport_expiry} />
            <InfoRow label="Visa Type" value={customer.visa_type} />
            <InfoRow label="Visa Expiry Date" value={customer.visa_expiry} />
          </Section>

          <Section title="CI & Pink Card Details">
            <InfoRow label="CI No." value={customer.ci_no} />
            <InfoRow label="CI Expiry Date" value={customer.ci_expiry} />
            <InfoRow label="Pink Card No." value={customer.pink_card_no} />
            <InfoRow label="Pink Card Expiry Date" value={customer.pink_card_expiry} />
          </Section>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceView;
