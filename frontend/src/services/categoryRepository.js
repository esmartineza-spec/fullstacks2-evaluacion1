import { categories as initialCategories } from '../data/products.js';

const STORAGE_KEY = 'mil-sabores-categories';
const CHANGE_EVENT = 'mil-sabores:categories-changed';

function readCategories() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved === null) {
            const seed = initialCategories.filter(
                (category) => category.id !== 'todas'
            );
            localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
            return seed;
        }

        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveCategories(categories) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function listCategories() {
    return readCategories();
}

export function getCategoryById(id) {
    return readCategories().find((category) => category.id === id) ?? null;
}

export function createCategory({ id = '', label = '' }) {
    const normalizedId = id.trim().toLowerCase();
    const normalizedLabel = label.trim();

    if (!/^[a-z0-9-]+$/.test(normalizedId)) {
        throw new Error('El identificador solo puede usar letras, números y guiones.');
    }
    if (normalizedLabel.length < 3) {
        throw new Error('El nombre debe tener al menos 3 caracteres.');
    }

    const categories = readCategories();

    if (categories.some((category) => category.id === normalizedId)) {
        throw new Error('Ya existe una categoría con ese identificador.');
    }

    const newCategory = { id: normalizedId, label: normalizedLabel };
    saveCategories([...categories, newCategory]);
    return newCategory;
}

export function updateCategory(id, changes) {
    const categories = readCategories();
    let updatedCategory = null;

    const updatedCategories = categories.map((category) => {
        if (category.id !== id) return category;

        const label = String(changes.label || '').trim();
        if (label.length < 3) {
            throw new Error('El nombre debe tener al menos 3 caracteres.');
        }

        updatedCategory = { ...category, label };
        return updatedCategory;
    });

    if (!updatedCategory) return null;

    saveCategories(updatedCategories);
    return updatedCategory;
}

export function deleteCategory(id) {
    const categories = readCategories();
    const remaining = categories.filter((category) => category.id !== id);

    if (remaining.length === categories.length) return false;

    saveCategories(remaining);
    return true;
}

export function subscribeCategories(callback) {
    window.addEventListener(CHANGE_EVENT, callback);
    window.addEventListener('storage', callback);

    return () => {
        window.removeEventListener(CHANGE_EVENT, callback);
        window.removeEventListener('storage', callback);
    };
}