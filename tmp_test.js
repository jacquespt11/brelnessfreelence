import axios from 'axios';
(async () => {
  try {
    const login = await axios.post('http://localhost:3001/api/auth/login', { email: 'admin@demoshop.com', password: 'shopadmin123' });
    const token = login.data.access_token;
    
    // Decode token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    console.log('Token Payload:', JSON.parse(jsonPayload));
    
    const res = await axios.get('http://localhost:3001/api/reservations/me', { headers: { Authorization: `Bearer ${token}`} });
    console.log('Reservations Success:', res.data.length);
    
    const res2 = await axios.get('http://localhost:3001/api/tickets/me', { headers: { Authorization: `Bearer ${token}`} });
    console.log('Tickets Success:', res2.data.length);
  } catch (err) {
    console.error('Error status:', err.response?.status);
    console.error('Error data:', err.response?.data);
  }
})();
