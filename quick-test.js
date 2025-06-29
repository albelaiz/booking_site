import axios from 'axios';

async function testWeakPassword() {
  try {
    console.log('Testing weak password...');
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      username: 'testinvalid123',
      password: 'weak',
      name: 'Test User',
      email: 'test123@example.com'
    });
    
    console.log('Success (should not happen):', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Error (expected):', error.response.status, error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
}

testWeakPassword();
