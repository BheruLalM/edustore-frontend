import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import { sendMessage } from '../chatSlice';
import toast from 'react-hot-toast';

const MessageInput = ({ userId }) => {
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 9MB)
        if (file.size > 9 * 1024 * 1024) {
            toast.error('Image size should be less than 9MB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setImageFile(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSend = async () => {
        if (!text.trim() && !imageFile) return;

        try {
            await dispatch(sendMessage({
                userId,
                text: text.trim(),
                image: imageFile,
            })).unwrap();

            // Clear input
            setText('');
            handleRemoveImage();
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-2 sm:p-4 bg-white dark:bg-slate-900 transition-colors">
            {/* Image Preview */}
            {imagePreview && (
                <div className="mb-2 relative inline-block">
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-16 w-16 sm:h-24 sm:w-24 object-cover rounded-lg border dark:border-slate-700"
                    />
                    <button
                        onClick={handleRemoveImage}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                    >
                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </button>
                </div>
            )}

            {/* Input Area */}
            <div className="flex items-center space-x-1.5 sm:space-x-3">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 sm:p-2.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                    aria-label="Attach image"
                >
                    <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                <div className="flex-1 relative">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2.5 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/50 resize-none max-h-32 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm sm:text-base leading-tight"
                    />
                </div>

                <button
                    onClick={handleSend}
                    disabled={!text.trim() && !imageFile}
                    className="p-1.5 sm:p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:scale-95 transition-all shadow-md active:scale-90"
                    aria-label="Send message"
                >
                    <Send className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
