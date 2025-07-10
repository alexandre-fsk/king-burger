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

// Shopping Cart Class
class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }
    
    init() {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('kingBurgerCart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            this.items = cartData.items || [];
            this.total = cartData.total || 0;
        }
        this.updateCartDisplay();
    }
    
    addItem(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.calculateTotal();
        this.saveCart();
        this.updateCartDisplay();
        this.showCartNotification();
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.calculateTotal();
        this.saveCart();
        this.updateCartDisplay();
    }
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.calculateTotal();
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }
    
    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    clearCart() {
        this.items = [];
        this.total = 0;
        this.saveCart();
        this.updateCartDisplay();
    }
    
    saveCart() {
        localStorage.setItem('kingBurgerCart', JSON.stringify({
            items: this.items,
            total: this.total
        }));
    }
    
    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }
    
    showCartNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check"></i>
            <span>Item adicionado ao carrinho!</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    getCartItems() {
        return this.items;
    }
    
    getCartTotal() {
        return this.total;
    }
}

// Menu Modal Class
class MenuModal {
    constructor() {
        this.modal = null;
        this.init();
    }
    
    init() {
        this.createModal();
        this.bindEvents();
    }
    
    createModal() {
        const modalHTML = `
            <div class="menu-modal" id="menuModal">
                <div class="menu-modal__overlay"></div>
                <div class="menu-modal__content">
                    <div class="menu-modal__header">
                        <h2>Cardápio Completo</h2>
                        <button class="menu-modal__close" id="menuModalClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="menu-modal__body">
                        <div class="menu-modal__filters">
                            <button class="filter-btn active" data-category="all">Todos</button>
                            <button class="filter-btn" data-category="classic">Clássicos</button>
                            <button class="filter-btn" data-category="premium">Premium</button>
                            <button class="filter-btn" data-category="vegetarian">Vegetariano</button>
                            <button class="filter-btn" data-category="spicy">Picantes</button>
                        </div>
                        <div class="menu-modal__grid" id="menuModalGrid">
                            <!-- Menu items will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('menuModal');
    }
    
    bindEvents() {
        // Close modal
        const closeBtn = document.getElementById('menuModalClose');
        const overlay = this.modal.querySelector('.menu-modal__overlay');
        
        closeBtn.addEventListener('click', () => this.close());
        overlay.addEventListener('click', () => this.close());
        
        // Filter buttons
        const filterBtns = this.modal.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterMenu(e.target.dataset.category);
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    open() {
        this.populateMenu();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    populateMenu(category = 'all') {
        const grid = document.getElementById('menuModalGrid');
        grid.innerHTML = '';
        
        let filteredProducts = products;
        if (category !== 'all') {
            filteredProducts = products.filter(product => product.category === category);
        }
        
        filteredProducts.forEach(product => {
            const menuItem = this.createMenuItem(product);
            grid.appendChild(menuItem);
        });
    }
    
    filterMenu(category) {
        this.populateMenu(category);
    }
    
    createMenuItem(product) {
        const item = document.createElement('div');
        item.className = 'menu-modal__item';
        
        const badges = [];
        if (product.popular) badges.push('<span class="badge badge--popular">Popular</span>');
        if (product.spicy) badges.push('<span class="badge badge--spicy">Picante</span>');
        if (product.vegetarian) badges.push('<span class="badge badge--veggie">Vegetariano</span>');
        
        item.innerHTML = `
            <div class="menu-modal__item-image">
                <img src="${product.image}" alt="${product.name}" width="200" height="150">
                ${badges.join('')}
            </div>
            <div class="menu-modal__item-content">
                <h3 class="menu-modal__item-title">${product.name}</h3>
                <p class="menu-modal__item-description">${product.description}</p>
                <div class="menu-modal__item-ingredients">
                    <strong>Ingredientes:</strong> ${product.ingredients.join(', ')}
                </div>
                <div class="menu-modal__item-footer">
                    <div class="menu-modal__item-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                    <button class="btn btn--primary" onclick="cart.addItem(${product.id})">
                        <i class="fas fa-plus"></i> Adicionar
                    </button>
                </div>
            </div>
        `;
        
        return item;
    }
}

// Order Modal Class
class OrderModal {
    constructor() {
        this.modal = null;
        this.init();
    }
    
    init() {
        this.createModal();
        this.bindEvents();
    }
    
    createModal() {
        const modalHTML = `
            <div class="order-modal" id="orderModal">
                <div class="order-modal__overlay"></div>
                <div class="order-modal__content">
                    <div class="order-modal__header">
                        <h2>Finalizar Pedido</h2>
                        <button class="order-modal__close" id="orderModalClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="order-modal__body">
                        <div class="order-modal__cart" id="orderCart">
                            <!-- Cart items will be displayed here -->
                        </div>
                        <div class="order-modal__form">
                            <h3>Informações de Entrega</h3>
                            <form id="orderForm">
                                <div class="form__group">
                                    <input type="text" id="orderName" name="name" placeholder="Seu nome completo" required>
                                </div>
                                <div class="form__group">
                                    <input type="tel" id="orderPhone" name="phone" placeholder="Seu telefone" required>
                                </div>
                                <div class="form__group">
                                    <input type="text" id="orderAddress" name="address" placeholder="Endereço completo" required>
                                </div>
                                <div class="form__group">
                                    <textarea id="orderNotes" name="notes" placeholder="Observações do pedido (opcional)" rows="3"></textarea>
                                </div>
                                <div class="form__group">
                                    <label>
                                        <input type="radio" name="payment" value="cash" checked>
                                        Dinheiro
                                    </label>
                                    <label>
                                        <input type="radio" name="payment" value="card">
                                        Cartão
                                    </label>
                                    <label>
                                        <input type="radio" name="payment" value="pix">
                                        PIX
                                    </label>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="order-modal__footer">
                        <div class="order-modal__total">
                            <span>Total: R$ <span id="orderTotal">0,00</span></span>
                        </div>
                        <button class="btn btn--primary btn--large" id="confirmOrder">
                            <i class="fas fa-check"></i> Confirmar Pedido
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('orderModal');
    }
    
