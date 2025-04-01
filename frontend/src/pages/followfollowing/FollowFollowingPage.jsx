import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useFollow from "../../hooks/useFollow"; // Assuming you have a custom hook for follow/unfollow logic

const FollowFollowingPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  // Initialize feedType based on URL param
  const [feedType, setFeedType] = useState(params.feed_type || 'following');

  useEffect(() => {
    // Update URL whenever feedType changes
    navigate(`/follower_following/${feedType}`, { replace: true });
  }, [feedType, navigate]);

  // Fetch followers or following based on feedType
  const { data: users, isLoading } = useQuery({
    queryKey: [feedType],
    queryFn: async () => {
      const response = await fetch(`/api/users/follow_following/${feedType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Cache data for 30 minutes
  });



  // Fetch the authenticated user data
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // Use the custom follow/unfollow hook
  const { follow, isPending } = useFollow();

  return (
    <div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
      {/* Header */}
      <div className='flex w-full border-b border-gray-700'>
        <div
          className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative ${
            feedType === 'following' ? 'text-primary' : ''
          }`}
          onClick={() => setFeedType('following')}
        >
          Following
          {feedType === 'following' && (
            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
          )}
        </div>
        <div
          className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative ${
            feedType === 'followers' ? 'text-primary' : ''
          }`}
          onClick={() => setFeedType('followers')}
        >
          Followers
          {feedType === 'followers' && (
            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
          )}
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className='flex justify-center h-full items-center'>
          <LoadingSpinner size='lg' />
        </div>
      )}

      {/* Users List */}
      {users?.length === 0 && (
        <div className='text-center p-4 font-bold'>
          No {feedType === 'following' ? 'following' : 'followers'} yet 🤔
        </div>
      )}
      {users?.map((user) => {
        const amIFollowing = authUser?.following.includes(user._id);

        return (
          <div className='border-b border-gray-700' key={user._id}>
            <div className='flex justify-between items-center p-4'>
              <Link to={`/profile/${user.username}`} className='flex gap-2 items-center'>
                <div className='avatar'>
                  <div className='w-8 rounded-full'>
                    <img src={user.profileImg || '/avatar-placeholder.png'} alt='Profile' />
                  </div>
                </div>
                <span className='font-bold'>@{user.username}</span>
              </Link>
              <button 
                className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
                onClick={() => follow(user._id)}
              >
                {isPending ? "Loading..." : feedType === 'following' || amIFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FollowFollowingPage;
