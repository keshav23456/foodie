import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../hooks/useAuth';
import { updateProfile, addAddress, deleteAddress } from '../redux/slices/authSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' });
  const [addrForm, setAddrForm] = useState({ label: 'Home', street: '', city: '', pincode: '' });
  const [msg, setMsg] = useState('');

  const handleProfileSave = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(form));
    setMsg('Profile updated!');
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwForm.password !== pwForm.confirm) { setMsg('Passwords do not match'); return; }
    await dispatch(updateProfile({ password: pwForm.password }));
    setPwForm({ password: '', confirm: '' });
    setMsg('Password changed!');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    await dispatch(addAddress(addrForm));
    setAddrForm({ label: 'Home', street: '', city: '', pincode: '' });
    setMsg('Address added!');
  };

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <h4 className="fw-bold mb-4">My Profile</h4>
      {msg && <div className="alert alert-success py-2">{msg}</div>}

      <div className="card border-0 shadow-sm p-4 mb-4">
        <h6 className="fw-bold mb-3">Personal Info</h6>
        <form onSubmit={handleProfileSave}>
          <div className="mb-3"><label className="form-label">Name</label>
            <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="mb-3"><label className="form-label">Email</label>
            <input className="form-control" value={user?.email} disabled /></div>
          <div className="mb-3"><label className="form-label">Phone</label>
            <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <button className="btn btn-danger" type="submit">Save Changes</button>
        </form>
      </div>

      <div className="card border-0 shadow-sm p-4 mb-4">
        <h6 className="fw-bold mb-3">Change Password</h6>
        <form onSubmit={handlePasswordSave}>
          <div className="mb-3"><label className="form-label">New Password</label>
            <input className="form-control" type="password" value={pwForm.password} onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })} /></div>
          <div className="mb-3"><label className="form-label">Confirm Password</label>
            <input className="form-control" type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} /></div>
          <button className="btn btn-outline-danger" type="submit">Update Password</button>
        </form>
      </div>

      <div className="card border-0 shadow-sm p-4">
        <h6 className="fw-bold mb-3">Saved Addresses</h6>
        {user?.addresses?.map((a) => (
          <div key={a._id} className="d-flex justify-content-between align-items-center border rounded p-2 mb-2">
            <span><strong>{a.label}</strong> — {a.street}, {a.city} {a.pincode}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(deleteAddress(a._id))}>Delete</button>
          </div>
        ))}
        <form onSubmit={handleAddAddress} className="mt-3">
          <div className="row g-2">
            {[['label','Label (Home/Work)'],['street','Street'],['city','City'],['pincode','Pincode']].map(([f,l]) => (
              <div key={f} className="col-6">
                <input className="form-control form-control-sm" placeholder={l} value={addrForm[f]} onChange={(e) => setAddrForm({ ...addrForm, [f]: e.target.value })} required />
              </div>
            ))}
          </div>
          <button className="btn btn-sm btn-danger mt-2" type="submit">+ Add Address</button>
        </form>
      </div>
    </div>
  );
}
