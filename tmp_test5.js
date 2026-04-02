import axios from 'axios';

(async () => {
  try {
    const login = await axios.post('http://localhost:3001/api/auth/login', { email: 'super@brelness.com', password: 'superadmin123' });
    const token = login.data.access_token;
    console.log("Logged in successfully as super admin.");
    
    // Test GET /shoes
    const res = await axios.get('http://localhost:3001/api/shops', { headers: { Authorization: `Bearer ${token}` } });
    console.log("Success fetching shops! Count:", res.data.length);

    // Test GET /tickets/admin/all
    const res2 = await axios.get('http://localhost:3001/api/tickets/admin/all', { headers: { Authorization: `Bearer ${token}` } });
    console.log("Success fetching tickets! Count:", res2.data.length);
  } catch (err) {
    console.error("AXIOS ERROR:", err.response?.status, err.response?.data);
  }
})();
