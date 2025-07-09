// King Burger - Algolia Search Implementation

// Product data - In a real application, this would come from your backend
const products = [
    {
        id: 1,
        name: "Classic King",
        description: "Hambúrguer clássico com queijo, alface, tomate e molho especial",
        price: 25.90,
        category: "classic",
        image: "assets/images/burguer.png",
        tags: ["clássico", "queijo", "alface", "tomate", "molho especial"],
        ingredients: ["pão", "carne", "queijo", "alface", "tomate", "molho especial"],
        spicy: false,
        vegetarian: false,
        popular: true
    },
    {
        id: 2,
        name: "Bacon King",
        description: "Hambúrguer com bacon crocante, queijo cheddar e molho barbecue",
        price: 32.90,
        category: "premium",
        image: "assets/images/burguer.png",
        tags: ["bacon", "cheddar", "barbecue", "crocante"],
        ingredients: ["pão", "carne", "bacon", "queijo cheddar", "molho barbecue"],
        spicy: false,
        vegetarian: false,
        popular: false
    },
    {
        id: 3,
        name: "Veggie King",
        description: "Hambúrguer vegetariano com grão-de-bico, quinoa e vegetais frescos",
        price: 28.90,
        category: "vegetarian",
        image: "assets/images/burguer.png",
        tags: ["vegetariano", "grão-de-bico", "quinoa", "vegetais"],
        ingredients: ["pão", "grão-de-bico", "quinoa", "vegetais frescos"],
        spicy: false,
        vegetarian: true,
        popular: false
    },
    {
        id: 4,
        name: "Spicy King",
        description: "Hambúrguer picante com pimenta jalapeño, queijo pepper jack e molho picante",
        price: 29.90,
        category: "spicy",
        image: "assets/images/burguer.png",
        tags: ["picante", "jalapeño", "pepper jack", "molho picante"],
        ingredients: ["pão", "carne", "jalapeño", "queijo pepper jack", "molho picante"],
        spicy: true,
        vegetarian: false,
        popular: false
    },
    {
        id: 5,
        name: "Double King",
        description: "Hambúrguer duplo com duas carnes, queijo duplo e molho especial",
        price: 35.90,
        category: "premium",
        image: "assets/images/burguer.png",
        tags: ["duplo", "duas carnes", "queijo duplo"],
        ingredients: ["pão", "carne", "carne", "queijo", "queijo", "molho especial"],
        spicy: false,
        vegetarian: false,
        popular: true
    },
    {
        id: 6,
        name: "Mushroom King",
        description: "Hambúrguer com cogumelos grelhados, queijo suíço e molho de cogumelos",
        price: 27.90,
        category: "vegetarian",
        image: "assets/images/burguer.png",
        tags: ["cogumelos", "queijo suíço", "vegetariano"],
        ingredients: ["pão", "cogumelos", "queijo suíço", "molho de cogumelos"],
        spicy: false,
        vegetarian: true,
        popular: false
    },
    {
        id: 7,
        name: "BBQ King",
        description: "Hambúrguer com molho barbecue, cebola caramelizada e queijo gouda",
        price: 31.90,
        category: "premium",
        image: "assets/images/burguer.png",
        tags: ["barbecue", "cebola caramelizada", "gouda"],
        ingredients: ["pão", "carne", "molho barbecue", "cebola caramelizada", "queijo gouda"],
        spicy: false,
        vegetarian: false,
        popular: false
    },
    {
        id: 8,
        name: "Hot King",
        description: "Hambúrguer super picante com habanero, queijo picante e molho infernal",
        price: 33.90,
        category: "spicy",
        image: "assets/images/burguer.png",
        tags: ["super picante", "habanero", "molho infernal"],
        ingredients: ["pão", "carne", "habanero", "queijo picante", "molho infernal"],
        spicy: true,
        vegetarian: false,
        popular: false
    }
];

// Initialize Algolia Search
class AlgoliaSearch {
    constructor() {
        // For demo purposes, we'll use a local search implementation
        // In production, you would use actual Algolia credentials
        this.products = products;
        this.searchInput = document.getElementById('searchInput');
        this.categorySelect = document.getElementById('categorySelect');
        this.resultsGrid = document.getElementById('resultsGrid');
        this.resultsCount = document.getElementById('resultsCount');
        this.noResults = document.getElementById('noResults');
        this.clearSearch = document.getElementById('clearSearch');
        this.searchResults = document.getElementById('searchResults');
        
        this.currentQuery = '';
        this.currentCategory = '';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.hideResults();
    }
    
