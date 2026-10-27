import { fireEvent, render, screen } from '@testing-library/react';
import AdminPage from '../pages/AdminPage.jsx';

describe('AdminPage', () => {
    beforeEach(() => {
        localStorage.removeItem('mil-sabores-products');
    });

    it('muestra un error si el nombre tiene menos de tres caracteres', () => {
        render(<AdminPage />);

        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: 'AB' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

        expect(screen.getByRole('alert').textContent)
            .toBe('El nombre debe tener al menos 3 caracteres.');
        expect(screen.getByText('Productos registrados (16)')).toBeTruthy();
    });

    it('conserva el producto si se cancela su eliminación', () => {
        const confirmacion = spyOn(window, 'confirm').and.returnValue(false);
        render(<AdminPage />);

        fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]);

        expect(confirmacion).toHaveBeenCalled();
        expect(screen.getByText('Productos registrados (16)')).toBeTruthy();
    });
});