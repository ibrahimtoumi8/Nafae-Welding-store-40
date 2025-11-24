import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Loader2, AlertTriangle } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";

interface CustomerServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const CustomerServiceModal: React.FC<CustomerServiceModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: 'welcome', 
            role: 'model', 
            text: 'مرحباً بك في ورشة نافع للحدادة الفنية! 🛠️\nأنا هنا لمساعدتك في اختيار أفضل التصاميم لمنزلك والإجابة على استفساراتك.\nكيف يمكنني خدمتك اليوم؟' 
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatSessionRef = useRef<Chat | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initialize Chat Session with Marketing Persona
    useEffect(() => {
        const initChat = async () => {
             if (!process.env.API_KEY) {
                console.error("API_KEY is missing. Please set it in Vercel Environment Variables.");
                setIsError(true);
                return;
            }

            if (!chatSessionRef.current) {
                try {
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                    
                    // تعليمات النظام (System Instruction) لخلق شخصية بائع محترف
                    const systemInstruction = `
                    أنت "مساعد نافع الذكي"، خبير مبيعات وتسويق لـ "ورشة نافع للحدادة الفنية" في الجزائر (ولاية خنشلة).
                    
                    **أهدافك:**
                    1. الإجابة على استفسارات العملاء بدقة ولباقة.
                    2. إقناع العميل بجودة المنتجات (أبواب Laser Cut، نوافذ، ديكورات، تلحيم احترافي).
                    3. تحويل الاستفسار إلى طلب شراء (Sales Closing) بطريقة ذكية.

                    **معلومات الورشة:**
                    - الموقع: خنشلة، الجزائر.
                    - التوصيل والتركيب: متوفر لجميع ولايات الوطن (58 ولاية).
                    - الهاتف: 0776084097.
                    - المميزات: دقة في المواعيد، تصاميم عصرية (Modern & Classic)، متانة عالية، أسعار تنافسية.
                    - الأسعار: لا تعطي سعراً دقيقاً نهائياً إلا إذا سأل العميل بإلحاح، أعطِ مجالاً سعرياً (مثلاً: الأبواب تبدأ من كذا..) واطلب منه التفاصيل (المقاسات) لتحديد السعر بدقة.

                    **أسلوب الحديث:**
                    - استخدم لهجة جزائرية مهذبة ومفهومة (بيضاء) أو عربية فصحى سلسة.
                    - كن ودوداً، محفزاً، واستخدم إيموجي مناسبة 🛠️✨.
                    - إذا سأل العميل عن تصميم خاص، شجعه على استخدام ميزة "المصمم الذكي" في الموقع أو إرسال صورة.
                    - ركز على "القيمة" (الأمان، الجمال، العمر الطويل للمنتج).
                    `;

                    chatSessionRef.current = ai.chats.create({
                        model: 'gemini-2.5-flash',
                        config: {
                            systemInstruction: systemInstruction,
                            temperature: 0.7, // توازن بين الإبداع والدقة
                        },
                    });
                    setIsError(false);
                } catch (error) {
                    console.error("Failed to initialize AI chat", error);
                    setIsError(true);
                }
            }
        };

        if (isOpen) {
            initChat();
        }
    }, [isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        setInput('');
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userText }]);
        setIsLoading(true);

        try {
            if (chatSessionRef.current) {
                const response = await chatSessionRef.current.sendMessage({ message: userText });
                const reply = response.text || "عذراً، لم أستطع فهم ذلك تماماً. هل يمكنك إعادة الصياغة؟";

                setMessages(prev => [...prev, { 
                    id: (Date.now() + 1).toString(), 
                    role: 'model', 
                    text: reply 
                }]);
            } else {
                 throw new Error("Chat session not initialized");
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { 
                id: (Date.now() + 1).toString(), 
                role: 'model', 
                text: "عذراً، حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى أو الاتصال بنا هاتفياً." 
            }]);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 w-full md:rounded-2xl rounded-t-2xl shadow-2xl md:max-w-lg h-[85vh] md:h-[600px] flex flex-col overflow-hidden relative border border-gray-200 dark:border-gray-700">
                
                <div className="bg-gradient-to-r from-primary to-blue-600 p-4 flex justify-between items-center text-white shadow-md z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-full backdrop-blur-md">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold font-['Cairo']">مساعد نافع الذكي</h2>
                            <p className="text-xs text-blue-100 flex items-center gap-1 opacity-90">
                                <span className={`w-2 h-2 rounded-full ${isError ? 'bg-red-500' : 'bg-green-400 animate-pulse'} shadow-[0_0_8px_rgba(255,255,255,0.5)]`}></span>
                                {isError ? 'غير متصل' : 'متصل الآن • يرد فوراً'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'} gap-2`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white' : 'bg-primary text-white'}`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-sm ${msg.role === 'user' ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tr-none' : 'bg-blue-600 text-white rounded-tl-none shadow-blue-200/50'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex w-full justify-end">
                            <div className="flex flex-row-reverse gap-2">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl rounded-tl-none flex items-center border border-blue-100 dark:border-blue-800">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    <span className="text-xs text-primary mr-2 font-medium">جاري صياغة الرد...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {isError && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-4 py-2 text-xs flex items-center gap-2 border-t border-red-100 dark:border-red-800">
                        <AlertTriangle size={14} />
                        يوجد مشكلة في الاتصال بالذكاء الاصطناعي (تحقق من API Key).
                    </div>
                )}

                <form onSubmit={handleSend} className="p-3 md:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2 items-center shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button type="submit" disabled={isLoading || !input.trim() || isError} className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition disabled:opacity-50 shadow-md flex-shrink-0 transform hover:scale-105 active:scale-95">
                        <Send size={20} className={isLoading ? 'opacity-0' : ''} />
                    </button>
                    <input 
                        type="text" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        disabled={isError}
                        className="flex-grow p-3 bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-700 border focus:border-primary rounded-full outline-none text-right transition-all dark:text-white placeholder-gray-400 disabled:opacity-50" 
                        placeholder={isError ? "خدمة الدردشة غير متاحة حالياً" : "اكتب استفسارك هنا..."}
                        dir="rtl" 
                    />
                </form>
            </div>
        </div>
    );
};

export default CustomerServiceModal;