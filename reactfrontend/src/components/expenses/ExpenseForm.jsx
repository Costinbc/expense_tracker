import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import expenseService from "../../services/expenseService";
import categoryService from "../../services/categoryService";
import paymentMethodService from "../../services/paymentMethodService";
import { useToast } from "../../contexts/ToastContext";

const ExpenseForm = ({ expense, onSuccess, onClose }) => {
    const isEdit = Boolean(expense);
    const { addToast } = useToast();
    const [formValues, setFormValues] = useState({
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        categoryId: "",
        paymentMethodId: "",
    });
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (expense) setFormValues({ ...expense });
        const fetchLists = async () => {
            try {
                let cats = await categoryService.getAll();
                console.log(cats);
                if (cats) cats = cats.filter((cat) => cat.type === "Expense");
                setCategories(Array.isArray(cats) ? cats : []);
                let pays = await paymentMethodService.getAll();
                if (pays.results) pays = pays.results;
                setPaymentMethods(Array.isArray(pays) ? pays : []);
            } catch (err) {
                console.error(err);
                setCategories([]);
                setPaymentMethods([]);
            }
        };
        fetchLists();
    }, [expense]);

    const handleChange = (e) =>
        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await expenseService.update(formValues);
                addToast("Expense updated", "success");
            } else {
                await expenseService.add(formValues);
                addToast("Expense added", "success");
            }
            onSuccess?.();
            onClose?.();
        } catch (err) {
            console.error(err);
            addToast(err?.response?.data?.errorMessage || "Error", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
                <button className="absolute top-4 right-4" onClick={onClose}>
                    <X />
                </button>
                <h2 className="text-xl font-semibold mb-4">{isEdit ? "Edit" : "Add"} Expense</h2>
                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formValues.amount}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <input
                            name="description"
                            value={formValues.description}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formValues.date}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                name="categoryId"
                                value={formValues.categoryId}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                                required
                            >
                                <option value="">Select</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Payment Method</label>
                        <select
                            name="paymentMethodId"
                            value={formValues.paymentMethodId}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2"
                            required
                        >
                            <option value="">Select</option>
                            {paymentMethods.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Expense"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseForm;