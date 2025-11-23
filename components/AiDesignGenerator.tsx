import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Download, RefreshCw, Wand2, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AiDesignGeneratorProps {
    onUseDesign: () => void;
}

const styles = [
    { id: 'modern', label: 'عصري (Modern)', prompt: 'modern minimalist design, sleek lines, clean metallic finish, architectural photography' },
    { id: 'classic', label: 'كلاسيكي (Classic)', prompt: 'luxury classic design, ornate wrought iron details, victorian style, gold accents, high quality' },
    { id: 'islamic', label: 'زخرفة إسلامية', prompt: 'islamic geometric patterns, intricate arabesque laser cut metal, elegant, masterpiece' },
    { id: 'industrial', label: 'صناعي (Industrial)', prompt: 'industrial loft style, raw steel, heavy duty, matte black finish, robust' },
];

const AiDesignGenerator: React.FC<AiDesignGeneratorProps> = ({ onUseDesign }) => {
    const [prompt, setPrompt] = useState('');
    const [selectedStyle, setSelectedStyle] = useState(styles[0]);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setGeneratedImage(null);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
            
            // تحسين الطلب للحصول على نتائج واقعية
            const finalPrompt = `
                Generate a photorealistic image of a metalwork design for a door, window, or gate.
                User description: "${prompt}".
                Style: ${selectedStyle.prompt}.
                Quality: 4k, architectural render, highly detailed, realistic lighting, professional photography.
                Material: Iron, Steel, or Aluminum.
                Background: Neutral architectural setting.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash-image',
                contents: {
                    parts: [{ text: finalPrompt }]
                }
            });

            // استخراج الصورة من الاستجابة (حسب وثائق Gemini SDK)
            let imageFound = false;
            
            if (response.candidates && response.candidates[0].content.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64EncodeString = part.inlineData.data;
                        const imageUrl = `data:image/png;base64,${base64EncodeString}`;
                        setGeneratedImage(imageUrl);
                        imageFound = true;
                        break;
                    }
                }
            }

            if (!imageFound) {
                 // في بعض الأحيان قد يرد الموديل بنص فقط إذا لم يستطع التوليد
                setError("لم يتمكن النظام من توليد الصورة، يرجى محاولة وصف مختلف.");
            }

        } catch (err) {
            console.error("Image generation error:", err);
            setError("حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = () => {
        if (generatedImage) {
            const link = document.createElement('a');
            link.href = generatedImage;
            link.download = `nafea-design-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <span className="inline-flex items-center px-4 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-bold mb-4 border border-purple-200 dark:border-purple-800">
                    <Sparkles size={16} className="ml-2" />
                    مدعوم بواسطة Google Gemini AI
                </span>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">مصمم الديكور الذكي والحقيقي</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                    صف لنا فكرتك (مثلاً: "باب أسود بزهور ذهبية") وسيقوم الذكاء الاصطناعي برسمها لك في ثوانٍ لتراها قبل التنفيذ!
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Input Section */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300 relative overflow-hidden">
                     {/* Decorative background element */}
                     <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl"></div>

                    <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">ماذا تريد أن تصمم؟</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="مثال: بوابة خارجية كبيرة، لون أسود، مع زخارف نباتية ذهبية في الوسط..."
                                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 h-32 resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">اختر نمط التصميم:</label>
                            <div className="grid grid-cols-2 gap-3">
                                {styles.map((style) => (
                                    <button
                                        key={style.id}
                                        type="button"
                                        onClick={() => setSelectedStyle(style)}
                                        className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 
                                            ${selectedStyle.id === style.id 
                                                ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-300 dark:ring-purple-900' 
                                                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-gray-600'}`}
                                    >
                                        {style.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !prompt.trim()}
                            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]
                                ${loading 
                                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg'}`}
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="animate-spin" size={20} />
                                    جاري التوليد (قد يستغرق 10 ثوانٍ)...
                                </>
                            ) : (
                                <>
                                    <Wand2 size={20} />
                                    توليد التصميم الآن
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Output Section */}
                <div className="bg-gray-900 dark:bg-black/50 rounded-2xl p-1 min-h-[450px] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group border border-gray-800 dark:border-gray-700">
                    {generatedImage ? (
                        <div className="relative w-full h-full animate-in fade-in duration-700">
                            <img 
                                src={generatedImage} 
                                alt="AI Generated Design" 
                                className="w-full h-auto rounded-xl shadow-inner object-cover max-h-[500px]"
                            />
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
                                <button 
                                    onClick={downloadImage}
                                    className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg flex items-center hover:bg-gray-100 transition transform hover:scale-105"
                                >
                                    <Download size={18} className="ml-2" />
                                    حفظ
                                </button>
                                <button 
                                    onClick={onUseDesign}
                                    className="bg-primary text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-primary-dark transition transform hover:scale-105"
                                >
                                    تنفيذ هذا التصميم
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-8 text-gray-500">
                             {error ? (
                                 <div className="flex flex-col items-center text-red-400 animate-in fade-in">
                                     <AlertCircle size={48} className="mb-4" />
                                     <p className="text-lg font-medium">{error}</p>
                                 </div>
                             ) : (
                                 <>
                                    <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-gray-400 text-lg">مساحة العمل فارغة</p>
                                    <p className="text-sm text-gray-600 mt-2">اكتب الوصف واضغط توليد لرؤية السحر ✨</p>
                                 </>
                             )}
                        </div>
                    )}
                    
                    {loading && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-in fade-in">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                <Sparkles className="absolute inset-0 m-auto text-purple-400 animate-pulse" size={32} />
                            </div>
                            <p className="text-white font-medium mt-6 animate-pulse text-lg">الذكاء الاصطناعي يرسم فكرتك...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiDesignGenerator;