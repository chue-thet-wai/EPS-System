import React from 'react';
import {
    FaUsers,
    FaUserPlus,
    FaUserCheck,
    FaUserClock,
    FaHourglassHalf,
    FaSpinner,
    FaCheckCircle,
    FaCalendarTimes
} from 'react-icons/fa';

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow">
        <div className={`p-4 rounded-full text-white text-xl ${color}`}>
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">{label}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const Dashboard = ({ role, stats, todayExpireCustomers = [] }) => {
    return (
        <div className="mt-6 p-6">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Dashboard</h2>

            {/* Admin cards */}
            {role === 'Admin' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={<FaUsers />} label="Total Agents" value={stats.totalAgentCount} color="bg-blue-500" />
                    <StatCard icon={<FaUserPlus />} label="Agents This Month" value={stats.agentCountThisMonth} color="bg-green-500" />
                    <StatCard icon={<FaUserCheck />} label="Total Customers" value={stats.totalCustomerCount} color="bg-purple-500" />
                    <StatCard icon={<FaUserClock />} label="Customers This Month" value={stats.customerCountThisMonth} color="bg-yellow-500" />
                </div>
            )}

            {/* Agent cards */}
            {role === 'Agent' && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={<FaUsers />} label="Total Customers" value={stats.totalCustomers} color="bg-blue-600" />
                        <StatCard icon={<FaHourglassHalf />} label="Pending Customers" value={stats.pendingCustomers} color="bg-orange-500" />
                        <StatCard icon={<FaSpinner />} label="In Progress Customers" value={stats.progressCustomers} color="bg-teal-500" />
                        <StatCard icon={<FaCheckCircle />} label="Completed Customers" value={stats.completedCustomers} color="bg-green-600" />
                    </div>

                    {/* Expiring Services */}
                    <div className="mt-10">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <FaCalendarTimes className="text-red-500" /> Today's Expiring Services
                        </h3>

                        {todayExpireCustomers.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-300">No expiring services today.</p>
                        ) : (
                            <ul className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 space-y-2">
                                {todayExpireCustomers.map((expiredcustomer, index) => (
                                    <li key={index} className="border-b last:border-none py-2">
                                        <p className="text-gray-800 dark:text-white font-semibold">
                                            {expiredcustomer.customer.user.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Service: {expiredcustomer.service.title} | Expiry: {expiredcustomer.end_date}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
