document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        }
    });

    // 2. Smooth Scroll & Active Link Highlighting
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 3. Back to Top Button
    const backToTopBtn = document.getElementById('btn-back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    const animationDuration = 2000; // 2 seconds

    const runCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const startTime = performance.now();
        const startValue = 0;

        // Easing function for smoother slowdown
        const easeOutQuad = t => t * (2 - t);

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            let progress = elapsedTime / animationDuration;

            if (progress > 1) progress = 1;

            const currentVal = Math.floor(startValue + (target - startValue) * easeOutQuad(progress));
            counter.innerText = currentVal;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counter.innerText = target;
            }
        };
        requestAnimationFrame(animate);
    };

    // Use Intersection Observer logic to trigger when scrolled into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% of element is visible
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                // Unobserve after running so it only happens once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 5. Success Stories Infinite Marquee (Desktop)
    const storiesCategories = document.querySelectorAll('.stories-category');
    storiesCategories.forEach((category, index) => {
        const grid = category.querySelector('.reviews-grid');
        if (!grid) return;

        // 4th and 5th are mobile-only marquee.
        const isMobileOnly = index >= 3;

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = isMobileOnly ? 'marquee-container mobile-only-marquee' : 'marquee-container';
        grid.parentNode.insertBefore(wrapper, grid);
        wrapper.appendChild(grid);

        grid.classList.add('marquee-track');
        if (isMobileOnly) grid.classList.add('mobile-only-track');

        // Clone children for infinite loop
        const cards = Array.from(grid.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            if (isMobileOnly) clone.classList.add('hide-on-desktop');
            grid.appendChild(clone);
        });
    });

    // 6. KakaoTalk 문의 — 클립보드 복사 + 모달
    const btnKakao = document.getElementById('btn-kakao');
    const kakaoModal = document.getElementById('kakao-modal');
    const kakaoModalConfirm = document.getElementById('kakao-modal-confirm');
    const KAKAO_URL = 'https://open.kakao.com/o/so58F7ji';

    if (btnKakao && kakaoModal && kakaoModalConfirm) {
        btnKakao.addEventListener('click', () => {
            const name = document.getElementById('form-name').value.trim() || '(미입력)';
            const service = document.getElementById('form-service').value || '(미선택)';
            const school = document.getElementById('form-school').value.trim() || '(미입력)';
            const inquiry = document.getElementById('form-inquiry').value.trim() || '(미입력)';

            const text =
                `[김상현 학술 컨설팅 문의]\n` +
                `━━━━━━━━━━━━━━━━\n` +
                `이름: ${name}\n` +
                `서비스 유형: ${service}\n` +
                `지원 학교 / 전공: ${school}\n` +
                `문의 내용: ${inquiry}\n` +
                `━━━━━━━━━━━━━━━━`;

            // 모달 먼저 표시 (클립보드 결과와 무관하게 항상 실행)
            kakaoModal.style.display = 'flex';

            // 클립보드 복사 시도
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).catch(() => {});
            } else {
                const el = document.createElement('textarea');
                el.value = text;
                el.style.position = 'fixed';
                el.style.opacity = '0';
                document.body.appendChild(el);
                el.focus();
                el.select();
                try { document.execCommand('copy'); } catch (e) {}
                document.body.removeChild(el);
            }
        });

        kakaoModalConfirm.addEventListener('click', () => {
            kakaoModal.style.display = 'none';
            window.open(KAKAO_URL, '_blank');
        });

        kakaoModal.addEventListener('click', (e) => {
            if (e.target === kakaoModal) {
                kakaoModal.style.display = 'none';
            }
        });
    }

    // 7. Pricing Calculator
    const priceCheckboxes = document.querySelectorAll('.price-checkbox');
    const totalPriceElement = document.getElementById('total-price');

    function calculateTotal() {
        let total = 0;
        priceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total += parseInt(checkbox.value, 10);
            }
        });
        totalPriceElement.textContent = total.toLocaleString('ko-KR');
    }

    priceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotal);
    });

});
