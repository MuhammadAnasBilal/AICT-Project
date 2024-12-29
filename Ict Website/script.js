//new setting

class CollectionManager {
    constructor() {
        this.initAOS();
        this.initCarousels();
        this.initCardEffects();
    }

    initAOS() {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    initCarousels() {
        const carousels = ['#shirtsCarousel', '#pantsCarousel', '#shoesCarousel'];
        
        carousels.forEach(carouselId => {
            new bootstrap.Carousel(document.querySelector(carouselId), {
                interval: 5000,
                ride: 'carousel'
            });
        });
    }

    initCardEffects() {
        const cards = document.querySelectorAll('.collection-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCard(card);
            });

            const addToCartBtn = card.querySelector('.add-to-cart');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleAddToCart(card);
                });
            }
        });
    }

    animateCard(card) {
        const img = card.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1.1)';
        }
    }

    handleAddToCart(card) {
        const btn = card.querySelector('.add-to-cart');
        btn.classList.add('clicked');
        
        // Animate button
        btn.innerHTML = '✓ Added';
        btn.style.backgroundColor = '#2ecc71';
        
        setTimeout(() => {
            btn.innerHTML = 'Add to Cart';
            btn.style.backgroundColor = '';
            btn.classList.remove('clicked');
        }, 2000);

        // Update cart count (if implemented)
        this.updateCartCount();
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + 1;
            cartCount.classList.add('bounce');
            setTimeout(() => cartCount.classList.remove('bounce'), 300);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CollectionManager();
});





// Main marketplace class
class FashionMarketplace {
    constructor() {
        this.cartCount = 0;
        this.cartCountElement = document.getElementById('cartCount');
        this.init();
    }

    init() {
        this.initAOS();
        this.initCarousels();
        this.initEventListeners();
        this.initScrollEffects();
    }

    initAOS() {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            disable: 'mobile'
        });
    }

   // Replace the initCarousels method in your FashionMarketplace class
initCarousels() {
    // Hero Carousel initialization
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel) {
        new bootstrap.Carousel(heroCarousel, {
            interval: 5000
        });
    }

    // Product carousels initialization
    const productCarousels = ['#shirtsCarousel', '#pantsCarousel', '#shoesCarousel'];
    productCarousels.forEach(carouselId => {
        const carousel = document.querySelector(carouselId);
        if (carousel) {
            new bootstrap.Carousel(carousel, {
                interval: 3000,
                ride: 'carousel'
            });
        }
    });
}

    initEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => this.handleAddToCart(e));
        });

        // Search form
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }

        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initScrollEffects() {
        // Featured products parallax effect
        const featuredSection = document.getElementById('featured-products');
        if (featuredSection) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.3;
                featuredSection.style.backgroundPositionY = `${rate}px`;
            });
        }

        // Section title animations
        const sectionTitles = document.querySelectorAll('.section-large-text');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        sectionTitles.forEach(title => {
            title.style.opacity = '0';
            title.style.transform = 'translateY(30px)';
            observer.observe(title);
        });
    }

    handleAddToCart(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const productCard = button.closest('.product-card, .featured-product-card, .collection-card');
        
        if (productCard) {
            const productName = productCard.querySelector('h3, h5')?.textContent || 'Product';
            this.cartCount++;
            this.updateCartDisplay();
            this.showCartNotification(productName);
        }
    }

    updateCartDisplay() {
        if (this.cartCountElement) {
            this.cartCountElement.textContent = this.cartCount;
            this.cartCountElement.classList.remove('animate__bounce');
            void this.cartCountElement.offsetWidth; // Trigger reflow
            this.cartCountElement.classList.add('animate__bounce');
        }
    }

    showCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-shopping-cart"></i>
                <span>${productName} added to cart</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.add('hide');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        });
    }

    handleSearch(event) {
        event.preventDefault();
        const searchInput = event.target.querySelector('input[type="search"]');
        const searchTerm = searchInput?.value.trim();

        if (searchTerm) {
            this.performSearch(searchTerm);
        }
    }

    performSearch(searchTerm) {
        const productCards = document.querySelectorAll('.product-card, .featured-product-card, .collection-card');
        let matchCount = 0;

        productCards.forEach(card => {
            const title = card.querySelector('h3, h5')?.textContent.toLowerCase() || '';
            const matches = title.includes(searchTerm.toLowerCase());
            
            if (matches) {
                matchCount++;
                card.classList.add('search-match');
                setTimeout(() => card.classList.remove('search-match'), 1000);
            }
            card.style.display = matches ? '' : 'none';
        });

        this.showSearchNotification(matchCount, searchTerm);
    }

    showSearchNotification(matchCount, searchTerm) {
        const notification = document.createElement('div');
        notification.className = 'search-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-search"></i>
                <span>Found ${matchCount} product(s) matching "${searchTerm}"</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.add('hide');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const marketplace = new FashionMarketplace();
});