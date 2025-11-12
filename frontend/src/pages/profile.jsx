// import React, { useEffect, useState } from 'react';
// import api from '../services/api';
// import { Input } from '../components/ui/input';
// import { Button } from '../components/ui/button';
// import { useAuth } from '../contexts/AuthContextt';

// export default function Profile() {
//   const { user, setUser } = useAuth();
//   const [form, setForm] = useState({ name: '', phone: '', profile: { bio: '', location: '' } });

//   useEffect(() => {
//     if (user) {
//       setForm({
//         name: user.name || '',
//         phone: user.phone || '',
//         profile: { bio: user.profile?.bio || '', location: user.profile?.location || '' }
//       });
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'bio' || name === 'location') {
//       setForm({ ...form, profile: { ...form.profile, [name]: value } });
//     } else setForm({ ...form, [name]: value });
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.put('/users/me', form);
//       setUser(res.data.user);
//       alert('Profile updated');
//     } catch (err) {
//       alert(err.message || 'Failed to update');
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
//       <h2 className="text-xl font-semibold mb-4">My profile</h2>
//       <form onSubmit={onSubmit} className="space-y-3">
//         <Input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
//         <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
//         <Input name="bio" placeholder="Bio" value={form.profile.bio} onChange={handleChange} />
//         <Input name="location" placeholder="Location" value={form.profile.location} onChange={handleChange} />
//         <Button type="submit">Save</Button>
//       </form>
//     </div>
//   );
// }
