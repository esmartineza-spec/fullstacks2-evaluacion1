import { initialProducts } from '../data/products.js';

const STORAGE_KEY = 'mil-sabores-products';
const CHANGE_EVENT = 'mil-sabores:products-changed';
const DEFAULT_STOCK = 10;

function addDefaultStock(products) {
    let changed = false;

    const normalizedProducts = products.map((product) => {
        if (Number.isInteger(product.stock) && product.stock >= 0) {
            return product;
        }

        changed = true;
        return { ...product, stock: DEFAULT_STOCK };
    });

    return { products: normalizedProducts, changed };
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function listProducts() {
    const savedProducts = localStorage.getItem(STORAGE_KEY);

    if (savedProducts === null) {
        const seed = initialProducts.map((product) => ({
            ...product,
            stock: DEFAULT_STOCK,
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
    }

    try {
        const parsedProducts = JSON.parse(savedProducts);

        if (!Array.isArray(parsedProducts)) {
            return initialProducts.map((product) => ({
                ...product,
                stock: DEFAULT_STOCK,
            }));
        }

        const result = addDefaultStock(parsedProducts);

        if (result.changed) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(result.products)
            );
        }

        return result.products;
    } catch {
        return initialProducts.map((product) => ({
            ...product,
            stock: DEFAULT_STOCK,
        }));
    }
}

export function getProductById(id) {
    return listProducts().find((product) => product.id === id) ?? null;
}

export function createProduct(product) {
    const products = listProducts();
    const stock = Number(product.stock ?? DEFAULT_STOCK);

    if (!Number.isInteger(stock) || stock < 0) {
        throw new Error('El stock debe ser un número entero igual o mayor que cero.');
    }

    const newProduct = {
        ...product,
        id: product.id?.trim() || `MS-${Date.now()}`,
        stock,
    };

    if (products.some((item) => item.id === newProduct.id)) {
        throw new Error(`Ya existe un producto con el código ${newProduct.id}.`);
    }

    saveProducts([...products, newProduct]);
    return newProduct;
}

export function updateProduct(id, changes) {
    const products = listProducts();
    const nextChanges = { ...changes };

    if (nextChanges.stock !== undefined) {
        nextChanges.stock = Number(nextChanges.stock);

        if (!Number.isInteger(nextChanges.stock) || nextChanges.stock < 0) {
            throw new Error('El stock debe ser un número entero igual o mayor que cero.');
        }
    }

    let updatedProduct = null;

    const updatedProducts = products.map((product) => {
        if (product.id !== id) return product;

        updatedProduct = { ...product, ...nextChanges, id };
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