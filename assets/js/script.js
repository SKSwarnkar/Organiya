// Organiya Website JavaScript
// Holiday filtering and testimonials functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page functionality
    console.log('Organiya website loaded');
    
    // Handle missing images
    initImageFallbacks();
    
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

let emailJsInitialized = false;

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


// Distributorship Form Validation
function initDistributorshipForm() {
    const form = document.getElementById('distributorshipForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = ['companyName', 'businessType', 'yearsInBusiness', 'businessAddress', 'country', 'contactName', 'contactTitle', 'email', 'phone'];
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#dc3545';
            } else {
                field.style.borderColor = '#ddd';
            }
        });
        
        // Check at least one product interest
        const productInterests = form.querySelectorAll('input[name="productInterest"]:checked');
        if (productInterests.length === 0) {
            alert('Please select at least one product of interest.');
            isValid = false;
        }
        
        // Check terms acceptance
        const terms = form.querySelector('input[name="terms"]');
        if (!terms || !terms.checked) {
            alert('Please accept the terms and conditions.');
            isValid = false;
        }
        
        // Email validation
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Initialize EmailJS if available (replace placeholder with your real public key)
        if (typeof emailjs !== 'undefined' && !emailJsInitialized) {
            emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your EmailJS Public Key
            emailJsInitialized = true;
        }
        
        // Disable submit button during processing
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        // Collect all form data
        const formData = {
            company_name: document.getElementById('companyName').value.trim(),
            business_type: document.getElementById('businessType').value,
            years_in_business: document.getElementById('yearsInBusiness').value,
            business_address: document.getElementById('businessAddress').value.trim(),
            country: document.getElementById('country').value.trim(),
            contact_name: document.getElementById('contactName').value.trim(),
            contact_title: document.getElementById('contactTitle').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            website: document.getElementById('website').value.trim() || 'N/A',
            tax_id: document.getElementById('taxId').value.trim() || 'N/A',
            product_interests: Array.from(form.querySelectorAll('input[name="productInterest"]:checked')).map(cb => cb.value).join(', '),
            estimated_volume: document.getElementById('estimatedVolume').value || 'Not specified',
            target_markets: document.getElementById('targetMarkets').value || 'Not specified',
            storage_capacity: document.getElementById('storageCapacity').value.trim() || 'Not specified',
            distribution_network: document.getElementById('distributionNetwork').value.trim() || 'Not specified',
            experience: document.getElementById('experience').value.trim() || 'Not specified',
            references: document.getElementById('references').value.trim() || 'None provided',
            additional_info: document.getElementById('additionalInfo').value.trim() || 'None'
        };
        
        // Format message for email
        const emailMessage = `
New Distributorship Application:

COMPANY INFORMATION:
Company Name: ${formData.company_name}
Business Type: ${formData.business_type}
Years in Business: ${formData.years_in_business}
Business Address: ${formData.business_address}
Country: ${formData.country}
Tax ID/EIN: ${formData.tax_id}
Website: ${formData.website}

CONTACT INFORMATION:
Contact Name: ${formData.contact_name}
Title: ${formData.contact_title}
Email: ${formData.email}
Phone: ${formData.phone}

PRODUCT INTERESTS:
${formData.product_interests}

BUSINESS DETAILS:
Estimated Monthly Volume: ${formData.estimated_volume}
Target Markets: ${formData.target_markets}

STORAGE & DISTRIBUTION:
Storage Capacity: ${formData.storage_capacity}

Distribution Network:
${formData.distribution_network}

EXPERIENCE:
${formData.experience}

REFERENCES:
${formData.references}

ADDITIONAL INFORMATION:
${formData.additional_info}
        `.trim();
        
        const templateParams = {
            from_name: formData.contact_name,
            from_email: formData.email,
            company_name: formData.company_name,
            message: emailMessage,
            to_email: 'info@organiyaglobal.com'
        };
        
        // Send email using EmailJS
        // Note: You may want to create a separate template for distributorship applications
        // Use the same Service ID, but you can use a different Template ID if desired
        if (typeof emailjs !== 'undefined') {
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                .then(function(response) {
                    console.log('Distributorship application sent successfully!', response.status, response.text);
                    alert('Thank you for your distributorship application! We have received your information and will review it. We will contact you within 5-7 business days.');
                    form.reset();
                })
                .catch(function(error) {
                    console.error('Error sending distributorship application:', error);
                    // Fallback: open mailto link
                    const mailtoSubject = encodeURIComponent('Distributorship Application from ' + formData.company_name);
                    alert('There was an error submitting the application. Opening your email client instead...');
                    window.location.href = 'mailto:info@organiyaglobal.com?subject=' + mailtoSubject + '&body=' + encodeURIComponent(emailMessage);
                })
                .finally(function() {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                });
        } else {
            // Fallback if EmailJS is not loaded
            const mailtoSubject = encodeURIComponent('Distributorship Application from ' + formData.company_name);
            window.location.href = 'mailto:info@organiyaglobal.com?subject=' + mailtoSubject + '&body=' + encodeURIComponent(emailMessage);
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
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
