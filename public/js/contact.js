document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    statusDiv.textContent = '';
    const formData = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value
    };
    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        statusDiv.style.color = 'green';
        statusDiv.textContent = data.message;
        form.reset();
      } else {
        statusDiv.style.color = 'red';
        statusDiv.textContent = data.error || 'Failed to send message.';
      }
    } catch (err) {
      statusDiv.style.color = 'red';
      statusDiv.textContent = 'Server error. Please try again later.';
    }
  });
});
