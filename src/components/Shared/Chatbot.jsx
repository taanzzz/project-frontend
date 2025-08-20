import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import LottiePlayer from 'react-lottie-player';
import { FaPaperPlane, FaTimes, FaRobot, FaComments, FaGripVertical } from 'react-icons/fa';
import { useMediaQuery } from '@react-hook/media-query';
import useAuth from '../../hooks/useAuth';
import useUserProfile from '../../hooks/useUserProfile';

const Chatbot = () => {
    const { user } = useAuth();
    const { data: userProfile } = useUserProfile();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [animationData, setAnimationData] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const messagesEndRef = useRef(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    const [isThinking, setIsThinking] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const chatWindowRef = useRef(null);

    const isDark = theme === 'dark';

    useEffect(() => {
        const handleStorageChange = () => {
            setTheme(localStorage.getItem('theme') || 'light');
        };

        window.addEventListener('storage', handleStorageChange);
        const observer = new MutationObserver(() => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(currentTheme);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (isMobile) return;
        fetch("https://res.cloudinary.com/dwkj2w1ds/raw/upload/v1754731759/Robot_Futuristic_Ai_animated_cpocf8.json")
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(error => console.error("Error fetching Lottie animation:", error));
    }, [isMobile]);

    const handleMouseDown = (e) => {
        if (e.target.closest('.drag-handle')) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    const mutation = useMutation({
        mutationFn: async (newMessages) => {
            const history = newMessages.slice(0, -1).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                content: msg.text
            }));
            const currentMessage = newMessages[newMessages.length - 1]?.text || "";

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chatbot/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access-token')}`
                },
                body: JSON.stringify({ message: currentMessage, history })
            });
            if (!response.ok) throw new Error("Failed to get response from Emaath.");
            return response.body.getReader();
        },
        onSuccess: async (reader) => {
            setIsThinking(false);

            setMessages(prev => [...prev, { sender: 'bot', text: '' }]);
            
            let accumulatedResponse = '';
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                accumulatedResponse += decoder.decode(value, { stream: true });
            }

            let i = 0;
            const typingSpeed = 30; // Milliseconds per character
            const typingInterval = setInterval(() => {
                if (i < accumulatedResponse.length) {
                    setMessages(prev => {
                        const updatedMessages = [...prev];
                        updatedMessages[updatedMessages.length - 1].text = accumulatedResponse.substring(0, i + 1);
                        return updatedMessages;
                    });
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, typingSpeed);
        },
        onError: () => {
            setIsThinking(false);
            setMessages(prev => {
                const filtered = prev.filter(msg => msg.text !== '');
                return [...filtered, { sender: 'bot', text: "I seem to be lost in deep thought. Could you ask again in a moment?" }];
            });
        }
    });
    
    const sendMessage = (text) => {
        if (!text.trim() || mutation.isLoading || isThinking) return;
        const userMessage = { sender: 'user', text };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsThinking(true);
        mutation.mutate(newMessages);
    };

    const handleSend = (e) => { e.preventDefault(); sendMessage(inputValue); };
    
    useEffect(() => {
        if (isOpen && messages.length === 0 && !mutation.isLoading) {
             setIsThinking(true);
             mutation.mutate([]);
        }
    }, [isOpen, messages.length]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const presetQuestions = [
        "What is Mind Over Myth?", 
        "Recommend a book on Stoicism.", 
        "How can I find inner peace?",
        "Tell me about philosophy",
        "What's your favorite quote?"
    ];

    if (!user) return null;

    const mobileBotImage = "https://res.cloudinary.com/dwkj2w1ds/image/upload/v1755339660/vecteezy_3d-artificial-intelligence-chatbot-on-transparent-background_45699879_1_qrzkzx.png";
    const desktopBotAvatar = "https://res.cloudinary.com/dwkj2w1ds/image/upload/v1754736138/chatbot_1_hcrlwy.png";
    const botAvatarUrl = isMobile ? mobileBotImage : desktopBotAvatar;

    return (
        <>
            <motion.div 
                className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[100] cursor-pointer group`}
                whileHover={isMobile ? {} : { scale: 1.1 }}
                whileTap={isMobile ? {} : { scale: 0.95 }}
                onClick={() => setIsOpen(true)}
            >
                <div className={`absolute inset-0 rounded-full blur-xl opacity-75 ${isMobile ? '' : 'animate-pulse'} ${isDark ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400' : 'bg-gradient-to-r from-pink-400 via-rose-400 to-red-400'}`} />
                
                <div className={`relative w-28 h-28 md:w-80 md:h-80 rounded-full overflow-hidden ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-2xl shadow-indigo-500/30' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-2xl shadow-pink-500/30'} backdrop-blur-md border-2 ${isDark ? 'border-white/20' : 'border-white/40'}`}>
                    
                    <div className="absolute inset-0">
                        {!isMobile && (
                            <>
                                <div className={`absolute top-2 left-3 w-1 h-1 ${isDark ? 'bg-indigo-200' : 'bg-white'} rounded-full animate-ping delay-100`} />
                                <div className={`absolute bottom-3 right-2 w-1.5 h-1.5 ${isDark ? 'bg-purple-200' : 'bg-white'} rounded-full animate-ping delay-300`} />
                                <div className={`absolute top-1/2 right-4 w-0.5 h-0.5 ${isDark ? 'bg-pink-200' : 'bg-white'} rounded-full animate-ping delay-500`} />
                            </>
                        )}
                    </div>

                    {!isMobile && animationData ? (
                        <LottiePlayer
                            loop
                            animationData={animationData}
                            play
                            className="w-full h-full scale-110 md:scale-120"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <img 
                                src={botAvatarUrl} 
                                alt="Chatbot" 
                                className={`object-contain ${isMobile ? 'w-4/4 h-4/4' : 'w-full h-full'}`} 
                            />
                        </div>
                    )}

                </div>

                <motion.div 
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                    initial={isMobile ? { opacity: 0, y: 5 } : { opacity: 0, y: 10 }}
                    animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                    transition={isMobile ? { delay: 0.3, duration: 0.2 } : { delay: 0.5, duration: 0.4 }}
                >
                    <div className={`${isDark ? 'bg-gray-900/90 border-indigo-400/50 text-indigo-300' : 'bg-white/90 border-pink-300/50 text-pink-600'} backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border shadow-lg`}>
                        <FaComments className={`inline mr-2 ${isMobile ? '' : 'animate-pulse'}`} />
                        Ask Emu
                    </div>
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent ${isDark ? 'border-t-gray-900/90' : 'border-t-white/90'}`} />
                </motion.div>

                <div className={`absolute inset-0 rounded-full ${isDark ? 'bg-indigo-400/20' : 'bg-pink-400/20'} ${isMobile ? '' : 'animate-ping'}`} />
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={chatWindowRef}
                        className={`fixed z-[100] w-[90vw] max-w-md h-[70vh] ${isDark ? 'bg-gray-900/95 border border-white/20' : 'bg-white/95 border border-pink-200/50'} backdrop-blur-xl rounded-3xl flex flex-col overflow-hidden shadow-2xl ${isDark ? 'shadow-indigo-500/20' : 'shadow-pink-500/20'}`}
                        style={{
                            bottom: '6rem',
                            right: '1.25rem',
                            transform: `translate(${position.x}px, ${position.y}px)`,
                        }}
                        initial={isMobile ? { opacity: 0, y: 20, scale: 0.98 } : { opacity: 0, y: 50, scale: 0.95 }}
                        animate={isMobile ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
                        exit={isMobile ? { opacity: 0, y: 20, scale: 0.98 } : { opacity: 0, y: 50, scale: 0.95 }}
                        transition={isMobile ? { type: 'spring', stiffness: 200, damping: 20, duration: 0.3 } : { type: 'spring', stiffness: 300, damping: 30 }}
                        onMouseDown={handleMouseDown}
                    >
                        <motion.div 
                            className={`relative p-6 ${isDark ? 'bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-b border-white/10' : 'bg-gradient-to-r from-white/50 to-pink-50/50 border-b border-pink-200/30'} backdrop-blur-md`}
                            initial={isMobile ? { opacity: 0, y: -10 } : { opacity: 0, y: -20 }}
                            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                            transition={isMobile ? { delay: 0.05, duration: 0.2 } : { delay: 0.1, duration: 0.4 }}
                        >
                            <div className="drag-handle absolute left-1/2 transform -translate-x-1/2 -top-2 cursor-grab active:cursor-grabbing">
                                <div className={`w-12 h-1 ${isDark ? 'bg-white/30' : 'bg-gray-400/50'} rounded-full`} />
                            </div>

                            <div className="absolute inset-0 overflow-hidden">
                                {!isMobile && (
                                    <>
                                        <div className={`absolute top-2 left-8 w-1 h-1 ${isDark ? 'bg-indigo-400' : 'bg-pink-400'} rounded-full animate-ping`} />
                                        <div className={`absolute bottom-2 right-12 w-0.5 h-0.5 ${isDark ? 'bg-purple-400' : 'bg-rose-400'} rounded-full animate-ping delay-300`} />
                                    </>
                                )}
                            </div>

                            <div className="relative flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} flex items-center justify-center shadow-lg`}>
                                        <FaRobot className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                            Emu AI
                                        </h3>
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Your philosophy companion
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="drag-handle cursor-grab active:cursor-grabbing p-2 rounded-lg hover:bg-white/10 transition-colors">
                                        <FaGripVertical className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                    </div>
                                    <motion.button 
                                        onClick={() => setIsOpen(false)} 
                                        className={`w-8 h-8 rounded-full ${isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} flex items-center justify-center transition-all duration-300`}
                                        whileHover={isMobile ? {} : { scale: 1.1, rotate: 90 }}
                                        whileTap={isMobile ? {} : { scale: 0.9 }}
                                    >
                                        <FaTimes className="text-sm" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                        
                        <div className="flex-grow p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-gray-300">
                            <AnimatePresence>
                                {messages.map((msg, index) => (
                                    <motion.div 
                                        key={index} 
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                                        initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 20 }}
                                        animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                                        transition={isMobile ? { duration: 0.2, delay: index * 0.05 } : { duration: 0.3, delay: index * 0.1 }}
                                    >
                                        {msg.sender !== 'user' && (
                                            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/20 flex-shrink-0">
                                                <img 
                                                    src={botAvatarUrl} 
                                                    alt="Emu" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-lg ${
                                            msg.sender === 'user'
                                                ? isDark 
                                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                                    : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                                                : isDark 
                                                    ? 'bg-gray-800/80 text-gray-200 border border-white/10'
                                                    : 'bg-white/80 text-gray-700 border border-gray-200/50'
                                        } backdrop-blur-md`}>
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        </div>
                                        {msg.sender === 'user' && (
                                            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/20 flex-shrink-0">
                                                <img 
                                                    src={userProfile?.image || '/default-avatar.png'} 
                                                    alt="You" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isThinking && (
                                <motion.div 
                                    className="flex justify-start items-end gap-2"
                                    initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 20 }}
                                    animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                                    transition={isMobile ? { duration: 0.2 } : { duration: 0.3 }}
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/20">
                                        <img src={botAvatarUrl} alt="Emu" className="w-full h-full object-cover"/>
                                    </div>
                                    <div className={`px-4 py-3 rounded-2xl ${isDark ? 'bg-gray-800/80 border border-white/10' : 'bg-white/80 border border-gray-200/50'} backdrop-blur-md shadow-lg`}>
                                        <div className="flex gap-1">
                                            <div className={`w-2 h-2 ${isDark ? 'bg-indigo-400' : 'bg-pink-400'} rounded-full animate-bounce`} />
                                            <div className={`w-2 h-2 ${isDark ? 'bg-indigo-400' : 'bg-pink-400'} rounded-full animate-bounce delay-100`} />
                                            <div className={`w-2 h-2 ${isDark ? 'bg-indigo-400' : 'bg-pink-400'} rounded-full animate-bounce delay-200`} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <AnimatePresence>
                            {messages.length <= 1 && !mutation.isLoading && !isThinking && (
                                <motion.div 
                                    className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-pink-200/30'} space-y-3 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-gray-300`}
                                    initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 20 }}
                                    animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                                    exit={isMobile ? { opacity: 0, y: -10 } : { opacity: 0, y: -20 }}
                                    transition={isMobile ? { duration: 0.2 } : { duration: 0.4 }}
                                >
                                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} text-center`}>
                                        Quick questions to get started:
                                    </p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {presetQuestions.map((q, index) => (
                                            <motion.button 
                                                key={q}
                                                onClick={() => sendMessage(q)} 
                                                className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${isDark ? 'border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-400' : 'border-pink-300/50 text-pink-600 hover:bg-pink-50 hover:border-pink-400'} backdrop-blur-md text-left`}
                                                whileHover={isMobile ? {} : { scale: 1.02 }}
                                                whileTap={isMobile ? {} : { scale: 0.98 }}
                                                initial={isMobile ? { opacity: 0, y: 5 } : { opacity: 0, y: 10 }}
                                                animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                                                transition={isMobile ? { delay: index * 0.05, duration: 0.2 } : { delay: index * 0.1, duration: 0.3 }}
                                            >
                                                {q}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.form 
                            onSubmit={handleSend} 
                            className={`p-4 border-t ${isDark ? 'border-white/10 bg-gray-900/50' : 'border-pink-200/30 bg-white/50'} backdrop-blur-md flex gap-3`}
                            initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 20 }}
                            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                            transition={isMobile ? { delay: 0.1, duration: 0.2 } : { delay: 0.2, duration: 0.4 }}
                        >
                            <div className="relative flex-1">
                                <motion.input 
                                    type="text" 
                                    value={inputValue} 
                                    onChange={(e) => setInputValue(e.target.value)} 
                                    placeholder="Type your message..." 
                                    className={`w-full px-4 py-3 rounded-2xl ${isDark ? 'bg-gray-800/80 border-white/10 text-gray-200 placeholder-gray-400' : 'bg-white/80 border-pink-200/50 text-gray-700 placeholder-gray-500'} border backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} focus:border-transparent`}
                                    whileFocus={isMobile ? {} : { scale: 1.02 }}
                                    transition={isMobile ? {} : { duration: 0.2 }}
                                />
                            </div>
                            <motion.button 
                                type="submit" 
                                className={`w-12 h-12 rounded-2xl ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-indigo-500/30' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30'} text-white shadow-lg flex items-center justify-center transition-all duration-300 disabled:opacity-50`}
                                disabled={mutation.isLoading || !inputValue.trim() || isThinking}
                                whileHover={isMobile ? {} : { scale: 1.05 }}
                                whileTap={isMobile ? {} : { scale: 0.95 }}
                            >
                                <FaPaperPlane className="text-sm" />
                            </motion.button>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;