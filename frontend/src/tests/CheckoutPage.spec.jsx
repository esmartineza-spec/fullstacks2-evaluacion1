import {fireEvent, render, screen} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import { addToCart, clearCart, getCart } from '../services/cartRepository.js';
import {
    getProductById,
    listProducts,
    updateProduct,
} from '../services/productRepository.js';

describe('CheckoutPage', () => {
    beforeEach(() => {
        clearCart();
        localStorage.removeItem('mil-sabores-products');
        listProducts();

        localStorage.removeItem('usuario_mil_sabores_activo');
        localStorage.removeItem('mil-sabores-last-order');
        localStorage.removeItem('mil-sabores-orders');
    });

    it('muestra un aviso y no permite confirmar si el carrito está vacío', () => {
        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        expect(
            screen.getByRole('heading', { name: 'No hay productos para comprar' })
        ).toBeTruthy();

        expect(screen.getByRole('link', { name: 'Ver productos' })).toBeTruthy();

        expect(
            screen.queryByRole('button', { name: 'Confirmar compra' })
        ).toBeNull();
    });

    it('muestra errores si se confirma una compra con el formulario vacío', () => {
        addToCart('TC001');

        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra' }));

        expect(screen.getByText('Ingresa tu nombre completo.')).toBeTruthy();
        expect(screen.getByText('Ingresa un correo válido.')).toBeTruthy();
        expect(screen.getByText('Ingresa un teléfono válido.')).toBeTruthy();
        expect(screen.getByText('Ingresa una dirección válida.')).toBeTruthy();
        expect(screen.getByText('Ingresa tu comuna.')).toBeTruthy();
        expect(screen.getByText('Selecciona un medio de pago.')).toBeTruthy();
        expect(getProductById('TC001').stock).toBe(10);

        expect(localStorage.getItem('mil-sabores-last-order')).toBeNull();
    });

    it('registra una compra con descuento, guarda el pedido y vacía el carrito', () => {
        addToCart('TC001');

        render(
            <MemoryRouter initialEntries={['/checkout']}>
                <Routes>
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route
                        path="/compra/exito"
                        element={<h1>Compra completada</h1>}
                    />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Nombre completo'), {
            target: { value: 'Ana Prueba' },
        });
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'ana@example.com' },
        });
        fireEvent.change(screen.getByLabelText('Teléfono'), {
            target: { value: '912345678' },
        });
        fireEvent.change(screen.getByLabelText('Dirección'), {
            target: { value: 'Calle de prueba 123' },
        });
        fireEvent.change(screen.getByLabelText('Comuna'), {
            target: { value: 'Santiago' },
        });
        fireEvent.change(screen.getByLabelText('Medio de pago'), {
            target: { value: 'Débito' },
        });
        fireEvent.change(screen.getByLabelText('Código de descuento'), {
            target: { value: 'FELICES50' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra' }));

        const order = JSON.parse(localStorage.getItem('mil-sabores-last-order'));

        expect(order.subtotal).toBe(45000);
        expect(order.discountPercentage).toBe(10);
        expect(order.discountAmount).toBe(4500);
        expect(order.shipping).toBe(3500);
        expect(order.total).toBe(44000);
        expect(order.iva).toBe(7025);
        expect(order.accountEmail).toBe('ana@example.com');
        expect(getCart()).toEqual([]);
        expect(
            screen.getByRole('heading', { name: 'Compra completada' })
        ).toBeTruthy();
        expect(getProductById('TC001').stock).toBe(9);
    });

    it('avisa si el cupón es inválido y no aplica descuento', () => {
        addToCart('TC001');

        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Código de descuento'), {
            target: { value: 'NO-EXISTE' },
        });

        expect(
            screen.getByText('Código inválido o no disponible para esta cuenta.')
        ).toBeTruthy();

        expect(screen.queryByText(/Descuento \(/)).toBeNull();
        expect(screen.getByText('$48.500')).toBeTruthy();
    });

    it('impide confirmar la compra si el producto no tiene stock', () => {
        updateProduct('TC001', { stock: 0 });
        addToCart('TC001');

        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Nombre completo'), {
            target: { value: 'Ana Prueba' },
        });
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'ana@example.com' },
        });
        fireEvent.change(screen.getByLabelText('Teléfono'), {
            target: { value: '912345678' },
        });
        fireEvent.change(screen.getByLabelText('Dirección'), {
            target: { value: 'Calle de prueba 123' },
        });
        fireEvent.change(screen.getByLabelText('Comuna'), {
            target: { value: 'Santiago' },
        });
        fireEvent.change(screen.getByLabelText('Medio de pago'), {
            target: { value: 'Débito' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra' }));

        expect(
            screen.getByText(
                'No hay stock suficiente para Torta Cuadrada de Chocolate.'
            )
        ).toBeTruthy();
        expect(localStorage.getItem('mil-sabores-last-order')).toBeNull();
        expect(getProductById('TC001').stock).toBe(0);
        expect(getCart()).toEqual([{ productId: 'TC001', quantity: 1 }]);
    });

});