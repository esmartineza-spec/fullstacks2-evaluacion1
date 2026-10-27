import {
    createProduct,
    deleteProduct,
    getProductById,
    listProducts,
    subscribeProducts,
    updateProduct,
} from '../services/productRepository.js';

const STORAGE_KEY = 'mil-sabores-products';

const sampleProduct = {
    id: 'TEST001',
    name: 'Torta de prueba',
    category: 'especiales',
    price: 1000,
    description: 'Producto de prueba para Jasmine.',
    image: '/img/producto_TE001.avif',
};

describe('productRepository', () => {
    beforeEach(() => {
        localStorage.removeItem(STORAGE_KEY);
    });

    it('inicia el catálogo con los 16 productos', () => {
        expect(listProducts().length).toBe(16);
    });

    it('encuentra un producto por su código', () => {
        expect(getProductById('TC001').name)
            .toBe('Torta Cuadrada de Chocolate');
    });

    it('devuelve null cuando el producto no existe', () => {
        expect(getProductById('NO-EXISTE')).toBeNull();
    });

    it('crea un producto nuevo', () => {
        createProduct(sampleProduct);

        expect(getProductById('TEST001').name).toBe('Torta de prueba');
    });

    it('rechaza un código de producto duplicado', () => {
        createProduct(sampleProduct);

        expect(() => createProduct(sampleProduct))
            .toThrowError(/Ya existe un producto/);
    });

    it('actualiza los datos de un producto', () => {
        createProduct(sampleProduct);
        updateProduct('TEST001', { name: 'Torta actualizada' });

        expect(getProductById('TEST001').name).toBe('Torta actualizada');
    });

    it('devuelve null al actualizar un código inexistente', () => {
        expect(updateProduct('NO-EXISTE', { name: 'Otro nombre' })).toBeNull();
    });

    it('elimina un producto existente', () => {
        createProduct(sampleProduct);

        expect(deleteProduct('TEST001')).toBe(true);
        expect(getProductById('TEST001')).toBeNull();
    });

    it('devuelve false al eliminar un código inexistente', () => {
        expect(deleteProduct('NO-EXISTE')).toBe(false);
    });

    it('notifica cuando cambia la lista de productos', () => {
        const callback = jasmine.createSpy('products changed');
        const unsubscribe = subscribeProducts(callback);

        createProduct(sampleProduct);

        expect(callback).toHaveBeenCalledTimes(1);
        unsubscribe();
    });
});