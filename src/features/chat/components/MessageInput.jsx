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
        <div className="p-4 bg-white dark:bg-gray-800 transition-colors">
            {/* Image Preview */}
            {imagePreview && (
                <div className="mb-3 relative inline-block">
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-24 w-24 object-cover rounded-lg border dark:border-gray-600"
                    />
                    <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            )}

            {/* Input Area */}
            <div className="flex items-end space-x-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    aria-label="Attach image"
                >
                    <ImageIcon className="h-5 w-5" />
                </button>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />

                <button
                    onClick={handleSend}
                    disabled={!text.trim() && !imageFile}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                >
                    <Send className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
