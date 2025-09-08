import React, { useState, useEffect } from 'react';
import incomeService from '../../services/incomeService';
import Pagination from '../common/Pagination';
import SearchInput from '../common/SearchInput';
import Modal from '../common/Modal';
import DeleteIncomeModal from './DeleteIncomeModal';
import IncomeForm from './IncomeForm';
import { formatDateToDisplay } from '../../utils/dateFormatter';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useToast } from '../../contexts/ToastContext';

const IncomesTable = () => {
    const [incomes, setIncomes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState(null);

    const { addToast } = useToast();

    const fetchIncomes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const resp = await incomeService.getPage(page, pageSize, searchQuery);
            const data = resp.response.data;
            setIncomes(data);
            setTotal(resp.response.totalCount);
        } catch (err) {
            console.error(err);
            setError('Failed to load incomes. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomes();
    }, [page, pageSize, searchQuery]);


    const handleSearch = (q) => {
        setSearchQuery(q);
        setPage(1);
    };

    const handleAddSubmit = async (data) => {
        try {
            await incomeService.add(data);
            addToast('Income added successfully', 'success');
            fetchIncomes();
            setShowAddModal(false);
        } catch (err) {
            console.error(err);
            addToast('Failed to add income', 'error');
        }
    };

    const handleEditSubmit = async (data) => {
        try {
            await incomeService.update(data);
            addToast('Income updated successfully', 'success');
            fetchIncomes();
            setShowEditModal(false);
            setSelectedIncome(null);
        } catch (err) {
            console.error(err);
            addToast('Failed to update income', 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await incomeService.delete(selectedIncome.id);
            addToast('Income deleted successfully', 'success');
            fetchIncomes();
            setShowDeleteModal(false);
            setSelectedIncome(null);
        } catch (err) {
            console.error(err);
            addToast('Failed to delete income', 'error');
        }
    };


    if (isLoading && !incomes.length) return <div className="loading">Loading incomes…</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="incomes-table-container">
            <div className="table-header">
                <h2>Incomes</h2>
                <div className="table-actions">
                    <SearchInput onSearch={handleSearch} placeholder="Search incomes…" />
                    <button className="add-button" onClick={() => setShowAddModal(true)}>
                        Add Income
                    </button>
                </div>
            </div>

            {incomes.length === 0 ? (
                <div className="no-data">
                    {searchQuery ? 'No incomes found for your search.' : 'No incomes yet. Add your first income!'}
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Payment Method</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {incomes.map((inc) => (
                            <tr key={inc.id}>
                                <td>{formatDateToDisplay(inc.date)}</td>
                                <td>{formatCurrency(inc.amount)}</td>
                                <td>{inc.description}</td>
                                <td>{inc.categoryName || '-'}</td>
                                <td>{inc.paymentMethodName || '-'}</td>
                                <td className="action-buttons">
                                    <button className="edit-button" onClick={() => { setSelectedIncome(inc); setShowEditModal(true); }}>
                                        Edit
                                    </button>
                                    <button className="delete-button" onClick={() => { setSelectedIncome(inc); setShowDeleteModal(true); }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                currentPage={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
            />

            {showAddModal && (
                <Modal title="Add Income" isOpen onClose={() => setShowAddModal(false)}>
                    <IncomeForm onSuccess={handleAddSubmit} onClose={() => setShowAddModal(false)} />
                </Modal>
            )}

            {showEditModal && selectedIncome && (
                <Modal title="Edit Income" isOpen onClose={() => setShowEditModal(false)}>
                    <IncomeForm income={selectedIncome} onSuccess={handleEditSubmit} onClose={() => setShowEditModal(false)} />
                </Modal>
            )}

            {showDeleteModal && selectedIncome && (
                <DeleteIncomeModal
                    isOpen
                    incomeId={selectedIncome.id}
                    onDeleted={handleDeleteConfirm}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default IncomesTable;
