import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/lang';

const Table = ({ columns, tableData, onPageChange, actions = null }) => {
    if (!tableData || !tableData.data) {
        return <div>Loading...</div>;
    }

    const { language } = useLanguage();
    const t = translations[language];

    const handlePageChange = (page) => {
        if (page >= 1 && page <= tableData.last_page) {
            onPageChange(page);
        }
    };

    const getNestedValue = (obj, field) => {
        return field.split('.').reduce((acc, part) => (acc ? acc[part] : ''), obj);
    };

    return (
        <div className="overflow-x-auto mt-5">
            <div className="shadow-lg overflow-hidden bg-white dark:bg-secondary-dark-bg dark:text-white">
                <div className="w-full overflow-x-auto custom-scroll">
                    <table className="min-w-full xs:min-w-[600px] table-auto border-collapse">
                        <thead className="bg-primary-theme-color text-black">
                            <tr>
                                <th className="px-4 py-3 text-left border border-white">#</th>
                                {columns.map((col, index) => (
                                    <th
                                        key={index}
                                        className="px-4 py-3 text-left border border-white"
                                    >
                                        {col.header}
                                    </th>
                                ))}
                                {actions && (
                                    <th className="px-4 py-3 text-left border border-white">
                                        {t.detail}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            {tableData.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + (actions ? 2 : 1)}
                                        className="text-center py-4 text-black bg-primary-theme-color border border-white"
                                    >
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                tableData.data.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className={`${
                                            rowIndex % 2 === 0 ? 'bg-secondary-theme-color' : 'bg-primary-theme-color'
                                        }`}
                                    >
                                        <td className="px-4 py-2 border border-white">
                                            {tableData.from + rowIndex}
                                        </td>
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex} className="px-4 py-2 border border-white">
                                                {col.render
                                                    ? col.render(row)
                                                    : getNestedValue(row, col.field) || ""}
                                            </td>
                                        ))}
                                        {actions && (
                                            <td className="px-4 py-2 border border-white text-black">
                                                {actions(row)}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {tableData.last_page > 1 && (
                    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-300">
                        {/* Pagination Info */}
                        <div className="text-sm text-gray-600 dark:text-white">
                            Showing {tableData.from} to {tableData.to} of {tableData.total} results
                        </div>

                        {/* Pagination Buttons */}
                        <div className="flex">
                            {/* Previous Page */}
                            <button
                                onClick={() => handlePageChange(tableData.current_page - 1)}
                                disabled={tableData.current_page === 1}
                                className={`px-2 py-1 border-t border-b border-l border-gray-300 rounded-l-md ${
                                    tableData.current_page === 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                &lt;
                            </button>

                            {/* Page Numbers */}
                            {(() => {
                                const buttons = [];
                                const totalPages = tableData.last_page;
                                const currentPage = tableData.current_page;

                                if (totalPages > 1) {
                                    buttons.push(
                                        <button
                                            key={1}
                                            onClick={() => handlePageChange(1)}
                                            className={`px-3 py-1 border-t border-b border-l border-gray-300 ${
                                                currentPage === 1
                                                    ? "bg-gray-200 text-gray-800"
                                                    : "bg-white text-gray-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            1
                                        </button>
                                    );
                                }

                                if (currentPage > 3) {
                                    buttons.push(
                                        <span key="start-ellipsis" className="px-3 py-1 border-t border-b border-l border-gray-300 text-gray-500">
                                            ...
                                        </span>
                                    );
                                }

                                for (let page = Math.max(2, currentPage - 1); page <= Math.min(totalPages - 1, currentPage + 1); page++) {
                                    buttons.push(
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 border-t border-b border-l border-gray-300 ${
                                                currentPage === page
                                                    ? "bg-gray-200 text-gray-800"
                                                    : "bg-white text-gray-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                }

                                if (currentPage < totalPages - 2) {
                                    buttons.push(
                                        <span key="end-ellipsis" className="px-3 py-1 border-t border-b border-l border-gray-300 text-gray-500">
                                            ...
                                        </span>
                                    );
                                }

                                if (totalPages > 1) {
                                    buttons.push(
                                        <button
                                            key={totalPages}
                                            onClick={() => handlePageChange(totalPages)}
                                            className={`px-3 py-1 border-t border-b border-l border-gray-300 ${
                                                currentPage === totalPages
                                                    ? "bg-gray-200 text-gray-800"
                                                    : "bg-white text-gray-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            {totalPages}
                                        </button>
                                    );
                                }

                                return buttons;
                            })()}

                            {/* Next Page */}
                            <button
                                onClick={() => handlePageChange(tableData.current_page + 1)}
                                disabled={tableData.current_page === tableData.last_page}
                                className={`px-2 py-1 border border-gray-300 rounded-r-md ${
                                    tableData.current_page === tableData.last_page
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Table;
