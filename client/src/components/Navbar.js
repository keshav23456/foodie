import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isOwner, isAdmin } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm py-2" style={{ background: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold" to="/" style={{ color: '#e63946', fontSize: '1.4rem' }}>
          FoodApp
        </Link>

        <div className="d-flex align-items-center gap-3">
          <Link to="/cart" className="btn btn-outline-danger position-relative">
            <i className="fa fa-shopping-cart" /> Cart
            {cartItems.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartItems.length}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="dropdown">
              <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                {user?.name?.split(' ')[0]}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/orders">My Orders</Link></li>
                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                {(isOwner || isAdmin) && (
                  <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                )}
                {isAdmin && (
                  <li><Link className="dropdown-item" to="/admin">Admin Panel</Link></li>
                )}
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-danger">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
