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

        // Minha Conta (My Account) button
        const accountBtn = document.getElementById('accountBtn');
        if (accountBtn) {
            accountBtn.addEventListener('click', () => {
                alert('Funcionalidade de conta em breve!');
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

// === CART LOGIC ===
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function clearCart() {
    localStorage.removeItem('cart');
}

function addToCart(productId) {
    const cart = getCart();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: productId, name: product.name, price: product.price, qty: 1 });
    }
    setCart(cart);
    renderCart(); // Always update cart display
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

function renderCart() {
    const cart = getCart();
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const orderSuccess = document.getElementById('order-success');
    orderSuccess.textContent = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
        cartTotal.textContent = '';
        return;
    }
    let total = 0;
    cartItems.innerHTML = '<ul style="padding-left:20px;">' + cart.map(item => {
        total += item.price * item.qty;
        return `<li>${item.name} x${item.qty} - R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</li>`;
    }).join('') + '</ul>';
    cartTotal.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

function showCartModal() {
    renderCart();
    document.getElementById('cart-modal').style.display = 'block';
}
function hideCartModal() {
    document.getElementById('cart-modal').style.display = 'none';
}

// === AUTHENTICATION LOGIC ===

function showModal(id) {
    document.getElementById(id).style.display = 'block';
}
function hideModal(id) {
    document.getElementById(id).style.display = 'none';
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
}
function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
function setLoggedInUser(username) {
    localStorage.setItem('loggedInUser', username);
}
function getLoggedInUser() {
    return localStorage.getItem('loggedInUser');
}
function logoutUser() {
    localStorage.removeItem('loggedInUser');
}

function updateAuthUI() {
    const user = getLoggedInUser();
    const welcome = document.getElementById('welcome-user');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const createAccountBtn = document.getElementById('create-account-btn');
    if (user) {
        welcome.textContent = `Bem-vindo, ${user}!`;
        welcome.style.display = '';
        loginBtn.style.display = 'none';
        logoutBtn.style.display = '';
        createAccountBtn.style.display = 'none';
    } else {
        welcome.textContent = '';
        welcome.style.display = 'none';
        loginBtn.style.display = '';
        logoutBtn.style.display = 'none';
        createAccountBtn.style.display = '';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KingBurgerApp();
    // AUTH UI
    updateAuthUI();
    // Modal open/close
    document.getElementById('login-btn').onclick = () => showModal('login-modal');
    document.getElementById('create-account-btn').onclick = () => showModal('create-account-modal');
    document.getElementById('close-login').onclick = () => hideModal('login-modal');
    document.getElementById('close-create-account').onclick = () => hideModal('create-account-modal');
    // Logout
    document.getElementById('logout-btn').onclick = () => {
        logoutUser();
        updateAuthUI();
    };
    // Cart modal open/close
    const openCart = showCartModal;
    if (document.getElementById('view-cart-btn'))
        document.getElementById('view-cart-btn').onclick = openCart;
    if (document.getElementById('orderBtn'))
        document.getElementById('orderBtn').onclick = openCart;
    document.getElementById('close-cart').onclick = hideCartModal;
    // Place order
    document.getElementById('place-order-btn').onclick = function() {
        const cart = getCart();
        if (cart.length === 0) return;
        clearCart();
        renderCart();
        document.getElementById('order-success').textContent = 'Pedido realizado com sucesso!';
    };
    // Login form
    document.getElementById('login-form').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const users = getUsers();
        if (users[username] && users[username] === password) {
            setLoggedInUser(username);
            hideModal('login-modal');
            updateAuthUI();
            document.getElementById('login-error').textContent = '';
            this.reset();
        } else {
            document.getElementById('login-error').textContent = 'Usuário ou senha incorretos.';
        }
    };
    // Create account form
    document.getElementById('create-account-form').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('create-username').value.trim();
        const password = document.getElementById('create-password').value;
        const users = getUsers();
        if (!username || !password) {
            document.getElementById('create-account-error').textContent = 'Preencha todos os campos.';
            return;
        }
        if (users[username]) {
            document.getElementById('create-account-error').textContent = 'Usuário já existe.';
            return;
        }
        users[username] = password;
        setUsers(users);
        setLoggedInUser(username);
        hideModal('create-account-modal');
        updateAuthUI();
        document.getElementById('create-account-error').textContent = '';
        this.reset();
    };
    // Close modals on outside click
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
    // On page load, update UI
    updateAuthUI();
});
