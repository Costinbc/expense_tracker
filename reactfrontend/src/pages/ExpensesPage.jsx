import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Table from '../components/common/Table';
import SearchInput from '../components/common/SearchInput';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import ExpenseForm from '../components/expenses/ExpenseForm';
import DeleteExpenseModal from '../components/expenses/DeleteExpenseModal';
import expenseService from '../services/expenseService';
import { useToast } from '../contexts/ToastContext';

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ open: false, mode: '', expense: null });
    const { addToast } = useToast();

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const { page, pageSize } = pagination;
            const resp = await expenseService.getPage(page, pageSize, searchQuery);
            console.log(resp);
            const pageData = resp.response.data;
            console.log(pageData);
            setExpenses(pageData);
            setPagination(prev => ({ ...prev, total: pageData.totalCount }));
        } catch (err) {
            console.error(err);
            addToast('Failed to load expenses', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [pagination.page, pagination.pageSize, searchQuery]);

    const openAdd = () => setModal({ open: true, mode: 'add', expense: null });
    const openEdit = exp => setModal({ open: true, mode: 'edit', expense: exp });
    const openDelete = exp => setModal({ open: true, mode: 'delete', expense: exp });
    const closeModal = () => setModal({ open: false, mode: '', expense: null });

    const handleSave = async data => {
        try {
            if (modal.mode === 'add') {
                await expenseService.add(data);
                addToast('Expense added', 'success');
            } else if (modal.mode === 'edit') {
                await expenseService.update({ ...data, id: modal.expense.id });
                addToast('Expense updated', 'success');
            }
            fetchExpenses();
            closeModal();
        } catch (err) {
            console.error(err);
            addToast('Error saving expense', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            await expenseService.delete(modal.expense.id);
            addToast('Expense deleted', 'success');
            fetchExpenses();
            closeModal();
        } catch (err) {
            console.error(err);
            addToast('Error deleting expense', 'error');
        }
    };

    const columns = [
        { header: 'Date', accessor: 'date', render: e => new Date(e.date).toLocaleDateString() },
        { header: 'Amount', accessor: 'amount', render: e => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(e.amount) },
        { header: 'Description', accessor: 'description' },
        { header: 'Category', accessor: 'categoryName', render: e => e.categoryName || '-' },
        { header: 'Payment Method', accessor: 'paymentMethodName', render: e => e.paymentMethodName || '-' },
        {
            header: 'Actions',
            render: e => (
                <div className="flex gap-2">
                    <button onClick={() => openEdit(e)} className="text-primary-600 hover:underline">Edit</button>
                    <button onClick={() => openDelete(e)} className="text-red-600 hover:underline">Delete</button>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl mb-8 p-8 text-white shadow-lg transform hover:scale-[1.01] transition">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Manage Expenses</h1>
                        <p className="text-primary-100">View, add, edit or delete your expenses</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <SearchInput onSearch={q => { setSearchQuery(q); setPagination(p => ({ ...p, page: 1 })); }} placeholder="Search expenses..." />
                    <button onClick={openAdd} className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow">
                        <Plus className="w-5 h-5 mr-2" /> Add Expense
                    </button>
                </div>

                <Table columns={columns} data={expenses} />

                <div className="mt-4">
                    <Pagination
                        currentPage={pagination.page}
                        pageSize={pagination.pageSize}
                        total={pagination.total}
                        onPageChange={p => setPagination(prev => ({ ...prev, page: p }))}
                        onPageSizeChange={size => setPagination(prev => ({ ...prev, pageSize: size, page: 1 }))}
                    />
                </div>
            </div>

            {modal.open && modal.mode !== 'delete' && (
                <Modal isOpen onClose={closeModal} title={modal.mode === 'add' ? 'Add Expense' : 'Edit Expense'}>
                    <ExpenseForm expense={modal.mode === 'edit' ? modal.expense : undefined} onSuccess={handleSave} onClose={closeModal} />
                </Modal>
            )}
            {modal.open && modal.mode === 'delete' && (
                <DeleteExpenseModal isOpen expenseId={modal.expense.id} onDeleted={fetchExpenses} onClose={closeModal} />
            )}
        </div>
    );
};

export default ExpensesPage;
