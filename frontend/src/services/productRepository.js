import { initialProducts } from '../data/products.js';

const STORAGE_KEY = 'mil-sabores-products';
const CHANGE_EVENT = 'mil-sabores:products-changed';

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function listProducts() {
    const savedProducts = localStorage.getItem(STORAGE_KEY);

    if (savedProducts === null) {
        const seed = [...initialProducts];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
    }

    try {
        const products = JSON.parse(savedProducts);
        return Array.isArray(products) ? products : [...initialProducts];
    } catch {
        return [...initialProducts];
    }
}

export function getProductById(id) {
    return listProducts().find((product) => product.id === id) ?? null;
}

export function createProduct(product) {
    const products = listProducts();
    const newProduct = {
        ...product,
        id: product.id?.trim() || `MS-${Date.now()}`,
    };

    if (products.some((item) => item.id === newProduct.id)) {
        throw new Error(`Ya existe un producto con el código ${newProduct.id}.`);
    }

    saveProducts([...products, newProduct]);
    return newProduct;
}

export function updateProduct(id, changes) {
    const products = listProducts();
    let updatedProduct = null;

    const updatedProducts = products.map((product) => {
        if (product.id !== id) return product;

        updatedProduct = { ...product, ...changes, id };
        return updatedProduct;
    });

    if (!updatedProduct) return null;

    saveProducts(updatedProducts);
    return updatedProduct;
}

export function deleteProduct(id) {
    const products = listProducts();
    const remainingProducts = products.filter((product) => product.id !== id);

    if (remainingProducts.length === products.length) return false;

    saveProducts(remainingProducts);
    return true;
}

export function subscribeProducts(callback) {
    window.addEventListener(CHANGE_EVENT, callback);
    window.addEventListener('storage', callback);

    return () => {
        window.removeEventListener(CHANGE_EVENT, callback);
        window.removeEventListener('storage', callback);
    };
}