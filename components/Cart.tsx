import React, { useState } from 'react';
import { CartItem, ViewState } from '../types';
import { Trash2, CreditCard, AlertTriangle, ArrowLeft } from 'lucide-react';

interface CartProps {
    cart: { [id: string]: CartItem };
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemoveItem: (id: number) => void;
    onChangeView: (view: ViewState) => void;
}

const Cart: React.FC<CartProps> = ({ cart, onUpdateQuantity, onRemoveItem, onChangeView }) => {
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    
    const cartItems = Object.values(cart) as CartItem[];
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleDeleteConfirm = () => {
        if (itemToDelete) {
            onRemoveItem(itemToDelete);
            setItemToDelete(null);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <CreditCard className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">سلة التسوق فارغة</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">لم تقم بإضافة أي منتجات بعد. تصفح المتجر واختر ما يناسبك.</p>
                <button 
                    onClick={() => onChangeView('products')}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition shadow-lg transform hover:scale-105"
                >
                    تصفح المنتجات
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                 <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">سلة التسوق ({cartItems.length})</h1>
                 <button 
                     onClick={() => onChangeView('products')}
                     className="text-sm text-primary font-medium hover:underline flex items-center"
                 >
                     <ArrowLeft size={16} className="ml-1" />
                     مواصلة التسوق
                 </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 transition-colors duration-300 border border-gray-100 dark:border-gray-700">
                {cartItems.map((item, index) => (
                    <div key={item.id} className={`flex flex-col sm:flex-row items-center p-4 md:p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 ${index !== cartItems.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                        <div className="flex-shrink-0 w-full sm:w-24 h-48 sm:h-24 mb-4 sm:mb-0 relative rounded-xl overflow-hidden">
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-grow text-center sm:text-right sm:mr-6 w-full">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{item.category === 'doors' ? 'أبواب' : item.category === 'windows' ? 'نوافذ' : 'منتج'}</p>
                            <p className="text-primary font-bold text-lg block sm:hidden">{item.price.toLocaleString()} د.ج</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                             <div className="hidden sm:block text-lg font-bold text-gray-900 dark:text-white ml-6 min-w-[100px] text-left">
                                {item.price.toLocaleString()} د.ج
                             </div>

                            <div className="flex items-center justify-between w-full sm:w-auto bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-2">
                                <button 
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="p-3 text-gray-600 dark:text-gray-300 hover:text-primary disabled:opacity-30 transition"
                                >-</button>
                                <span className="w-8 text-center font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                                <button 
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="p-3 text-gray-600 dark:text-gray-300 hover:text-primary transition"
                                >+</button>
                            </div>
                            
                            <button 
                                onClick={() => setItemToDelete(item.id)}
                                className="w-full sm:w-auto flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-3 rounded-xl transition group border border-red-100 dark:border-transparent"
                                title="حذف المنتج"
                            >
                                <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="sm:hidden mr-2 font-medium">حذف</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 transition-colors duration-300 border border-gray-100 dark:border-gray-700 sticky bottom-4 z-10">
                <div className="flex justify-between items-center mb-4 text-gray-600 dark:text-gray-300">
                    <span className="text-lg">عدد المنتجات:</span>
                    <span className="font-bold">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">الإجمالي الكلي:</span>
                    <span className="text-2xl md:text-3xl font-extrabold text-primary">{total.toLocaleString()} د.ج</span>
                </div>
                
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={() => onChangeView('checkout')}
                        className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-4 rounded-xl transition shadow-lg shadow-accent/20 flex items-center justify-center transform hover:-translate-y-1 text-lg"
                    >
                        <CreditCard className="ml-2" />
                        تأكيد الطلب والدفع
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 transform scale-100 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-center w-14 h-14 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-4 text-red-500">
                            <AlertTriangle size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">حذف المنتج؟</h3>
                        <p className="text-gray-500 dark:text-gray-300 text-center mb-6 text-sm leading-relaxed">
                            هل أنت متأكد من رغبتك في إزالة هذا المنتج من سلة التسوق؟
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={handleDeleteConfirm}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition shadow-md"
                            >
                                حذف
                            </button>
                            <button 
                                onClick={() => setItemToDelete(null)}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl transition"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;