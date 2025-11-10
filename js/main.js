// Modern Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('footer p');
    if (footerYear && footerYear.textContent.includes('2024')) {
        footerYear.textContent = footerYear.textContent.replace('2024', currentYear);
    }

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scrolling for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // GitHub Contribution Graph Year Filter
    const contributionYearSelect = document.getElementById('contributionYear');
    const githubContributionGraph = document.getElementById('githubContributionGraph');

    if (contributionYearSelect && githubContributionGraph) {
        // Populate the year dropdown with the last 8 years
        const startYear = 2017;
        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            contributionYearSelect.appendChild(option);
        }

        // Function to update the contribution graph
        function updateContributionGraph(year) {
            const username = 'tusharkhan';
            const color = '6366F1'; // Primary color
            
            // Add loading state
            githubContributionGraph.style.opacity = '0.5';
            
            // Create a new image element
            const img = new Image();
            
            img.onload = function() {
                githubContributionGraph.innerHTML = '';
                img.className = 'w-full rounded-lg opacity-80';
                img.alt = `${username}'s GitHub Contributions`;
                githubContributionGraph.appendChild(img);
                githubContributionGraph.style.opacity = '1';
            };

            img.onerror = function() {
                githubContributionGraph.innerHTML = `
                    <div class="text-center p-4 bg-red-500/10 text-red-400 rounded-lg text-sm">
                        Failed to load contributions. Please try again later.
                    </div>
                `;
                githubContributionGraph.style.opacity = '1';
            };

            // Add timestamp to prevent caching
            img.src = `https://ghchart.rshah.org/${color}/${username}?t=${new Date().getTime()}`;
        }

        // Set initial graph to current year
        updateContributionGraph(currentYear);

        // Handle year selection change
        contributionYearSelect.addEventListener('change', function() {
            updateContributionGraph(this.value);
        });
    }

    // Form submission handling with Formspree
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener("submit", handleSubmit);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        
        const name = this.querySelector('input[name="name"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const message = this.querySelector('textarea[name="message"]').value;
        const subject = this.querySelector('input[name="subject"]').value;
        const _subject = this.querySelector('input[name="_subject"]').value;
        const subjectText = _subject + ' : ' + subject;

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        submitBtn.disabled = true;

        const status = document.getElementById("my-form-status");
        
        try {
            const response = await fetch(event.target.action, {
                method: contactForm.method,
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    subject: subjectText
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                status.innerHTML = '<div class="text-green-400">✓ Thanks for your message! I\'ll get back to you soon.</div>';
                contactForm.reset();
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = `<div class="text-red-400">✗ ${data["errors"].map(error => error["message"]).join(", ")}</div>`;
                } else {
                    status.innerHTML = '<div class="text-red-400">✗ Oops! There was a problem submitting your form.</div>';
                }
            }
        } catch (error) {
            status.innerHTML = '<div class="text-red-400">✗ Oops! There was a problem submitting your form.</div>';
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // Add scroll-based header shadow
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // Parallax effect for background elements
    const floatingElements = document.querySelectorAll('.animate-float');
    if (floatingElements.length > 0) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            floatingElements.forEach((el, index) => {
                const speed = 0.1 + (index * 0.05);
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Add active state to navigation based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function setActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.style.color = 'var(--primary)';
                    } else {
                        link.style.color = '';
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNav);
    setActiveNav(); // Call once on load
});