    bindEvents() {
        // Search input event
        this.searchInput.addEventListener('input', (e) => {
            this.currentQuery = e.target.value.trim();
            this.performSearch();
        });
        
        // Category filter event
        this.categorySelect.addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.performSearch();
        });
        
        // Clear search event
        this.clearSearch.addEventListener('click', () => {
            this.clearSearchResults();
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchResults.contains(e.target) && 
                !this.searchInput.contains(e.target) && 
                !this.categorySelect.contains(e.target)) {
                this.hideResults();
            }
        });
    }
    
    performSearch() {
        if (!this.currentQuery && !this.currentCategory) {
            this.hideResults();
            return;
        }
        
        let filteredProducts = this.products;
        
        // Filter by category
        if (this.currentCategory) {
            filteredProducts = filteredProducts.filter(product => 
                product.category === this.currentCategory
            );
        }
        
        // Filter by search query
        if (this.currentQuery) {
            const query = this.currentQuery.toLowerCase();
            filteredProducts = filteredProducts.filter(product => {
                return product.name.toLowerCase().includes(query) ||
                       product.description.toLowerCase().includes(query) ||
                       product.tags.some(tag => tag.toLowerCase().includes(query)) ||
                       product.ingredients.some(ingredient => ingredient.toLowerCase().includes(query));
            });
        }
        
        this.displayResults(filteredProducts);
    }
    
    displayResults(products) {
        if (products.length === 0) {
            this.showNoResults();
            return;
        }
        
        this.resultsCount.textContent = `${products.length} resultado${products.length > 1 ? 's' : ''} encontrado${products.length > 1 ? 's' : ''}`;
        this.clearSearch.style.display = 'block';
        this.noResults.style.display = 'none';
        this.resultsGrid.style.display = 'grid';
        
        // Clear previous results
        this.resultsGrid.innerHTML = '';
        
        // Add new results
        products.forEach(product => {
            const productCard = this.createProductCard(product);
            this.resultsGrid.appendChild(productCard);
        });
        
        this.showResults();
    }
    
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'search-result-item';
        
        const badges = [];
        if (product.popular) badges.push('<span class="badge badge--popular">Popular</span>');
        if (product.spicy) badges.push('<span class="badge badge--spicy">Picante</span>');
        if (product.vegetarian) badges.push('<span class="badge badge--veggie">Vegetariano</span>');
        
        card.innerHTML = `
            <div class="search-result-item__image">
                <img src="${product.image}" alt="${product.name}" width="120" height="80">
                ${badges.join('')}
            </div>
            <div class="search-result-item__content">
                <h3 class="search-result-item__title">${product.name}</h3>
                <p class="search-result-item__description">${product.description}</p>
                <div class="search-result-item__price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                <button class="btn btn--primary btn--small" onclick="addToCart(${product.id})">
                    Adicionar
                </button>
            </div>
        `;
        
        return card;
    }
    
    showNoResults() {
        this.resultsCount.textContent = '0 resultados encontrados';
        this.clearSearch.style.display = 'block';
        this.noResults.style.display = 'block';
        this.resultsGrid.style.display = 'none';
        this.showResults();
    }
    
    showResults() {
        this.searchResults.style.display = 'block';
    }
    
    hideResults() {
        this.searchResults.style.display = 'none';
    }
    
    clearSearchResults() {
        this.searchInput.value = '';
        this.categorySelect.value = '';
        this.currentQuery = '';
        this.currentCategory = '';
        this.hideResults();
    }
}

// Main application class
class KingBurgerApp {
    constructor() {
        this.search = null;
        this.init();
    }
    
    init() {
        this.initializeSearch();
        this.initializeUI();
    }
    
    initializeSearch() {
        this.search = new AlgoliaSearch();
    }
    
    initializeUI() {
        // Search toggle functionality
        const searchToggle = document.getElementById('searchToggle');
        const searchBar = document.getElementById('searchBar');
        const searchClose = document.getElementById('searchClose');
        
        searchToggle.addEventListener('click', () => {
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active')) {
                this.search.searchInput.focus();
            }
        });
        
        searchClose.addEventListener('click', () => {
            searchBar.classList.remove('active');
            this.search.clearSearchResults();
        });
        
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const headerNav = document.querySelector('.header__nav');
        
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            headerNav.classList.toggle('active');
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Back to top button
        const backToTop = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e.target);
            });
        }
    }
    
    handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        form.reset();
    }
}

// Cart functionality
function addToCart(productId) {
    // In a real application, this would add to a cart state
    console.log(`Product ${productId} added to cart`);
    
    // Show feedback to user
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Adicionado!';
    button.classList.add('btn--success');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('btn--success');
    }, 2000);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KingBurgerApp();
});
