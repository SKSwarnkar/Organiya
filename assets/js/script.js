// Organiya Website JavaScript
// Holiday filtering and testimonials functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page functionality
    console.log('Organiya website loaded');
    
    // Handle missing images
    initImageFallbacks();

    // Initialize mobile navigation toggle
    initMobileNav();
    
    // Initialize holiday specials if on homepage
    if (document.getElementById('holidaySpecials')) {
        initHolidaySpecials();
    }
    
    // Initialize testimonials filter if on testimonials page
    if (document.querySelector('.filter-btn')) {
        initTestimonialsFilter();
    }
    
    // Initialize distributorship form
    if (document.getElementById('distributorshipForm')) {
        initDistributorshipForm();
    }
});

// Mobile navigation
function initMobileNav() {
    const navs = Array.from(document.querySelectorAll('header nav'));
    if (navs.length === 0) return;

    navs.forEach(nav => {
        const toggle = nav.querySelector('.nav-toggle');
        const menuLinks = nav.querySelectorAll('ul a');

        if (!toggle) {
            return;
        }

        const closeMenu = () => {
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        };

        toggle.addEventListener('click', function() {
            const shouldOpen = !nav.classList.contains('open');
            if (shouldOpen) {
                nav.classList.add('open');
            } else {
                nav.classList.remove('open');
            }
            toggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navs.forEach(nav => nav.classList.remove('open'));
            navs.forEach(nav => {
                const toggle = nav.querySelector('.nav-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
}

// Image Fallback Handler
function initImageFallbacks() {
    // Handle missing images with placeholder backgrounds
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            // For product images, add a styled placeholder
            if (this.closest('.product-card')) {
                const alt = this.alt || 'Product Image';
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.style.cssText = `
                    width: 100%;
                    height: 220px;
                    background: linear-gradient(135deg, #1E854C 0%, #184A45 100%);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 18px;
                    text-align: center;
                    padding: 20px;
                `;
                placeholder.textContent = alt.replace(' Powder', '').replace(' Root ', ' ').replace(' Image', '');
                this.parentNode.insertBefore(placeholder, this);
            }
            
            // For logo, show text fallback
            if (this.closest('.logo')) {
                this.style.display = 'none';
                if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('logo-text-fallback')) {
                    const textFallback = document.createElement('span');
                    textFallback.className = 'logo-text-fallback';
                    textFallback.style.cssText = `
                        font-size: 24px;
                        font-weight: bold;
                        color: var(--green-dark);
                        text-decoration: none;
                    `;
                    textFallback.textContent = 'ORGANIYA GLOBAL';
                    this.parentNode.insertBefore(textFallback, this);
                }
            }
        });
    });
    
    // Check if hero background images exist
    document.querySelectorAll('.hero[style*="background-image"]').forEach(hero => {
        const bgImage = hero.style.backgroundImage;
        if (bgImage && bgImage.includes('url(')) {
            const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (urlMatch) {
                const imgUrl = urlMatch[1];
                const img = new Image();
                img.onerror = function() {
                    // Background image failed to load, ensure dark background
                    hero.style.backgroundImage = 'linear-gradient(135deg, #184A45 0%, #1E854C 100%)';
                };
                img.src = imgUrl;
            }
        }
    });
}

// Holiday Specials Functionality
function initHolidaySpecials() {
    const container = document.getElementById('holidaySpecials');
    if (!container) return;
    
    // Holiday data with dates and special offers
    const holidays = [
        {
            name: 'New Year',
            date: '2026-01-01',
            description: 'Start the year with wellness! Special bulk pricing on all superfoods.',
            discount: '10% off orders over 500kg'
        },
        {
            name: 'Valentine\'s Day',
            date: '2026-02-14',
            description: 'Gift wellness to loved ones. Special gift packages available.',
            discount: 'Wellness gift hampers'
        },
        {
            name: 'Holi',
            date: '2026-03-03',
            description: 'Celebrate with natural colors and superfoods. Bulk discounts available.',
            discount: '15% off bulk orders'
        },
        {
            name: 'Easter',
            date: '2026-03-29',
            description: 'Spring wellness special. Refresh with premium superfoods.',
            discount: 'Easter wellness packages'
        },
        {
            name: 'Mother\'s Day',
            date: '2026-05-10',
            description: 'Honor mothers with premium wellness. Special gift sets available.',
            discount: 'Mother\'s Day hampers'
        },
        {
            name: 'Diwali',
            date: '2026-10-18',
            description: 'Festival of lights, festival of health. Premium gift packages.',
            discount: 'Diwali special packages'
        },
        {
            name: 'Christmas',
            date: '2026-12-25',
            description: 'Holiday gifting season. Corporate and personal gift options.',
            discount: 'Holiday gift sets'
        },
        {
            name: 'Wedding Season',
            date: '2026-06-01',
            endDate: '2026-06-30',
            description: 'Perfect for wedding favors and gift hampers. Custom packaging available.',
            discount: 'Wedding special pricing'
        }
    ];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter holidays - show current and upcoming (within next 90 days)
    const relevantHolidays = holidays.filter(holiday => {
        const holidayDate = new Date(holiday.date);
        holidayDate.setHours(0, 0, 0, 0);
        
        const endDate = holiday.endDate ? new Date(holiday.endDate) : holidayDate;
        endDate.setHours(23, 59, 59, 999);
        
        // Show if holiday is today, in the future, or within past 7 days
        const daysDiff = (holidayDate - today) / (1000 * 60 * 60 * 24);
        const isUpcoming = daysDiff >= -7 && daysDiff <= 90;
        const isInRange = holiday.endDate && today >= holidayDate && today <= endDate;
        
        return isUpcoming || isInRange;
    });
    
    // Sort by date
    relevantHolidays.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Display up to 4 holidays
    const holidaysToShow = relevantHolidays.slice(0, 4);
    
    if (holidaysToShow.length === 0) {
        // Show general holiday special if no specific holidays
        container.innerHTML = `
            <div class="holiday-card">
                <h3>Year-Round Specials</h3>
                <p>Bulk order discounts and custom packaging available. Contact us for special pricing on large orders.</p>
                <div class="holiday-discount">Request Quote</div>
            </div>
        `;
        return;
    }
    
    // Create holiday cards
    holidaysToShow.forEach(holiday => {
        const holidayDate = new Date(holiday.date);
        const formattedDate = holidayDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        });
        
        const card = document.createElement('div');
        card.className = 'holiday-card';
        card.innerHTML = `
            <h3>${holiday.name}</h3>
            <div class="holiday-date">${formattedDate}</div>
            <p>${holiday.description}</p>
            <div class="holiday-discount">${holiday.discount}</div>
        `;
        
        container.appendChild(card);
    });
}

// Testimonials Filter Functionality
function initTestimonialsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter testimonials
            testimonialCards.forEach(card => {
                if (filter === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const category = card.getAttribute('data-category');
                    if (category === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
