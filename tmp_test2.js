import axios from 'axios';
(async () => {
  try {
    const login = await axios.post('http://localhost:3001/api/auth/login', { email: 'super@brelness.com', password: 'superadmin123' });
    const token = login.data.access_token;
    
    // Fetch users
    const users = await axios.get('http://localhost:3001/api/auth/users', { headers: { Authorization: `Bearer ${token}`} });
    console.log('Users:', users.data.map(u => ({ email: u.email, role: u.role })));
    
    // Pick first SHOP_ADMIN to test 403
    const shopAdmin = users.data.find(u => u.role === 'SHOP_ADMIN');
    if (shopAdmin) {
       console.log('Testing api/reservations/me as', shopAdmin.email);
       // we can't login as them without their password... or we can use the backend directly to generate a token
    }
  } catch (err) {
    console.error('Error status:', err.response?.status);
    console.error('Error data:', err.response?.data);
  }
})();
