export async function submitContactForm(name, email, message) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
<<<<<<< HEAD
  
=======
  
  
>>>>>>> 31fb915a5c5646fdbd83be355d01cde53af941a8
