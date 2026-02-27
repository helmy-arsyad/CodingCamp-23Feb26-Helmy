document.addEventListener('DOMContentLoaded', function () {

    // ===== HEADER SCROLL EFFECT =====
    // Support both .fixed-header (index) and .navbar (portfolio)
    const header = document.querySelector('.fixed-header, .navbar');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ===== MOBILE MENU TOGGLE =====
    // Support both .menu-toggle (index) and .hamburger (portfolio)
    const menuToggle = document.querySelector('.menu-toggle, .hamburger');
    const nav = document.querySelector('nav, .nav-menu');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===== CURRENT TIME DISPLAY =====
    function updateTime() {
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            const now = new Date();
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            const formattedTime = now.toLocaleString('id-ID', options);
            timeElement.textContent = formattedTime;
        }
    }

    updateTime();
    setInterval(updateTime, 1000);

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Animate .fade-in elements (portfolio)
    document.querySelectorAll('.fade-in').forEach(el => {
        animateOnScroll.observe(el);
    });

    // Animate .scroll-animate elements (index)
    document.querySelectorAll('.scroll-animate').forEach(el => {
        animateOnScroll.observe(el);
    });

    // ===== PARALLAX EFFECT FOR HERO =====
    // Support both .hero-gradient (index) and .hero::before (portfolio)
    const heroElement = document.querySelector('.hero');

    if (heroElement) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroElement.style.transform = `translateY(${rate}px)`;
        });
    }

    // ===== FADE-IN ANIMATION ON LOAD =====
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.classList.add('visible');
    });

    // ===== NAME LOCK SYSTEM =====
    const visitorNameSpan = document.getElementById('visitor-name');
    const nameToast = document.getElementById('name-toast');
    const toastInput = document.getElementById('toast-name-input');
    const toastBtn = document.getElementById('toast-name-btn');
    const siteBlocker = document.getElementById('site-blocker');

    if (visitorNameSpan && nameToast && siteBlocker) {

        const savedName = localStorage.getItem('visitorName');

        if (savedName) {
            visitorNameSpan.textContent = savedName;
        } else {

            siteBlocker.classList.add('active');
            nameToast.classList.add('show');
            document.body.style.overflow = 'hidden';
            toastInput.focus();

            function saveName() {
                const name = toastInput.value.trim();
                if (!name) {
                    alert("Nama tidak boleh kosong!");
                    return;
                }

                localStorage.setItem('visitorName', name);
                visitorNameSpan.textContent = name;

                siteBlocker.classList.remove('active');
                nameToast.classList.remove('show');
                document.body.style.overflow = '';
            }

            toastBtn.addEventListener('click', saveName);
            toastInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') saveName();
            });
        }
    }

    // ===== FORM SUBMISSION HANDLING =====
    const contactForm = document.querySelector('.contact-form');

    // Array to store messages
    let messages = [];

    // Load messages from localStorage on page load
    function loadMessagesFromStorage() {
        const storedMessages = localStorage.getItem('messages');
        if (storedMessages) {
            messages = JSON.parse(storedMessages);
        }
    }

    // Save messages to localStorage
    function saveMessagesToStorage() {
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    // Delete message by index
    window.deleteMessage = function (index) {
        if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
            messages.splice(index, 1);
            saveMessagesToStorage();
            updateMessagesDisplay();
        }
    };

    // Clear all messages
    window.clearAllMessages = function () {
        if (confirm('Apakah Anda yakin ingin menghapus SEMUA pesan?')) {
            messages = [];
            saveMessagesToStorage();
            updateMessagesDisplay();
        }
    };

    // Load messages when page loads
    loadMessagesFromStorage();

    // ===== UPDATE MESSAGES DISPLAY FUNCTION =====
    window.updateMessagesDisplay = function () {
        const messagesContainer = document.getElementById('messages-container');
        if (!messagesContainer) return;

        // Clear existing messages
        messagesContainer.innerHTML = '';

        if (messages.length === 0) {
            messagesContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">Belum ada pesan masuk</p>';
            return;
        }

        // Render all messages
        messages.forEach((msg, index) => {
            const messageEntry = document.createElement('div');
            messageEntry.className = 'message-entry';
            messageEntry.style.animationDelay = `${index * 0.1}s`;

            messageEntry.innerHTML = `
                <div class="message-header">
                    <span class="message-name">${msg.name}</span>
                    <div class="message-actions">
                        <span class="message-time">${msg.time}</span>
                        <button class="delete-btn" onclick="deleteMessage(${index})" title="Hapus pesan">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="message-details">
                    <div class="profile-item">
                        <span class="profile-label">Tanggal Lahir</span>
                        <span class="profile-value">${msg.birthdate}</span>
                    </div>
                    <div class="profile-item">
                        <span class="profile-label">Jenis Kelamin</span>
                        <span class="profile-value">${msg.gender}</span>
                    </div>
                    <div class="profile-item">
                        <span class="profile-label">Pesan</span>
                        <span class="profile-value">${msg.message}</span>
                    </div>
                </div>
            `;

            messagesContainer.appendChild(messageEntry);
        });

        // Update time display with latest message time
        const timeElement = document.getElementById('current-time');
        if (timeElement && messages.length > 0) {
            timeElement.textContent = messages[0].time;
        }
    };

    // Display messages on page load
    updateMessagesDisplay();

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameInput = this.querySelector('#name');
            const birthdateInput = this.querySelector('#birthdate');
            const genderInputs = this.querySelectorAll('input[name="gender"]');
            const messageInput = this.querySelector('#message');

            const name = nameInput.value.trim();
            const birthdate = birthdateInput.value;
            const messageText = messageInput.value.trim();

            let gender = '';
            genderInputs.forEach(input => {
                if (input.checked) {
                    gender = input.value;
                }
            });

            // ===== VALIDATION =====
            if (!name) {
                alert("Nama wajib diisi!");
                nameInput.focus();
                return;
            }

            if (!birthdate) {
                alert("Tanggal lahir wajib diisi!");
                birthdateInput.focus();
                return;
            }

            if (!gender) {
                alert("Silakan pilih jenis kelamin!");
                return;
            }

            if (!messageText) {
                alert("Pesan tidak boleh kosong!");
                messageInput.focus();
                return;
            }

            // ===== IF VALID → CONTINUE =====

            const genderText = gender === 'male' ? 'Laki-laki' : 'Perempuan';

            const messageData = {
                name: name,
                birthdate: birthdate,
                gender: genderText,
                message: messageText,
                time: new Date().toLocaleString('id-ID', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                })
            };

            messages.unshift(messageData);
            saveMessagesToStorage();
            updateMessagesDisplay();

            this.reset();

            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Terkirim!';
                submitBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 2000);
            }
        });
    }

    // ===== HOVER EFFECTS FOR CARDS =====
    const cards = document.querySelectorAll('.hobby-card, .stat-card, .skill-card, .certificate-card, .card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ===== PORTFOLIO SPECIFIC FUNCTIONS =====

    // Scroll to contact
    window.scrollToContact = function () {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Scroll to projects
    window.scrollToProjects = function () {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Certificate Modal Functions
    window.openCertificateModal = function (certId) {
        const modal = document.getElementById('certificateModal');
        if (!modal) return;

        // Certificate data object
        const certificateData = {
            'sertifikat1': {
                image: 'https://i.ibb.co.com/DHMWXm69/sertif-aksademy-17-2-26-page-0001.jpg',
                title: 'Sertifikat Belajar Dasar Pemrograman dengan Python',
                issuer: 'Aksademy',
                date: '2026'
            },
            'sertifikat2': {
                image: 'https://via.placeholder.com/400x300?text=Sertifikat+2',
                title: 'Sertifikat Pelatihan',
                issuer: 'Penyelenggara',
                date: '2024'
            },
            'sertifikat3': {
                image: 'https://via.placeholder.com/400x300?text=Sertifikat+3',
                title: 'Sertifikat Lomba',
                issuer: 'Penyelenggara',
                date: '2024'
            }
        };

        // Get certificate data based on ID
        const certData = certificateData[certId];

        if (certData) {
            // Update modal content
            const modalImg = document.getElementById('certificateModalImg');
            const modalTitle = document.getElementById('certificateModalTitle');
            const modalIssuer = document.getElementById('certificateModalIssuer');
            const modalDate = document.getElementById('certificateModalDate');

            if (modalImg) modalImg.src = certData.image;
            if (modalTitle) modalTitle.textContent = certData.title;
            if (modalIssuer) modalIssuer.innerHTML = '<i class="fas fa-building"></i> ' + certData.issuer;
            if (modalDate) modalDate.innerHTML = '<i class="fas fa-calendar-alt"></i> ' + certData.date;
        }

        // Show modal
        modal.classList.add('active');
    };

    window.closeCertificateModal = function () {
        const modal = document.getElementById('certificateModal');
        if (modal) {
            modal.classList.remove('active');
        }
    };

    // Close modal when clicking overlay
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.parentElement;
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close modal with escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });

    // ===== PROJECT MODAL FUNCTIONALITY =====

    // Project data object
    const projectData = {
        'quartrix': {
            title: 'QUARTRIX',
            description: 'Platform digital interaktif untuk siswa SMA Negeri 3 Blitar kelas 11-4. Memudahkan komunikasi dan berbagi informasi antar siswa dalam satu kelas.',
            features: [
                'Sistem berbagi file dan dokumen',
                'Pengumuman kelas real-time',
                'Sistem voting dan polling',
                'Chat antar siswa',
                'Kalender acara kelas'
            ],
            tags: ['HTML5', 'CSS3', 'JavaScript', 'Firebase RTDB', 'LocalStorage'],
            icon: 'fa-school',
            demoUrl: 'https://quartrix.xyz',
            githubUrl: 'https://github.com/helmy-arsyad/quartrix'
        },
        'portfolio': {
            title: 'Portofolio Pribadi',
            description: 'Website portofolio pribadi yang menampilkan profil, hobi, proyek, sertifikat, dan formulir kontak dengan desain modern dan animasi interaktif.',
            features: [
                'Hero section dengan partikel animasi',
                'Section hobi dengan kartu tilt interaktif',
                'Section proyek dengan modal detail',
                'Section sertifikat dengan modal',
                'Formulir kontak dengan penyimpanan lokal',
                'Animasi scroll dan hover halus',
                'Desain responsif penuh',
                'Header fixed dengan efek scroll',
                'Footer dengan link sosial'
            ],
            tags: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage'],
            icon: 'fa-user',
            demoUrl: 'https://helmy-arsyad.github.io/CodingCamp-23Feb26-Helmy/',
            githubUrl: 'github.com/helmy-arsyad/CodingCamp-23Feb26-Helmy'
        }
    };

    // Add click event to view details buttons
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');

    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.card');
            if (card) {
                const projectId = card.dataset.project;
                const project = projectData[projectId];

                if (project) {
                    openProjectModal(projectId, project);
                }
            }
        });
    });

    // Open project modal function
    window.openProjectModal = function (projectId, project) {
        const modal = document.getElementById('projectModal');
        if (!modal) return;

        // Update modal content
        const modalIcon = modal.querySelector('.modal-icon');
        const modalTitle = modal.querySelector('.modal-title');
        const modalDescription = modal.querySelector('.modal-description p');
        const modalFeatures = modal.querySelector('.modal-features ul');
        const modalTags = modal.querySelector('.modal-tags');
        const demoBtn = modal.querySelector('.demo-btn');
        const githubBtn = modal.querySelector('.github-btn');

        // Update icon
        if (modalIcon) {
            modalIcon.innerHTML = `<i class="fas ${project.icon}"></i>`;
        }

        // Update title
        if (modalTitle) {
            modalTitle.textContent = project.title;
        }

        // Update description
        if (modalDescription) {
            modalDescription.textContent = project.description;
        }

        // Update features
        if (modalFeatures) {
            modalFeatures.innerHTML = project.features.map(feature =>
                `<li><i class="fas fa-check"></i> ${feature}</li>`
            ).join('');
        }

        // Update tags
        if (modalTags) {
            modalTags.innerHTML = project.tags.map(tag =>
                `<span class="tag">${tag}</span>`
            ).join('');
        }

        // Update buttons
        if (demoBtn) demoBtn.href = project.demoUrl;
        if (githubBtn) githubBtn.href = project.githubUrl;

        // Show modal
        modal.classList.add('active');
    };

    // Close project modal
    const projectModal = document.getElementById('projectModal');
    if (projectModal) {
        const closeBtn = projectModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                projectModal.classList.remove('active');
            });
        }
    }
});
