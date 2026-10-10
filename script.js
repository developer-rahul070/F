// =====================================
// MINYA MART - SHOPPING WEBSITE
// PART 3: JAVASCRIPT
// =====================================

// SELECT ELEMENTS
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const productGrid = document.getElementById("productGrid");
const productCards = [...document.querySelectorAll(".product-card")];
const categoryLinks = document.querySelectorAll(".categories a");
const sortProducts = document.getElementById("sortProducts");
const noProducts = document.getElementById("noProducts");

const cartButton = document.getElementById("cartButton");
const cartSection = document.getElementById("cartSection");
const closeCart = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// SHOPPING CART
let cart = [];
let selectedCategory = "All";

// =====================================
// 1. ADD TO CART
// =====================================

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        if (!name || !Number.isFinite(price) || price < 0) {
            alert("Sorry! Product information is unavailable.");
            return;
        }

        const existingProduct = cart.find(item => item.name === name);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCart();

        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i> Added!';

        setTimeout(() => {
            button.innerHTML = originalText;
        }, 1000);
    });
});

// =====================================
// 2. UPDATE CART
// =====================================

function updateCart() {
    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(totalPrice);

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cartItems.replaceChildren();

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("div");
        details.className = "cart-item-details";

        const title = document.createElement("strong");
        title.textContent = item.name;

        const price = document.createElement("p");
        price.textContent =
            `${formatPrice(item.price)} × ${item.quantity}`;

        details.append(title, price);

        const controls = document.createElement("div");
        controls.className = "cart-item-controls";

        const minus = document.createElement("button");
        minus.type = "button";
        minus.textContent = "−";
        minus.setAttribute("aria-label", `Remove one ${item.name}`);

        minus.addEventListener("click", () => {
            changeQuantity(item.name, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";
        plus.setAttribute("aria-label", `Add one ${item.name}`);

        plus.addEventListener("click", () => {
            changeQuantity(item.name, 1);
        });

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Remove";
        remove.className = "remove-item";

        remove.addEventListener("click", () => {
            cart = cart.filter(product => product.name !== item.name);
            updateCart();
        });

        controls.append(minus, quantity, plus, remove);
        row.append(details, controls);
        cartItems.appendChild(row);
    });
}

// =====================================
// 3. FORMAT PRICE
// =====================================

function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
}

// =====================================
// 4. CHANGE QUANTITY
// =====================================

function changeQuantity(name, change) {
    const item = cart.find(product => product.name === name);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.name !== name);
    }

    updateCart();
}

// =====================================
// 5. OPEN AND CLOSE CART
// =====================================

cartButton.addEventListener("click", () => {
    cartSection.hidden = false;
});

closeCart.addEventListener("click", () => {
    cartSection.hidden = true;
});

// =====================================
// 6. SEARCH PRODUCTS
// =====================================

function filterProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    productCards.forEach(card => {
        const name = card.querySelector("h3").textContent.toLowerCase();
        const category = card.dataset.category.toLowerCase();
        const description = card.textContent.toLowerCase();

        const matchesSearch =
            name.includes(searchTerm) ||
            category.includes(searchTerm) ||
            description.includes(searchTerm);

        const matchesCategory =
            selectedCategory === "All" ||
            card.dataset.category === selectedCategory;

        const visible = matchesSearch && matchesCategory;

        card.hidden = !visible;

        if (visible) visibleCount++;
    });

    noProducts.hidden = visibleCount !== 0;
}

searchBtn.addEventListener("click", () => {
    filterProducts();
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
});

searchInput.addEventListener("input", filterProducts);

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        filterProducts();
        document.getElementById("products").scrollIntoView({
            behavior: "smooth"
        });
    }
});

// =====================================
// 7. CATEGORY FILTER
// =====================================

categoryLinks.forEach(link => {
    link.addEventListener("click", () => {
        selectedCategory = link.dataset.category || "All";
        filterProducts();
    });
});

// =====================================
// 8. SORT PRODUCTS BY PRICE
// =====================================

sortProducts.addEventListener("change", () => {
    const cards = [...productGrid.querySelectorAll(".product-card")];

    if (sortProducts.value === "low") {
        cards.sort((a, b) => {
            return getPrice(a) - getPrice(b);
        });
    } else if (sortProducts.value === "high") {
        cards.sort((a, b) => {
            return getPrice(b) - getPrice(a);
        });
    }

    cards.forEach(card => productGrid.appendChild(card));

    filterProducts();
});

function getPrice(card) {
    const button = card.querySelector(".add-to-cart");
    return Number(button.dataset.price) || 0;
}

