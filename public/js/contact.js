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

            // Use EmailJS to send email directly from frontend
            // Load EmailJS SDK if not already loaded
            if (typeof emailjs === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js';
                script.onload = sendEmailWithEmailJS;
                document.body.appendChild(script);
            } else {
                sendEmailWithEmailJS();
            }

            function sendEmailWithEmailJS() {
                // Fetch EmailJS keys from public config endpoint
                fetch('/config/emailjs')
                    .then(response => response.json())
                    .then(config => {
                        emailjs.init(config.EMAILJS_PUBLIC_KEY);
                        return emailjs.send(config.EMAILJS_SERVICE_ID, config.EMAILJS_TEMPLATE_ID, {
                            from_name: data.name,
                            from_email: data.email,
                            subject: data.subject,
                            message: data.message
                        });
                    })
                    .then(function() {
                        formStatus.textContent = 'Message sent successfully!';
                        formStatus.style.color = 'green';
                        contactForm.reset();
                    }, function(error) {
                        formStatus.textContent = 'Failed to send message. Please try again later.';
                        formStatus.style.color = 'red';
                    })
                    .finally(function() {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Message';
                    });
            }
            });
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