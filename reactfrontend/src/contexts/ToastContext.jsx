import { createContext, useContext, useState } from 'react';

export const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success') => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.slice(1));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
        </ToastContext.Provider>
    );
};
