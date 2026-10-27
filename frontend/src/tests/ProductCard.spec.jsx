import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard.jsx';

describe('ProductCard', () => {
    it('muestra los datos y el enlace del producto', () => {
        const product = {
            id: 'TEST001',
            name: 'Torta de prueba',
            category: 'especiales',
            price: 55000,
            description: 'Torta creada para la prueba.',
            image: '/img/producto_TE001.avif',
        };

        render(
            <MemoryRouter>
                <ProductCard product={product} />
            </MemoryRouter>
        );

        expect(
            screen.getByRole('heading', { name: product.name })
        ).toBeTruthy();

        expect(
            screen.getByRole('img', { name: product.name })
        ).toBeTruthy();

        expect(
            screen.getByText(product.description)
        ).toBeTruthy();

        const detailLink = screen.getByRole('link', { name: 'Ver detalle' });
        expect(detailLink.getAttribute('href')).toBe('/productos/TEST001');
    });
});