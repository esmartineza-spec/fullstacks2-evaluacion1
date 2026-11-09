import {
    addToCart,
    clearCart,
    getCart,
    removeFromCart,
    subscribeCart,
    updateCartQuantity,
} from '../services/cartRepository.js';

const CART_KEY = 'mil-sabores-cart';
const PRODUCTS_KEY = 'mil-sabores-products';

describe('cartRepository', () => {
    beforeEach(() => {
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem(PRODUCTS_KEY);
    });

    it('devuelve un carrito vacío al inicio', () => {
        expect(getCart()).toEqual([]);
    });

    it('agrega un producto con cantidad uno', () => {
        addToCart('TC001');

        expect(getCart()).toEqual([
            { productId: 'TC001', quantity: 1 },
        ]);
    });

    it('aumenta la cantidad si agrega nuevamente el mismo producto', () => {
        addToCart('TC001');
        addToCart('TC001');

        expect(getCart()[0].quantity).toBe(2);
    });

    it('rechaza agregar un producto que no existe', () => {
        expect(() => addToCart('NO-EXISTE'))
            .toThrowError('No se encontró el producto.');
    });

    it('actualiza la cantidad de un producto', () => {
        addToCart('TC001');
        updateCartQuantity('TC001', 3);

        expect(getCart()[0].quantity).toBe(3);
    });

    it('rechaza cantidades cero o fraccionarias', () => {
        expect(() => updateCartQuantity('TC001', 0))
            .toThrowError('La cantidad debe ser un número entero mayor que cero.');

        expect(() => updateCartQuantity('TC001', 1.5))
            .toThrowError('La cantidad debe ser un número entero mayor que cero.');
    });

    it('elimina un producto y puede vaciar el carrito', () => {
        addToCart('TC001');
        removeFromCart('TC001');
        expect(getCart()).toEqual([]);

        addToCart('TC002');
        clearCart();
        expect(getCart()).toEqual([]);
    });

    it('devuelve un carrito vacío si el almacenamiento no contiene JSON válido', () => {
        localStorage.setItem(CART_KEY, '{dato incorrecto');

        expect(getCart()).toEqual([]);
    });

    it('notifica cambios y deja de notificar al cancelar la suscripción', () => {
        const callback = jasmine.createSpy('cart changed');
        const unsubscribe = subscribeCart(callback);

        addToCart('TC001');
        expect(callback).toHaveBeenCalledTimes(1);

        unsubscribe();
        clearCart();

        expect(callback).toHaveBeenCalledTimes(1);
    });
});