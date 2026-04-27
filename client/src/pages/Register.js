import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../redux/slices/authSlice';
import useAuth from '../hooks/useAuth';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [localError, setLocalError] = useState('');

  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setLocalError('Passwords do not match'); return; }
    setLocalError('');
    dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
  };

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <div className="card border-0 shadow-sm p-4">
        <h4 className="fw-bold text-center mb-4">Create Account</h4>
        {(error || localError) && <div className="alert alert-danger py-2">{error || localError}</div>}
        <form onSubmit={handleSubmit}>
          {[['name','Full Name','text'],['email','Email','email'],['password','Password','password'],['confirm','Confirm Password','password']].map(([field, label, type]) => (
            <div className="mb-3" key={field}>
              <label className="form-label">{label}</label>
              <input className="form-control" type={type} placeholder={label}
                value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required />
            </div>
          ))}
          <button className="btn btn-danger w-100" type="submit" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" /> : 'Register'}
          </button>
        </form>
        <p className="text-center mt-3 mb-0">
          Already have an account? <Link to="/login" className="text-danger">Login</Link>
        </p>
      </div>
    </div>
  );
}
