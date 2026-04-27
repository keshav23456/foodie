import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, token, loading } = useSelector((state) => state.auth);
  return {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isOwner: user?.role === 'owner',
    isAdmin: user?.role === 'admin',
  };
};

export default useAuth;
