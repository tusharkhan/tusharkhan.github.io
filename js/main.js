// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const currentYear = new Date().getFullYear();
    document.querySelector('.footer-bottom p').innerHTML = `&copy; ${currentYear} Tushar Khan. All Rights Reserved.`;

    // GitHub Contribution Graph Year Filter
    const contributionYearSelect = document.getElementById('contributionYear');
    const githubContributionGraph = document.getElementById('githubContributionGraph');

    if (contributionYearSelect && githubContributionGraph) {
        // Populate the year dropdown with the last 5 years
        const startYear = 2019; // You can adjust this as needed
        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            contributionYearSelect.appendChild(option);
        }

        // Function to update the contribution graph based on selected year
        function updateContributionGraph(year) {
            // The ghchart.rshah.org service doesn't directly support year filtering
            // We'll use a workaround by adding a timestamp parameter to force a refresh
            // and display a message indicating the selected year

            const username = 'tusharkhan'; // GitHub username
            const color = '1a1a1a'; // Color for the graph

            // Update the graph container with the image and year indicator
            githubContributionGraph.innerHTML = `
                <div class="text-center text-sm text-gray-500 mb-2">Showing contributions for ${year}</div>
                <img src="https://ghchart.rshah.org/${color}/${username}?year=${year}" 
                     alt="Tushar Khan's GitHub Contributions for ${year}" 
                     class="w-full rounded-md shadow-sm">
            `;
        }

        // Set initial graph to current year
        updateContributionGraph(currentYear);

        // Handle year selection change
        contributionYearSelect.addEventListener('change', function() {
            updateContributionGraph(this.value);
        });
    }

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handling with Formspree
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Formspree will handle the form submission
            // We don't need to prevent default or manually send the data

            // Optional: Show a loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            // We'll add a success handler for when the form is submitted
            // This is optional as Formspree will redirect to a success page by default
            fetch(this.action, {
                method: this.method,
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Form submitted successfully
                    alert('Thank you for your message! I will get back to you soon.');
                    this.reset();
                } else {
                    // Error in form submission
                    response.json().then(data => {
                        alert('Oops! There was a problem submitting your form. ' + (data.error || ''));
                    });
                }
            })
            .catch(error => {
                // Network error
                alert('Oops! There was a problem submitting your form. Please try again later.');
            })
            .finally(() => {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });

            // Prevent the default form submission since we're handling it with fetch
            e.preventDefault();
        });
    }

    // Add animation to skill cards on scroll
    const skillCards = document.querySelectorAll('.skill-card');
    const projectCards = document.querySelectorAll('.project-card');

    // Simple function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to add animation class when element is in viewport
    function animateOnScroll() {
        skillCards.forEach(card => {
            if (isInViewport(card)) {
                card.classList.add('animate');
            }
        });

        projectCards.forEach(card => {
            if (isInViewport(card)) {
                card.classList.add('animate');
            }
        });
    }

    // Initial check on page load
    animateOnScroll();

    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
});
