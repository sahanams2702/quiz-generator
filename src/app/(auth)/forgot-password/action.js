// lib/actions.js
export const sendOtp = async (email) => {
    try {
      const response = await fetch('/api/change-password/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.error || 'Error sending OTP');
      }
      return data; // return any success message or relevant info
    } catch (error) {
      throw new Error(error.message || 'Error sending OTP');
    }
  };
  
  export const verifyOtp = async (email, otpInput) => {
    try {
      const response = await fetch('/api/change-password/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otpInput }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.error || 'Invalid OTP');
      }
      return data; // return success data or relevant info
    } catch (error) {
      throw new Error(error.message || 'Error verifying OTP');
    }
  };
  
  export const updatePassword = async (email, newPassword) => {
    try {
      const response = await fetch('/api/change-password/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, newPassword }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.error || 'Error updating password');
      }
      return data; // return success message or relevant info
    } catch (error) {
      throw new Error(error.message || 'Error updating password');
    }
  };
  
