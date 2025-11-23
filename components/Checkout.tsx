import React, { useState } from 'react';
import { CartItem, ViewState } from '../types';
import { wilayas } from '../data';
import { Loader2, Send, ArrowLeft, Mail, User, Phone, MapPin } from 'lucide-react';

interface CheckoutProps {
    onChangeView: (view: ViewState) => void;
    cartTotal: number;
    cart: { [id: string]: CartItem };
}

const Checkout: React.FC<CheckoutProps> = ({ onChangeView, cartTotal, cart }) => {
    const [paymentMethod, setPaymentMethod] = useState<'ccp' | 'edahabia' | 'cash'>('cash');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.currentTarget;
        const formData = new FormData(form);
        
        const cartItems = Object.values(cart) as CartItem[];
        
        const orderDetails = cartItems.map(item => 
            `- ${item.name} (الكمية: ${item.quantity}) - السعر: ${item.price.toLocaleString()} د.ج`
        ).join('\n');
        
        const email = formData.get('email');
        const name = formData.get('name');

        const data = {
            email: email,
            name: name,
            phone: formData.get('phone'),
            wilaya: formData.get('wilaya'),
            address: formData.get('address'),
            paymentMethod: paymentMethod === 'cash' ? 'الدفع عند الاستلام' : paymentMethod === 'ccp' ? 'بريد الجزائر CCP' : 'البطاقة الذهبية',
            totalAmount: `${cartTotal.toLocaleString()} د.ج`,
            orderDetails: orderDetails,
            message: `طلبية جديدة من ${name}`,
            _replyto: email, // Important for Formspree
            _subject: `طلب جديد من ${name} - القيمة: ${cartTotal.toLocaleString()} د.ج`
        };

        try {
            const response = await fetch("https://formspree.io/f/mvgvgzbj", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                if (paymentMethod === 'ccp') onChangeView('payment-ccp');
                else if (paymentMethod === 'edahabia') onChangeView('payment-edahabia');
                else onChangeView('success');
            } else {
                const errorData = await response.json();
                alert("حدث خطأ أثناء إرسال الطلب. يرجى التأكد من البيانات والمحاولة مرة أخرى.");
                console.error("Formspree error:", errorData);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("تعذر الاتصال بالخادم، تأكد من اتصالك بالإنترنت.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="view-section py-8 sm:py-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={() => onChangeView('cart')} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary mb-6 transition">
                    <ArrowLeft className="ml-2 h-5 w-5" /> العودة للسلة
                </button>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-200 dark:border-gray-700 text-center">تأكيد الطلبية</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                    <User size={16} /> الاسم الكامل
                                </label>
                                <input type="text" name="name" required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white transition-shadow focus:shadow-md" placeholder="الاسم واللقب" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                    <Phone size={16} /> رقم الهاتف
                                </label>
                                <input type="tel" name="phone" required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white text-left transition-shadow focus:shadow-md" dir="ltr" placeholder="0770..." pattern="[0-9]{10}" title="يرجى إدخال رقم هاتف صحيح مكون من 10 أرقام" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                <Mail size={16} /> البريد الإلكتروني (ضروري لتأكيد الطلب)
                            </label>
                            <input type="email" name="email" required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white transition-shadow focus:shadow-md text-left" dir="ltr" placeholder="example@gmail.com" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                    <MapPin size={16} /> الولاية
                                </label>
                                <select name="wilaya" required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white transition-shadow focus:shadow-md">
                                    <option value="" disabled selected>اختر ولايتك</option>
                                    {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان بالتفصيل</label>
                                <input type="text" name="address" required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white transition-shadow focus:shadow-md" placeholder="الحي، رقم الدار..." />
                            </div>
                        </div>

                        <div className="mt-8 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                            <label className="block text-lg font-bold mb-4 text-gray-900 dark:text-white">طريقة الدفع:</label>
                            <div className="space-y-3">
                                <label className={`flex items-center p-4 rounded-lg cursor-pointer border-2 transition-all ${paymentMethod === 'cash' ? 'bg-blue-50 dark:bg-blue-900/20 border-primary shadow-sm' : 'border-transparent bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="h-5 w-5 text-primary focus:ring-primary" />
                                    <span className="mr-3 font-bold text-gray-800 dark:text-white">الدفع عند الاستلام</span>
                                </label>
                                <label className={`flex items-center p-4 rounded-lg cursor-pointer border-2 transition-all ${paymentMethod === 'ccp' ? 'bg-blue-50 dark:bg-blue-900/20 border-primary shadow-sm' : 'border-transparent bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <input type="radio" name="paymentMethod" value="ccp" checked={paymentMethod === 'ccp'} onChange={() => setPaymentMethod('ccp')} className="h-5 w-5 text-primary focus:ring-primary" />
                                    <span className="mr-3 font-bold text-gray-800 dark:text-white">بريد الجزائر (CCP)</span>
                                </label>
                                <label className={`flex items-center p-4 rounded-lg cursor-pointer border-2 transition-all ${paymentMethod === 'edahabia' ? 'bg-blue-50 dark:bg-blue-900/20 border-primary shadow-sm' : 'border-transparent bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <input type="radio" name="paymentMethod" value="edahabia" checked={paymentMethod === 'edahabia'} onChange={() => setPaymentMethod('edahabia')} className="h-5 w-5 text-primary focus:ring-primary" />
                                    <span className="mr-3 font-bold text-gray-800 dark:text-white">البطاقة الذهبية</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">المبلغ الإجمالي:</span>
                            <span className="text-3xl font-extrabold text-primary">{cartTotal.toLocaleString()} د.ج</span>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="mt-8 w-full py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-dark transition flex items-center justify-center disabled:opacity-70 shadow-lg transform hover:-translate-y-1">
                            {isSubmitting ? <><Loader2 className="animate-spin ml-2" /> جاري الإرسال...</> : <><Send className="ml-2" /> تأكيد الطلب</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;