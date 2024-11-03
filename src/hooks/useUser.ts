import { useEffect, useState } from 'react';

const useUser = () => {
  const initialUserData = {};
  const [userData, setUserData] = useState(initialUserData);

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');

    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Error loading user data from localStorage:', error);
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(userData));
  }, [userData]);

  return { userData, setUserData };
};

export default useUser;