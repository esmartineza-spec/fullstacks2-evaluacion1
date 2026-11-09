import {
    createCategory,
    deleteCategory,
    getCategoryById,
    listCategories,
    subscribeCategories,
    updateCategory,
} from '../services/categoryRepository.js';

const STORAGE_KEY = 'mil-sabores-categories';
const CHANGE_EVENT = 'mil-sabores:categories-changed';

describe('categoryRepository', () => {
    beforeEach(() => {
        localStorage.removeItem(STORAGE_KEY);
    });

    it('inicializa las categorías predeterminadas sin incluir "todas"', () => {
        const categories = listCategories();

        expect(categories.length).toBeGreaterThan(0);
        expect(categories.some((category) => category.id === 'todas')).toBe(false);
        expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(categories);
    });

    it('devuelve una lista vacía si el contenido guardado no es un arreglo', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ categoria: 'Prueba' }));

        expect(listCategories()).toEqual([]);
    });

    it('devuelve una lista vacía si el contenido guardado no es JSON válido', () => {
        localStorage.setItem(STORAGE_KEY, '{contenido incorrecto');

        expect(listCategories()).toEqual([]);
    });

    it('encuentra una categoría por su identificador', () => {
        const category = { id: 'prueba', label: 'Prueba' };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([category]));

        expect(getCategoryById('prueba')).toEqual(category);
    });

    it('devuelve null si no encuentra una categoría', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));

        expect(getCategoryById('inexistente')).toBeNull();
    });

    it('crea una categoría normalizando el identificador y el nombre', () => {
        const category = createCategory({
            id: '  Nueva-Categoria  ',
            label: '  Nueva categoría  ',
        });

        expect(category).toEqual({
            id: 'nueva-categoria',
            label: 'Nueva categoría',
        });
        expect(listCategories()).toContain(category);
    });

    it('rechaza un identificador con caracteres no permitidos', () => {
        expect(() => createCategory({
            id: 'categoria inválida',
            label: 'Categoría válida',
        })).toThrowError(
            'El identificador solo puede usar letras, números y guiones.'
        );
    });

    it('rechaza un nombre de categoría demasiado corto', () => {
        expect(() => createCategory({
            id: 'valida',
            label: 'AB',
        })).toThrowError('El nombre debe tener al menos 3 caracteres.');
    });

    it('rechaza un identificador que ya existe', () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([{ id: 'existente', label: 'Existente' }])
        );

        expect(() => createCategory({
            id: 'existente',
            label: 'Otra categoría',
        })).toThrowError('Ya existe una categoría con ese identificador.');
    });

    it('actualiza el nombre de una categoría existente', () => {
        const category = { id: 'prueba', label: 'Nombre anterior' };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([category]));

        const updated = updateCategory('prueba', { label: 'Nombre nuevo' });

        expect(updated).toEqual({ id: 'prueba', label: 'Nombre nuevo' });
        expect(listCategories()).toEqual([updated]);
    });

    it('rechaza actualizar una categoría con un nombre demasiado corto', () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([{ id: 'prueba', label: 'Prueba' }])
        );

        expect(() => updateCategory('prueba', { label: '  ' }))
            .toThrowError('El nombre debe tener al menos 3 caracteres.');
    });

    it('devuelve null si intenta actualizar un identificador inexistente', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));

        expect(updateCategory('inexistente', { label: 'Nombre válido' })).toBeNull();
    });

    it('elimina una categoría existente', () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([{ id: 'prueba', label: 'Prueba' }])
        );

        expect(deleteCategory('prueba')).toBe(true);
        expect(listCategories()).toEqual([]);
    });

    it('devuelve false si intenta eliminar una categoría inexistente', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));

        expect(deleteCategory('inexistente')).toBe(false);
    });

    it('notifica cambios propios y cambios de almacenamiento', () => {
        const callback = jasmine.createSpy('callback');
        const unsubscribe = subscribeCategories(callback);

        window.dispatchEvent(new Event(CHANGE_EVENT));
        window.dispatchEvent(new Event('storage'));

        expect(callback).toHaveBeenCalledTimes(2);

        unsubscribe();
    });

    it('deja de notificar después de cancelar la suscripción', () => {
        const callback = jasmine.createSpy('callback');
        const unsubscribe = subscribeCategories(callback);

        unsubscribe();
        window.dispatchEvent(new Event(CHANGE_EVENT));
        window.dispatchEvent(new Event('storage'));

        expect(callback).not.toHaveBeenCalled();
    });
});