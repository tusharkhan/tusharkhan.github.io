// Modern Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const footerYear = document.getElementById('currentYear');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
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

    // GitHub Contribution Graph (data: github-contributions-api.jogruber.de)
    const contributionYearSelect = document.getElementById('contributionYear');
    const githubContributionGraph = document.getElementById('githubContributionGraph');
    const contributionSummary = document.getElementById('contributionSummary');

    if (contributionYearSelect && githubContributionGraph) {
        const username = 'tusharkhan';
        const levelColors = [
            'rgba(255, 255, 255, 0.06)',
            'rgba(99, 102, 241, 0.35)',
            'rgba(99, 102, 241, 0.55)',
            'rgba(99, 102, 241, 0.8)',
            '#6366F1'
        ];
        let contributions = [];

        // Local YYYY-MM-DD (toISOString would shift the date in non-UTC timezones)
        function toDateString(date) {
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${date.getFullYear()}-${month}-${day}`;
        }

        function renderContributionGraph(period) {
            const today = new Date();
            const todayString = toDateString(today);
            let days;

            if (period === 'last') {
                const start = new Date(today);
                start.setFullYear(start.getFullYear() - 1);
                const startString = toDateString(start);
                days = contributions.filter(day => day.date > startString && day.date <= todayString);
            } else {
                days = contributions.filter(day => day.date.startsWith(period) && day.date <= todayString);
            }

            githubContributionGraph.innerHTML = '';
            if (days.length === 0) return;

            // Pad the first week so each row is a weekday (Sun-Sat), like GitHub
            const firstWeekday = new Date(`${days[0].date}T00:00:00`).getDay();
            const columns = `repeat(${Math.ceil((firstWeekday + days.length) / 7)}, minmax(7px, 1fr))`;

            const months = document.createElement('div');
            months.className = 'contribution-months';
            months.style.gridTemplateColumns = columns;

            const grid = document.createElement('div');
            grid.className = 'contribution-grid';
            grid.style.gridTemplateColumns = columns;
            grid.setAttribute('role', 'img');

            for (let i = 0; i < firstWeekday; i++) {
                grid.appendChild(document.createElement('span'));
            }

            let total = 0;
            days.forEach((day, index) => {
                total += day.count;

                const cell = document.createElement('span');
                cell.style.background = levelColors[day.level];
                cell.title = `${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`;
                grid.appendChild(cell);

                if (day.date.endsWith('-01')) {
                    const label = document.createElement('span');
                    label.textContent = new Date(`${day.date}T00:00:00`).toLocaleString('en', { month: 'short' });
                    label.style.gridColumnStart = Math.floor((firstWeekday + index) / 7) + 1;
                    months.appendChild(label);
                }
            });

            const periodText = period === 'last' ? 'in the last 12 months' : `in ${period}`;
            const summaryText = `${total.toLocaleString()} contributions ${periodText}`;
            grid.setAttribute('aria-label', summaryText);

            githubContributionGraph.append(months, grid);
            // On narrow screens, start scrolled to the most recent weeks
            githubContributionGraph.scrollLeft = githubContributionGraph.scrollWidth;
            if (contributionSummary) {
                contributionSummary.textContent = summaryText;
            }
        }

        githubContributionGraph.style.opacity = '0.5';

        fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=all`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                // The API lists years newest first; sort days oldest first
                contributions = data.contributions.sort((a, b) => a.date.localeCompare(b.date));

                Object.keys(data.total)
                    .sort((a, b) => b - a)
                    .forEach(year => {
                        const option = document.createElement('option');
                        option.value = year;
                        option.textContent = year;
                        contributionYearSelect.appendChild(option);
                    });

                renderContributionGraph(contributionYearSelect.value);
                contributionYearSelect.addEventListener('change', function() {
                    renderContributionGraph(this.value);
                });
            })
            .catch(() => {
                githubContributionGraph.innerHTML = `
                    <div class="text-center p-4 bg-red-500/10 text-red-400 rounded-lg text-sm">
                        Failed to load contributions. Please try again later.
                    </div>
                `;
            })
            .finally(() => {
                githubContributionGraph.style.opacity = '1';
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
    const floatingElements = document.querySelectorAll('[data-parallax]');
    if (floatingElements.length > 0) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            floatingElements.forEach((el, index) => {
                const speed = 0.1 + (index * 0.05);
                // Use `translate` so the CSS float animation's `transform` keeps running
                el.style.translate = `0 ${scrolled * speed}px`;
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
