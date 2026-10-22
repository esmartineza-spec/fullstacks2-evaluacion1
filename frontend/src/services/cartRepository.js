import { getProductById } from './productRepository.js';

const STORAGE_KEY = 'mil-sabores-cart';
const CHANGE_EVENT = 'mil-sabores:cart-changed';

function readCart() {
    try {
        const savedCart = localStorage.getItem(STORAGE_KEY);
        const cart = savedCart ? JSON.parse(savedCart) : [];
        return Array.isArray(cart) ? cart : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getCart() {
    return readCart();
}

export function addToCart(productId) {
    if (!getProductById(productId)) {
        throw new Error('No se encontró el producto.');
    }

    const cart = readCart();
    const existingItem = cart.find((item) => item.productId === productId);

    const updatedCart = existingItem
        ? cart.map((item) =>
            item.productId === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        )
        : [...cart, { productId, quantity: 1 }];

    saveCart(updatedCart);
}

export function updateCartQuantity(productId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error('La cantidad debe ser un número entero mayor que cero.');
    }

    const cart = readCart();
    const updatedCart = cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
    );

    saveCart(updatedCart);
}

export function removeFromCart(productId) {
    saveCart(readCart().filter((item) => item.productId !== productId));
}

export function clearCart() {
    saveCart([]);
}

export function subscribeCart(callback) {
    window.addEventListener(CHANGE_EVENT, callback);
    window.addEventListener('storage', callback);

    return () => {
        window.removeEventListener(CHANGE_EVENT, callback);
        window.removeEventListener('storage', callback);
    };
}