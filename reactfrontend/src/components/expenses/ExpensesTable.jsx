import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import expenseService from '../../services/expenseService';
import Pagination from '../common/Pagination';
import SearchInput from '../common/SearchInput';
import Modal from '../common/Modal';
import DeleteExpenseModal from './DeleteExpenseModal';
import ExpenseForm from './ExpenseForm';
import { formatDateToDisplay } from '../../utils/dateFormatter';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useToast } from '../../contexts/ToastContext';

const ExpensesTable = () => {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    const navigate = useNavigate();
    const { addToast } = useToast();

    const fetchExpenses = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await expenseService.getPage(page, pageSize, searchQuery);
            console.log("API response:", response);
            const data = response.response.data;
            const totalCount = response.response.totalCount;
            setExpenses(data);
            setTotal(totalCount);
            console.log("Expenses state:", data);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setError('Failed to load expenses. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [page, pageSize, searchQuery]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setPage(1);
    };

    const handleAddClick = () => {
        setShowAddModal(true);
    };

    const handleEditClick = (expense) => {
        setSelectedExpense(expense);
        setShowEditModal(true);
    };

    const handleDeleteClick = (expense) => {
        setSelectedExpense(expense);
        setShowDeleteModal(true);
    };

    const handleAddSubmit = async (data) => {
        try {
            await expenseService.add(data);
            fetchExpenses();
            setShowAddModal(false);
            addToast('Expense added successfully', 'success');
        } catch (err) {
            console.error('Error adding expense:', err);
            addToast('Failed to add expense', 'error');
        }
    };

    const handleEditSubmit = async (data) => {
        try {
            await expenseService.update(data);
            fetchExpenses();
            setShowEditModal(false);
            setSelectedExpense(null);
            addToast('Expense updated successfully', 'success');
        } catch (err) {
            console.error('Error updating expense:', err);
            addToast('Failed to update expense', 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await expenseService.delete(selectedExpense.id);
            fetchExpenses();
            setShowDeleteModal(false);
            setSelectedExpense(null);
            addToast('Expense deleted successfully', 'success');
        } catch (err) {
            console.error('Error deleting expense:', err);
            addToast('Failed to delete expense', 'error');
        }
    };

    if (isLoading && !expenses.length) {
        return <div className="loading">Loading expenses...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="expenses-table-container">
            <div className="table-header">
                <h2>Expenses</h2>
                <div className="table-actions">
                    <SearchInput onSearch={handleSearch} placeholder="Search expenses..." />
                    <button className="add-button" onClick={handleAddClick}>
                        Add Expense
                    </button>
                </div>
            </div>

            {expenses.length === 0 ? (
                <div className="no-data">
                    {searchQuery ? 'No expenses found for your search.' : 'No expenses found. Add your first expense!'}
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
                        {expenses.map((expense) => (
                            <tr key={expense.id}>
                                <td>{formatDateToDisplay(expense.date)}</td>
                                <td>{formatCurrency(expense.amount)}</td>
                                <td>{expense.description}</td>
                                <td>{expense.categoryName || '-'}</td>
                                <td>{expense.paymentMethodName || '-'}</td>
                                <td className="action-buttons">
                                    <button className="edit-button" onClick={() => handleEditClick(expense)}>
                                        Edit
                                    </button>
                                    <button className="delete-button" onClick={() => handleDeleteClick(expense)}>
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
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />

            {showAddModal && (
                <Modal title="Add Expense" isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
                    <ExpenseForm onSuccess={handleAddSubmit} onClose={() => setShowAddModal(false)} />
                </Modal>
            )}

            {showEditModal && selectedExpense && (
                <Modal title="Edit Expense" isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
                    <ExpenseForm expense={selectedExpense} onSuccess={handleEditSubmit} onClose={() => setShowEditModal(false)} />
                </Modal>
            )}

            {showDeleteModal && selectedExpense && (
                <DeleteExpenseModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    expense={selectedExpense}
                />
            )}
        </div>
    );
};

export default ExpensesTable;