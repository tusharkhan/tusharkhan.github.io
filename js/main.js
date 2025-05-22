// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const currentYear = new Date().getFullYear();
    document.querySelector('.footer-bottom p').innerHTML = `&copy; ${currentYear} Tushar Khan. All Rights Reserved.`;

    // GitHub Contribution Graph Year Filter
    const contributionYearSelect = document.getElementById('contributionYear');
    const githubContributionGraph = document.getElementById('githubContributionGraph');

    if (contributionYearSelect && githubContributionGraph) {
        // Add loading spinner and overlay to the contribution graph container
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';

        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';

        githubContributionGraph.appendChild(loadingOverlay);
        githubContributionGraph.appendChild(loadingSpinner);

        // Populate the year dropdown with the last 5 years
        const startYear = 2017; // You can adjust this as needed
        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            contributionYearSelect.appendChild(option);
        }

        // Function to show loading state
        function showLoading() {
            loadingSpinner.style.display = 'block';
            loadingOverlay.style.display = 'block';
        }

        // Function to hide loading state
        function hideLoading() {
            loadingSpinner.style.display = 'none';
            loadingOverlay.style.display = 'none';
        }

        // Function to update the contribution graph based on selected year
        function updateContributionGraph(year) {
            // Show loading state
            showLoading();

            const username = 'tusharkhan'; // GitHub username
            const color = '1a1a1a'; // Color for the graph (matte black)

            // Create a new image element
            const img = new Image();

            // Set up load event handler
            img.onload = function() {
                // Clear the container
                githubContributionGraph.innerHTML = '';

                // Add year indicator and disclaimer
                const yearIndicator = document.createElement('div');
                yearIndicator.className = 'text-center text-sm text-gray-500 mb-2';
                yearIndicator.textContent = `Showing contributions for ${year}`;
                githubContributionGraph.appendChild(yearIndicator);

                // Add disclaimer about year filter limitation
                const disclaimer = document.createElement('div');
                disclaimer.className = 'text-center text-xs text-gray-400 mb-4';
                disclaimer.textContent = `Note: The graph shows your current GitHub contributions pattern.`;
                githubContributionGraph.appendChild(disclaimer);

                // Add the loaded image
                githubContributionGraph.appendChild(img);

                // Add link to GitHub profile
                const profileLink = document.createElement('div');
                profileLink.className = 'text-center mt-4';
                profileLink.innerHTML = `
                    <a href="https://github.com/${username}" target="_blank" class="text-blue-600 hover:underline text-sm">
                        View full profile on GitHub <i class="fas fa-external-link-alt ml-1"></i>
                    </a>
                `;
                githubContributionGraph.appendChild(profileLink);

                // Re-append the loading elements
                githubContributionGraph.appendChild(loadingOverlay);
                githubContributionGraph.appendChild(loadingSpinner);

                // Hide loading state
                hideLoading();
            };

            // Set up error event handler
            img.onerror = function() {
                // Show error message
                githubContributionGraph.innerHTML = `
                    <div class="text-center text-sm text-gray-500 mb-2">Showing contributions for ${year}</div>
                    <div class="text-center p-4 bg-red-100 text-red-700 rounded-md">
                        Failed to load contributions. Please try again later.
                    </div>
                `;

                // Re-append the loading elements
                githubContributionGraph.appendChild(loadingOverlay);
                githubContributionGraph.appendChild(loadingSpinner);

                // Hide loading state
                hideLoading();
            };

            // Set image attributes
            // Note: ghchart.rshah.org doesn't actually support year filtering
            // It always shows the current year's contributions
            // The timestamp parameter is just to prevent caching
            img.src = `https://ghchart.rshah.org/${color}/${username}?t=${new Date().getTime()}`;
            img.alt = `${username}'s GitHub Contributions`;
            img.className = 'w-full rounded-md shadow-sm';
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
        contactForm.addEventListener("submit", handleSubmit)
    }

    async function handleSubmit(event) {
        event.preventDefault();
        let name = this.querySelector('input[name="name"]').value;
        let email = this.querySelector('input[name="email"]').value;
        let message = this.querySelector('textarea[name="message"]').value;
        let subject = this.querySelector('input[name="subject"]').value;
        let _subject = this.querySelector('input[name="_subject"]').value;
        let subjectText = _subject + ' : ' + subject;

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        var status = document.getElementById("my-form-status");
        var data = new FormData(event.target);
        fetch(event.target.action, {
            method: contactForm.method,
            body: JSON.stringify({
                name : name,
                email : email,
                message : message,
                subject : subjectText
            }),
            headers: {
                'Accept': 'application/json'
            }
        }).then(async response => {
            if (response.ok) {
                status.innerHTML = "Thanks for your submission!";
                contactForm.reset();
                submitBtn.innerHTML = originalText;
            } else {
                try {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.innerHTML = "Oops! There was a problem submitting your form";
                    }
                } catch (e) {
                    status.innerHTML = "Oops! There was a problem submitting your form";
                }
            }
        }).catch(error => {
            status.innerHTML = "Oops! There was a problem submitting your form";
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
