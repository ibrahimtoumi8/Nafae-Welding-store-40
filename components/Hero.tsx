import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ViewState } from '../types';

interface HeroProps {
    onChangeView: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = ({ onChangeView }) => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative bg-gray-900 text-white overflow-hidden min-h-[600px] flex items-center group">
            {/* Parallax Background */}
            <div 
                className="absolute inset-0 z-0 overflow-hidden"
            >
                <img 
                    src="https://i.ibb.co/bMN689xz/gas-welding.jpg" 
                    alt="ورشة حدادة فنية وتلحيم ابواب ونوافذ" 
                    className="w-full h-[120%] object-cover opacity-40 transition-transform duration-75 ease-out will-change-transform"
                    style={{ transform: `translateY(${scrollY * 0.5}px)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 text-center">
                <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-2xl">
                        نافع للحدادة الفنية <br className="hidden md:block" /> 
                        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-300% animate-gradient pb-2">
                            أبواب، نوافذ، وديكور عصري
                        </span>
                    </h1>
                </div>
                
                <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 px-2 leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                    أفضل ورشة لتصنيع الأبواب الحديدية (Laser Cut)، ديكورات الأعراس، وتجهيزات المنازل. جودة عالية وتوصيل لجميع ولايات الجزائر.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 animate-fade-in-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                    <button 
                        onClick={() => onChangeView('products')}
                        className="group relative w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center">
                            تصفح المنتجات
                            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    </button>
                    <button 
                        onClick={() => onChangeView('custom-design')}
                        className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white hover:text-gray-900 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                        اطلب تصميمك الخاص
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;