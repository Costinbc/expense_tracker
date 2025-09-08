import React, { useEffect, useState } from 'react';
import categoryService from '../../../services/categoryService';
import SearchInput from '../../common/SearchInput';
import Pagination from '../../common/Pagination';
import DeleteCategoryModal from './DeleteCategoryModal';
import CategoryForm from './CategoryForm';
import { useToast } from '../../../contexts/ToastContext';

const CategoriesTable = () => {
    const { addToast } = useToast();

    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [modal, setModal] = useState({ open: false, mode: '', category: null });

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await categoryService.getPage(page, pageSize, search);
            console.log("API response:", res);
            const data = res.response?.data ?? [];
            const totalCount = res.response?.totalCount ?? 0;
            setCategories(data);
            setTotal(totalCount);
        } catch (err) {
            console.error(err);
            setError('Failed to load categories');
            addToast('Failed to load categories', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, pageSize, search]);

    const openAdd = () => setModal({ open: true, mode: 'add', category: null });
    const openEdit = (c) => setModal({ open: true, mode: 'edit', category: c });
    const openDelete = (c) => setModal({ open: true, mode: 'delete', category: c });
    const closeModal = () => setModal({ open: false, mode: '', category: null });

    const handleSaved = () => {
        fetchData();
        closeModal();
    };
    const handleDeleted = () => {
        fetchData();
        closeModal();
    };

    if (isLoading && !categories.length) {
        return <div className="loading">Loading categories…</div>;
    }
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <SearchInput placeholder="Search categories…" onSearch={(q) => { setSearch(q); setPage(1); }} />
                <button onClick={openAdd} className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow">
                    Add Category
                </button>
            </div>

            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th className="w-0" />
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((c) => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.type}</td>
                            <td className="action-buttons">
                                <button onClick={() => openEdit(c)} className="edit-button">
                                    Edit
                                </button>
                                <button onClick={() => openDelete(c)} className="delete-button">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {categories.length === 0 && (
                        <tr>
                            <td colSpan={3} className="text-center py-8">
                                {search ? 'No categories match your search.' : 'No categories yet.'}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
            />

            {modal.open && modal.mode !== 'delete' && (
                <CategoryForm
                    isOpen
                    category={modal.category}
                    onSuccess={handleSaved}
                    onClose={closeModal}
                />
            )}

            {modal.open && modal.mode === 'delete' && (
                <DeleteCategoryModal
                    isOpen
                    categoryId={modal.category.id}
                    onDeleted={handleDeleted}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default CategoriesTable;