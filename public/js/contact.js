// public/js/contact.js
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const viewCvBtn = document.getElementById('view-cv-btn');

    // View CV functionality
    if (viewCvBtn) {
        viewCvBtn.addEventListener('click', function() {
            window.open('/view-cv', '_blank');
        });
    }

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            // Validate form
            if (!validateForm(data)) {
                return;
            }

            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                const response = await fetch('/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                // Show status message
                showStatusMessage(result.success, result.message);

                if (result.success) {
                    contactForm.reset();
                }

            } catch (error) {
                console.error('Error:', error);
                showStatusMessage(false, 'Network error. Please try again.');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }

    // Form validation
    function validateForm(data) {
        // Clear previous status
        formStatus.className = '';
        formStatus.textContent = '';

        // Check for empty fields
        for (const key in data) {
            if (!data[key].trim()) {
                showStatusMessage(false, 'Please fill in all fields.');
                return false;
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showStatusMessage(false, 'Please enter a valid email address.');
            return false;
        }

        return true;
    }

    // Show status message
    function showStatusMessage(isSuccess, message) {
        formStatus.textContent = message;
        formStatus.className = isSuccess ? 'success' : 'error';
        
        // Auto-hide success message after 5 seconds
        if (isSuccess) {
            setTimeout(() => {
                formStatus.className = '';
                formStatus.textContent = '';
            }, 5000);
        }
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});