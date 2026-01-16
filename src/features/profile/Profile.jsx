import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, fetchUserDocuments, toggleFollowUser, clearProfile } from './profileSlice';
import { Mail, BookOpen, Users, UserPlus, UserCheck, Edit2, GraduationCap } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import DocumentCard from '../documents/components/DocumentCard';
import { Skeleton } from '../../components/Skeleton';
import toast from 'react-hot-toast';
import ChatButton from '../chat/components/ChatButton';

import FollowListModal from './FollowListModal';
import EditProfileModal from './EditProfileModal';

const Profile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);
    const { currentProfile, userDocuments, loading, docsLoading, followLoading } = useSelector((state) => state.profile);

    // Handle inconsistent backend user ID fields (user_id vs id)
    const currentUserId = currentUser?.user_id || currentUser?.id;
    const targetId = userId || currentUserId;
    const isOwnProfile = Number(currentUserId) === Number(targetId);

    useEffect(() => {
        if (targetId) {
            dispatch(fetchUserProfile(targetId));
            dispatch(fetchUserDocuments({ userId: targetId }));
        }
    }, [targetId]); // dispatch is stable and doesn't need to be in deps

    const handleFollow = async () => {
        if (!currentProfile) return;

        try {
            await dispatch(toggleFollowUser({
                userId: targetId,
                isFollowing: currentProfile.is_following
            })).unwrap();

            // ✅ No need to re-fetch - Redux slice already updates the state
            toast.success(currentProfile.is_following ? 'Unfollowed' : 'Followed');
        } catch (error) {
            toast.error('Action failed');
        }
    };

    if (loading || !currentProfile) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden mb-8">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6">
                            <div className="relative">
                                <Avatar
                                    src={currentProfile.profile_url}
                                    alt={currentProfile.name || currentProfile.email}
                                    size="xl"
                                    className="border-4 border-white dark:border-gray-800 h-32 w-32 shadow-md"
                                />
                            </div>

                            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 text-center sm:text-left">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {currentProfile.name || currentProfile.email?.split('@')[0]}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start mt-1">
                                    <Mail className="h-4 w-4 mr-1" />
                                    {currentProfile.email}
                                </p>
                                {currentProfile.college && (
                                    <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center sm:justify-start mt-1 text-sm">
                                        <GraduationCap className="h-4 w-4 mr-1" />
                                        {currentProfile.course} • {currentProfile.college}
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 sm:mt-0 flex space-x-3">
                                {isOwnProfile ? (
                                    <Button
                                        variant="secondary"
                                        onClick={() => setShowEditModal(true)}
                                        className="flex items-center dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                    >
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant={currentProfile.is_following ? "secondary" : "primary"}
                                            onClick={handleFollow}
                                            isLoading={followLoading}
                                            className="flex items-center min-w-[120px]"
                                        >
                                            {currentProfile.is_following ? (
                                                <>
                                                    <UserCheck className="h-4 w-4 mr-2" />
                                                    Following
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="h-4 w-4 mr-2" />
                                                    Follow
                                                </>
                                            )}
                                        </Button>
                                        {/* Message button - only for students */}
                                        <ChatButton
                                            userId={targetId}
                                            userName={currentProfile.name || currentProfile.email}
                                            email={currentProfile.email}
                                            variant="button"
                                            targetIsStudent={currentProfile.is_student}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex border-t dark:border-gray-700 pt-6 justify-between sm:justify-start gap-4 sm:gap-12">
                            <div className="text-center sm:text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 -m-2 rounded-lg transition-colors">
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentProfile.documents_count || userDocuments.length || 0}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Documents</div>
                            </div>
                            <button
                                onClick={() => setShowFollowers(true)}
                                className="text-center sm:text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 -m-2 rounded-lg transition-colors"
                            >
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentProfile.followers_count || 0}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Followers</div>
                            </button>
                            <button
                                onClick={() => setShowFollowing(true)}
                                className="text-center sm:text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 -m-2 rounded-lg transition-colors"
                            >
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentProfile.following_count || 0}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Following</div>
                            </button>
                        </div>
                    </div>
                </div>

                {showFollowers && (
                    <FollowListModal
                        userId={targetId}
                        type="followers"
                        onClose={() => setShowFollowers(false)}
                    />
                )}

                {showFollowing && (
                    <FollowListModal
                        userId={targetId}
                        type="following"
                        onClose={() => setShowFollowing(false)}
                    />
                )}

                {showEditModal && (
                    <EditProfileModal
                        currentProfile={currentProfile}
                        onClose={() => setShowEditModal(false)}
                    />
                )}
                {/* User Content */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-500" />
                        Uploaded Documents
                    </h2>

                    {docsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700 h-64">
                                    <Skeleton className="h-4 w-3/4 mb-4 bg-gray-200 dark:bg-gray-700" />
                                    <Skeleton className="h-32 w-full rounded-md mb-4 bg-gray-200 dark:bg-gray-700" />
                                    <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
                                </div>
                            ))}
                        </div>
                    ) : userDocuments.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {userDocuments.map(doc => (
                                    <DocumentCard key={doc.id} document={doc} />
                                ))}
                            </div>

                            {/* Load More Button */}
                            {userDocuments.length >= 20 && userDocuments.length % 20 === 0 && (
                                <div className="flex justify-center mt-8">
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            dispatch(fetchUserDocuments({
                                                userId: targetId,
                                                limit: 20,
                                                offset: userDocuments.length
                                            }));
                                        }}
                                        isLoading={docsLoading}
                                        className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                    >
                                        Load More Documents
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-12 text-center text-gray-500 dark:text-gray-400">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                                <BookOpen className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No documents yet</h3>
                            <p className="mt-1">This user hasn't uploaded any public documents.</p>
                        </div>
                    )}
                </div>
            </main >
        </div >
    );
};

export default Profile;
