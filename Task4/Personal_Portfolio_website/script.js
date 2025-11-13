// Projects Data
        const projects = [
            { 
                title: "Portfolio Website", 
                description: "A fully responsive personal portfolio showcasing my skills and projects with modern design.", 
                tech: "HTML, CSS, JavaScript", 
                link: "#" 
            },
            { 
                title: "To-Do App", 
                description: "Task management application with LocalStorage persistence and intuitive UI.", 
                tech: "HTML, CSS, JavaScript", 
                link: "#" 
            },
            { 
                title: "Online Survey Form", 
                description: "A user-friendly online survey form with real-time response tracking.", 
                tech: "HTML, CSS, JavaScript", 
                link: "#" 
            },
        ];

        // Load Projects Dynamically
        function loadProjects() {
            const projectsGrid = document.getElementById('projectsGrid');
            projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <p class="tech-stack">Tech Stack: ${project.tech}</p>
                    <a href="${project.link}" class="view-more" target="_blank">View More</a>
                `;
                projectsGrid.appendChild(card);
            });
        }

        // Theme Toggle
        function toggleTheme() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        }

        // Load Saved Theme
        function loadTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        // Mobile Menu Toggle
        function toggleMenu() {
            const navLinks = document.getElementById('navLinks');
            navLinks.classList.toggle('active');
        }

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                document.getElementById('navLinks').classList.remove('active');
            });
        });

        // Typing Animation
        function typeWriter() {
            const text = "A Web Developer";
            const element = document.getElementById('typingText');
            let i = 0;
            
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 100);
                }
            }
            
            setTimeout(type, 1000);
        }

        // Scroll Animations
        function handleScrollAnimations() {
            const elements = document.querySelectorAll('.about-content, .projects-grid, .contact-content');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, { threshold: 0.1 });
            
            elements.forEach(element => observer.observe(element));
        }

        // Scroll to Top Button
        function handleScrollTop() {
            const scrollTop = document.getElementById('scrollTop');
            
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollTop.classList.add('show');
                } else {
                    scrollTop.classList.remove('show');
                }
            });
        }

        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Form Validation
        function validateForm(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
            
            // Validate name
            if (name === '' || name.length < 2) {
                document.getElementById('nameError').style.display = 'block';
                isValid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            }
            
            // Validate message
            if (message === '' || message.length < 10) {
                document.getElementById('messageError').textContent = 'Message must be at least 10 characters';
                document.getElementById('messageError').style.display = 'block';
                isValid = false;
            }
            
            if (isValid) {
                // Show success message
                document.getElementById('successMessage').style.display = 'block';
                document.getElementById('contactForm').reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    document.getElementById('successMessage').style.display = 'none';
                }, 5000);
            }
        }

        // Initialize Everything
        document.addEventListener('DOMContentLoaded', () => {
            loadTheme();
            loadProjects();
            typeWriter();
            handleScrollAnimations();
            handleScrollTop();
            
            // Add form submit listener
            document.getElementById('contactForm').addEventListener('submit', validateForm);
        });