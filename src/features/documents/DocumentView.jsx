import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchDocumentDetails } from './documentSlice';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, ArrowLeft, Download, ExternalLink, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import LikeButton from './components/LikeButton';
import BookmarkButton from './components/BookmarkButton';
import CommentSection from '../comments/CommentSection';
import Navbar from '../../components/Navbar';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF worker - Use CDN with HTTPS
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const DocumentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentDocument: document, docLoading: loading, error } = useSelector(state => state.documents);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfLoading, setPdfLoading] = useState(true);

    const [containerWidth, setContainerWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setContainerWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        dispatch(fetchDocumentDetails(id));
    }, [id, dispatch]);

    // Update downloadUrl when document changes
    useEffect(() => {
        if (document?.file_url) {
            setDownloadUrl(document.file_url);
        }
    }, [document]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPdfLoading(false);
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Loading document...</p>
                </motion.div>
            </div>
        );
    }

    // Error state
    if (error || !document) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Document Not Found
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {error || "The document you're looking for doesn't exist or has been removed."}
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/')}
                        className="w-full"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                </motion.div>
            </div>
        );
    }

    const isPdf = document.doc_type === 'pdf' || document.content_type?.includes('pdf');
    const isImage = document.doc_type === 'image' || document.content_type?.includes('image');
    const isPost = document.doc_type === 'text' || document.doc_type === 'post';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors shrink-0"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{document.title}</h1>
                            <div className="flex items-center space-x-2 mt-1 flex-wrap">
                                <button
                                    onClick={() => navigate(`/profile/${document.owner_id || document.user_id}`)}
                                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity group/profile"
                                >
                                    <Avatar src={document.owner_avatar} alt={document.owner_name} size="sm" />
                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover/profile:text-indigo-600 dark:group-hover/profile:text-indigo-400 transition-colors truncate max-w-[150px] sm:max-w-none">
                                        {document.owner_name || document.owner_email}
                                    </span>
                                </button>
                                <span className="text-gray-300 dark:text-gray-600">•</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">
                                    {new Date(document.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                        <LikeButton
                            documentId={document.id}
                            isLiked={document.is_liked}
                            likeCount={document.like_count}
                            className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm px-3 py-1.5 h-auto rounded-lg"
                        />
                        <BookmarkButton
                            documentId={document.id}
                            isBookmarked={document.is_bookmarked}
                            className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm px-3 py-1.5 h-auto rounded-lg"
                        />
                        {!isPost && downloadUrl && (
                            <a
                                href={downloadUrl}
                                download={document.title}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                onClick={(e) => {
                                    // For PDFs, open in new tab for preview, or force download
                                    if (isPdf) {
                                        // Let the default behavior handle it
                                        return;
                                    }
                                }}
                            >
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Download</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Viewer */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden min-h-[400px] mb-8">
                    {isPdf ? (
                        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900/50 min-h-[600px] relative">
                            {pdfLoading && (
                                <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-100/80 dark:bg-gray-900/80">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                </div>
                            )}

                            <Document
                                file={{
                                    url: downloadUrl,
                                    httpHeaders: {
                                        'Accept': 'application/pdf',
                                    },
                                    withCredentials: false,
                                }}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={(error) => {
                                    console.error('PDF Load Error:', error);
                                    setPdfLoading(false);
                                }}
                                loading={<div className="h-96" />}
                                error={
                                    <div className="text-center p-8">
                                        <div className="text-red-500 mb-4">Failed to load PDF preview.</div>
                                        <a
                                            href={downloadUrl}
                                            download={document.title}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Click here to download and view the PDF
                                        </a>
                                    </div>
                                }
                                className="max-w-full shadow-lg"
                                options={{
                                    cMapUrl: 'https://unpkg.com/pdfjs-dist@' + pdfjs.version + '/cmaps/',
                                    cMapPacked: true,
                                    standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@' + pdfjs.version + '/standard_fonts/',
                                }}
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    width={Math.min(containerWidth - 64, 800)} // Responsive width
                                    className="bg-white"
                                />
                            </Document>

                            {numPages && (
                                <div className="mt-4 flex items-center space-x-4 bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow-sm border dark:border-gray-600">
                                    <button
                                        disabled={pageNumber <= 1}
                                        onClick={() => setPageNumber(p => p - 1)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full disabled:opacity-30 dark:text-white"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <span className="text-sm font-medium dark:text-white">Page {pageNumber} of {numPages}</span>
                                    <button
                                        disabled={pageNumber >= numPages}
                                        onClick={() => setPageNumber(p => p + 1)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full disabled:opacity-30 dark:text-white"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : isImage ? (
                        <div className="flex items-center justify-center bg-black/5 dark:bg-black/20 p-4">
                            <img src={downloadUrl} alt={document.title} className="max-h-[80vh] object-contain shadow-lg rounded-md" />
                        </div>
                    ) : isPost ? (
                        <div className="p-8 max-w-3xl mx-auto">
                            <div className="prose prose-blue dark:prose-invert max-w-none">
                                <div className="text-gray-900 dark:text-gray-100 text-lg whitespace-pre-wrap leading-relaxed">
                                    {document.content}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96 bg-gray-50 dark:bg-gray-800">
                            <div className="bg-white dark:bg-gray-700 p-6 rounded-full shadow-sm mb-4">
                                <ExternalLink className="h-10 w-10 text-gray-400 dark:text-gray-300" />
                            </div>
                            <p className="text-gray-900 dark:text-gray-100 font-medium text-lg mb-2">Preview not available</p>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">This file type cannot be previewed directly.</p>
                            <a
                                href={downloadUrl}
                                download
                                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                            >
                                Download file to view
                            </a>
                        </div>
                    )}
                </div>

                {/* Comments */}
                <CommentSection documentId={document.id} />
            </main>
        </div>
    );
};

export default DocumentView;
