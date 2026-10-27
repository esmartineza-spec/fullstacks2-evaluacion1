import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CategoriesPage from '../pages/CategoriesPage.jsx';

function renderCategoriesPage() {
    return render(
        <MemoryRouter>
            <CategoriesPage />
        </MemoryRouter>
    );
}

describe('CategoriesPage', () => {
    beforeEach(() => {
        localStorage.removeItem('mil-sabores-products');
    });

    it('muestra los 16 productos del catálogo', () => {
        renderCategoriesPage();

        expect(screen.getByText('16 producto(s) encontrados')).toBeTruthy();
        expect(
            screen.getByRole('heading', { name: 'Torta Cuadrada de Chocolate' })
        ).toBeTruthy();
    });

    it('filtra los productos por categoría', () => {
        renderCategoriesPage();

        fireEvent.click(screen.getByRole('button', { name: 'Sin Gluten' }));

        expect(screen.getByText('2 producto(s) encontrados')).toBeTruthy();
        expect(
            screen.getByRole('heading', { name: 'Brownie Sin Gluten' })
        ).toBeTruthy();
        expect(
            screen.queryByRole('heading', { name: 'Torta Cuadrada de Chocolate' })
        ).toBeNull();
    });

    it('busca productos por nombre', () => {
        renderCategoriesPage();

        fireEvent.change(
            screen.getByRole('searchbox', { name: 'Buscar productos' }),
            { target: { value: 'brownie' } }
        );

        expect(screen.getByText('1 producto(s) encontrados')).toBeTruthy();
        expect(
            screen.getByRole('heading', { name: 'Brownie Sin Gluten' })
        ).toBeTruthy();
    });

    it('muestra un aviso cuando no hay resultados', () => {
        renderCategoriesPage();

        fireEvent.change(
            screen.getByRole('searchbox', { name: 'Buscar productos' }),
            { target: { value: 'producto-inexistente' } }
        );

        expect(
            screen.getByText('No encontramos productos con esos criterios.')
        ).toBeTruthy();
    });
});