    bindEvents() {
        // Close modal
        const closeBtn = document.getElementById('orderModalClose');
        const overlay = this.modal.querySelector('.order-modal__overlay');
        
        closeBtn.addEventListener('click', () => this.close());
        overlay.addEventListener('click', () => this.close());
        
        // Confirm order
        const confirmBtn = document.getElementById('confirmOrder');
        confirmBtn.addEventListener('click', () => this.confirmOrder());
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    open() {
        this.populateCart();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    populateCart() {
        const cartContainer = document.getElementById('orderCart');
        const totalElement = document.getElementById('orderTotal');
        
        if (cart.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="order-modal__empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Seu carrinho está vazio</p>
                    <button class="btn btn--outline" onclick="orderModal.close(); menuModal.open();">
                        Ver Cardápio
                    </button>
                </div>
            `;
            totalElement.textContent = '0,00';
            return;
        }
        
        cartContainer.innerHTML = '';
        
        cart.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'order-modal__cart-item';
            
            cartItem.innerHTML = `
                <div class="order-modal__cart-item-image">
                    <img src="${item.image}" alt="${item.name}" width="60" height="60">
                </div>
                <div class="order-modal__cart-item-content">
                    <h4>${item.name}</h4>
                    <div class="order-modal__cart-item-controls">
                        <button class="btn btn--small" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="btn btn--small" onclick="cart.addItem(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="order-modal__cart-item-price">
                    R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </div>
                <button class="order-modal__cart-item-remove" onclick="cart.removeItem(${item.id}); orderModal.populateCart();">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartContainer.appendChild(cartItem);
        });
        
        totalElement.textContent = cart.total.toFixed(2).replace('.', ',');
    }
    
    confirmOrder() {
        const form = document.getElementById('orderForm');
        const formData = new FormData(form);
        const orderData = Object.fromEntries(formData);
        
        if (!orderData.name || !orderData.phone || !orderData.address) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        if (cart.items.length === 0) {
            alert('Seu carrinho está vazio.');
            return;
        }
        
        // Create order object
        const order = {
            id: Date.now(),
            items: cart.items,
            total: cart.total,
            customer: orderData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // In a real application, this would be sent to the backend
        console.log('Order placed:', order);
        
        // Show success message
        this.showOrderConfirmation(order);
        
        // Clear cart
        cart.clearCart();
        
        // Close modal
        this.close();
    }
    
    showOrderConfirmation(order) {
        const confirmationHTML = `
            <div class="order-confirmation" id="orderConfirmation">
                <div class="order-confirmation__overlay"></div>
                <div class="order-confirmation__content">
                    <div class="order-confirmation__icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Pedido Confirmado!</h2>
                    <p>Seu pedido #${order.id} foi recebido com sucesso.</p>
                    <div class="order-confirmation__details">
                        <p><strong>Total:</strong> R$ ${order.total.toFixed(2).replace('.', ',')}</p>
                        <p><strong>Forma de Pagamento:</strong> ${this.getPaymentMethod(order.customer.payment)}</p>
                        <p><strong>Tempo estimado:</strong> 30-45 minutos</p>
                    </div>
                    <button class="btn btn--primary" onclick="this.closeConfirmation()">
                        Fechar
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', confirmationHTML);
        
        const confirmation = document.getElementById('orderConfirmation');
        confirmation.classList.add('active');
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.parentNode.removeChild(confirmation);
            }
        }, 5000);
    }
    
    closeConfirmation() {
        const confirmation = document.getElementById('orderConfirmation');
        if (confirmation && confirmation.parentNode) {
            confirmation.parentNode.removeChild(confirmation);
        }
    }
    
    getPaymentMethod(payment) {
        const methods = {
            cash: 'Dinheiro',
            card: 'Cartão',
            pix: 'PIX'
        };
        return methods[payment] || 'Não especificado';
    }
}

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
                <button class="btn btn--primary btn--small" onclick="cart.addItem(${product.id})">
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
        this.cart = null;
        this.menuModal = null;
        this.orderModal = null;
        this.init();
    }
    
    init() {
        this.initializeSearch();
        this.initializeCart();
        this.initializeModals();
        this.initializeUI();
    }
    
    initializeSearch() {
        this.search = new AlgoliaSearch();
    }
    
    initializeCart() {
        this.cart = new ShoppingCart();
    }
    
    initializeModals() {
        this.menuModal = new MenuModal();
        this.orderModal = new OrderModal();
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
        
        // Menu and Order buttons
        this.bindMenuAndOrderButtons();
    }
    
    bindMenuAndOrderButtons() {
        // View menu buttons
        const menuButtons = [
            document.getElementById('menuBtn'),
            document.querySelector('.menu-actions .btn'),
            ...document.querySelectorAll('[onclick*="menuModal"]')
        ];
        
        menuButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.menuModal.open();
                });
            }
        });
        
        // Place order buttons
        const orderButtons = [
            document.getElementById('orderBtn'),
            document.getElementById('heroOrderBtn'),
            ...document.querySelectorAll('[onclick*="orderModal"]')
        ];
        
        orderButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.orderModal.open();
                });
            }
        });
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

// Global instances
let cart;
let menuModal;
let orderModal;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new KingBurgerApp();
    
    // Make instances globally available
    cart = app.cart;
    menuModal = app.menuModal;
    orderModal = app.orderModal;
    
    // Initialize cart and modals
    cart = new ShoppingCart();
    menuModal = new MenuModal();
    orderModal = new OrderModal();
    
    // Bind menu and order buttons
    bindMenuAndOrderButtons();
});

// Bind menu and order buttons
function bindMenuAndOrderButtons() {
    // View menu buttons
    const menuButtons = [
        document.getElementById('menuBtn'),
        document.querySelector('.menu-actions .btn'),
        ...document.querySelectorAll('[onclick*="menuModal"]')
    ];
    
    menuButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                menuModal.open();
            });
        }
    });
    
    // Place order buttons
    const orderButtons = [
        document.getElementById('orderBtn'),
        document.getElementById('heroOrderBtn'),
        ...document.querySelectorAll('[onclick*="orderModal"]')
    ];
    
    orderButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                orderModal.open();
            });
        }
    });
}

// Legacy function for backward compatibility
function addToCart(productId) {
    if (cart) {
        cart.addItem(productId);
    }
}
