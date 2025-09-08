import React from "react";

export default function Table({ columns = [], data = [] }) {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
            <tr>
                {columns.map((col, idx) => (
                    <th key={idx} className="px-6 py-3">{col.header}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {(data || []).map((row, rowIdx) => (
                <tr key={row.id || rowIdx}>
                    {columns.map((col, colIdx) => (
                        <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                            {col.render ? col.render(row) : row[col.accessor]}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}