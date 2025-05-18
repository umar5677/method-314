// components/HomeRedirect.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import HomeUA from './HomeUA';
import HomeC from './HomeC';
import HomeHO from './HomeHO';
import HomePM from './HomePM';
import HomeD from './HomeD';
import HomeAS from './HomeAS';
import HomePS from './HomePS';

const HomeRedirect = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [suspendedStatus, setSuspendedStatus] = useState({
    accountSuspended: false,
    profileSuspended: false
  });
  const userCookie = Cookies.get('user');

  useEffect(() => {
    const checkSuspension = async () => {
      try {
        if (!userCookie) return;

        const user = JSON.parse(userCookie);
        
        // Check account suspension
        const userResponse = await fetch(`http://localhost:3001/users/${user.id}`);
        if (!userResponse.ok) throw new Error('User not found');
        const userData = await userResponse.json();
        
        // Check profile suspension
        const profilesResponse = await fetch('http://localhost:3001/profiles');
        const profiles = await profilesResponse.json();
        const userProfile = profiles.find(p => p.profile === user.profile);

        setSuspendedStatus({
          accountSuspended: userData.suspended === 1,
          profileSuspended: userProfile?.suspended === 1
        });
      } catch (error) {
        console.error('Suspension check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSuspension();
  }, [userCookie]);

  if (!userCookie) return <Navigate to="/" />;
  if (isLoading) return <div>Loading...</div>;

  try {
    const user = JSON.parse(userCookie);

    if (suspendedStatus.accountSuspended) {
      console.log(`⚠️ Account Suspended (User ID: ${user.id}) - Redirecting to AS`);
      return <HomeAS />;
    }
    
    if (suspendedStatus.profileSuspended) {
      console.log(`⚠️ Profile Suspended (Profile: ${user.profile}) - Redirecting to PS`);
      return <HomePS />;
    }

    switch(user.profile) {
      case 'useradmin': return <HomeUA />;
      case 'cleaner': return <HomeC />;
      case 'homeowner': return <HomeHO />;
      case 'platformmanager': return <HomePM />;
      default: return <HomeD />;
    }
  } catch (err) {
    console.error('❌ Cookie Parse Error:', err);
    return <Navigate to="/" />;
  }
};

export default HomeRedirect;