// =====================================
// 9. WISHLIST
// =====================================

document.querySelectorAll(".wishlist").forEach(button => {
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
        const icon = button.querySelector("i");
        const isLiked = button.getAttribute("aria-pressed") === "true";

        button.setAttribute("aria-pressed", String(!isLiked));

        if (isLiked) {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
            button.style.color = "";
        } else {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
            button.style.color = "#ef4565";
        }
    });
});

// =====================================
// 10. NEWSLETTER DEMO
// =====================================

const newsletterForm = document.getElementById("newsletterForm");

newsletterForm.addEventListener("submit", event => {
    event.preventDefault();

    const emailInput = newsletterForm.querySelector('input[type="email"]');

    if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
    }

    alert("Thank you for joining MINYA MART! 🎉");

    newsletterForm.reset();
});

// =====================================
// 11. CHECKOUT DEMO
// =====================================

checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add a product first.");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    alert(
        "MINYA MART - Order Summary\n\n" +
        "Total items: " +
        cart.reduce((sum, item) => sum + item.quantity, 0) +
        "\nTotal amount: " + formatPrice(total) +
        "\n\nThis is a demo checkout. No real order or payment has been made."
    );
});

// =====================================
// 12. INITIALIZE WEBSITE
// =====================================

updateCart();
filterProducts();

console.log("MINYA MART is ready! 🛍️");
// =====================================
// PART 4: LOGIN / SIGNUP DEMO
// =====================================

const loginButton = document.querySelector(".login-btn");
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginButton.addEventListener("click", () => {
    loginMessage.textContent = "";
    loginModal.hidden = false;
});

loginForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("loginName")
        .value.trim();

    const email = document.getElementById("loginEmail")
        .value.trim();

    if (!name || !email) {
        loginMessage.textContent = "Please fill in all fields.";
        return;
    }

    loginMessage.textContent =
        `Welcome, ${name}! This is a demo login.`;

    loginButton.innerHTML =
        '<i class="fa-regular fa-user"></i> ' +
        name.split(/\s+/)[0];

    loginForm.reset();

    setTimeout(() => {
        loginModal.hidden = true;
    }, 1500);
});


// =====================================
// PART 4: MOBILE CATEGORY MENU
// =====================================

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const categoriesMenu =
    document.querySelector(".categories");

mobileMenuBtn.addEventListener("click", () => {
    const isOpen =
        categoriesMenu.classList.toggle("mobile-menu-open");

    mobileMenuBtn.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    mobileMenuBtn.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

categoriesMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        categoriesMenu.classList.remove("mobile-menu-open");

        mobileMenuBtn.setAttribute("aria-expanded", "false");

        mobileMenuBtn.innerHTML =
            '<i class="fa-solid fa-bars"></i>';
    });
});


// =====================================
// PART 4: PRODUCT DETAILS
// =====================================

const productModal =
    document.getElementById("productModal");

const detailImage =
    document.getElementById("detailImage");

const detailName =
    document.getElementById("detailName");

const detailCategory =
    document.getElementById("detailCategory");

const detailPrice =
    document.getElementById("detailPrice");

const detailRating =
    document.getElementById("detailRating");

const detailAddToCart =
    document.getElementById("detailAddToCart");

let selectedProductButton = null;

productCards.forEach(card => {
    const image = card.querySelector(".product-image img");
    const title = card.querySelector("h3");

    // Make the product image clickable
    image.style.cursor = "pointer";
    image.title = "View product details";

    image.addEventListener("click", () => {
        const addButton = card.querySelector(".add-to-cart");

        selectedProductButton = addButton;

        detailImage.src = image.src;
        detailImage.alt = image.alt;

        detailName.textContent = title.textContent;

        detailCategory.textContent =
            card.dataset.category || "";

        detailPrice.textContent =
            addButton.dataset.price
                ? formatPrice(Number(addButton.dataset.price))
                : "";

        detailRating.textContent =
            card.querySelector(".rating")?.textContent || "";

        productModal.hidden = false;
    });
});

detailAddToCart.addEventListener("click", () => {
    if (!selectedProductButton) return;

    selectedProductButton.click();
    productModal.hidden = true;
});


// =====================================
// PART 4: CLOSE MODALS
// =====================================

document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
        const modal = document.getElementById(
            button.dataset.close
        );

        if (modal) modal.hidden = true;
    });
});

document.querySelectorAll(".modal-overlay").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.hidden = true;
        }
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        document.querySelectorAll(".modal-overlay").forEach(modal => {
            modal.hidden = true;
        });
    }
});

console.log("MINYA MART Part 4 loaded!");
