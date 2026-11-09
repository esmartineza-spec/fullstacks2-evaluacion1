import { fireEvent, render, screen } from '@testing-library/react';
import AdminPage from '../pages/AdminPage.jsx';

describe('AdminPage', () => {
    beforeEach(() => {
        localStorage.removeItem('mil-sabores-products');
        localStorage.removeItem('mil-sabores-categories');
    });

    it('muestra un error si no se selecciona una categoría', () => {
        render(<AdminPage />);

        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: 'Torta de prueba' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

        expect(screen.getByRole('alert').textContent)
            .toBe('Selecciona una categoría.');
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

    it('muestra un error si el precio no es mayor que cero', () => {
        render(<AdminPage />);

        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: 'Torta de prueba' },
        });

        const categoria = screen.getByLabelText('Categoría');
        const primeraCategoria = Array.from(categoria.options)
            .find((option) => option.value);

        fireEvent.change(categoria, {
            target: { value: primeraCategoria.value },
        });

        const camposNumericos = screen.getAllByRole('spinbutton');

        fireEvent.change(camposNumericos[0], {
            target: { value: '0' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

        expect(screen.getByRole('alert').textContent)
            .toBe('El precio debe ser mayor que cero.');
    });

    it('muestra un error si la descripción tiene menos de cinco caracteres', () => {
        render(<AdminPage />);

        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: 'Torta de prueba' },
        });

        const categoria = screen.getByLabelText('Categoría');
        const primeraCategoria = Array.from(categoria.options)
            .find((option) => option.value);

        fireEvent.change(categoria, {
            target: { value: primeraCategoria.value },
        });

        fireEvent.change(screen.getAllByRole('spinbutton')[0], {
            target: { value: '10000' },
        });

        fireEvent.change(screen.getByLabelText('Descripción'), {
            target: { value: 'abc' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

        expect(screen.getByRole('alert').textContent)
            .toBe('La descripción debe tener al menos 5 caracteres.');
    });

    it('muestra un error si no se ingresa la ruta de la imagen', () => {
        render(<AdminPage />);

        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: 'Torta de prueba' },
        });

        const categoria = screen.getByLabelText('Categoría');
        const primeraCategoria = Array.from(categoria.options)
            .find((option) => option.value);

        fireEvent.change(categoria, {
            target: { value: primeraCategoria.value },
        });

        fireEvent.change(screen.getAllByRole('spinbutton')[0], {
            target: { value: '10000' },
        });

        fireEvent.change(screen.getByLabelText('Descripción'), {
            target: { value: 'Descripción válida' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

        expect(screen.getByRole('alert').textContent)
            .toBe('Ingresa la ruta de la imagen.');
    });

    it('muestra un error si el stock es negativo', () => {
        render(<AdminPage />);

        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: 'Torta de prueba' },
        });

        const categoria = screen.getByLabelText('Categoría');
        const primeraCategoria = Array.from(categoria.options)
            .find((option) => option.value);

        fireEvent.change(categoria, {
            target: { value: primeraCategoria.value },
        });

        const camposNumericos = screen.getAllByRole('spinbutton');

        fireEvent.change(camposNumericos[0], {
            target: { value: '10000' },
        });

        fireEvent.change(screen.getByLabelText('Descripción'), {
            target: { value: 'Descripción válida' },
        });

        fireEvent.change(screen.getByLabelText(/imagen/i), {
            target: { value: '/img/torta-prueba.jpg' },
        });

        fireEvent.change(camposNumericos[1], {
            target: { value: '-1' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

        expect(screen.getByRole('alert').textContent)
            .toBe('El stock debe ser un número entero igual o mayor que cero.');
    });

    it('crea un producto válido y muestra confirmación', () => {
        render(<AdminPage />);

        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: 'Torta nueva de prueba' },
        });

        const categoria = screen.getByLabelText('Categoría');
        const primeraCategoria = Array.from(categoria.options)
            .find((option) => option.value);

        fireEvent.change(categoria, {
            target: { value: primeraCategoria.value },
        });

        const camposNumericos = screen.getAllByRole('spinbutton');

        fireEvent.change(camposNumericos[0], {
            target: { value: '12000' },
        });

        fireEvent.change(screen.getByLabelText('Descripción'), {
            target: { value: 'Producto válido para la prueba' },
        });

        fireEvent.change(screen.getByLabelText(/imagen/i), {
            target: { value: '/img/torta-prueba.jpg' },
        });

        fireEvent.change(camposNumericos[1], {
            target: { value: '5' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

        expect(screen.getByText('Producto creado correctamente.')).toBeTruthy();
    });

    it('elimina un producto cuando se confirma la acción', () => {
        const confirmacion = spyOn(window, 'confirm').and.returnValue(true);
        render(<AdminPage />);

        fireEvent.click(
            screen.getAllByRole('button', { name: 'Eliminar' })[0]
        );

        expect(confirmacion).toHaveBeenCalled();
        expect(screen.getByText('Productos registrados (15)')).toBeTruthy();
        expect(screen.getByText('Producto eliminado correctamente.')).toBeTruthy();
    });

    it('permite editar el nombre de un producto existente', () => {
        render(<AdminPage />);

        fireEvent.click(
            screen.getAllByRole('button', { name: /editar/i })[0]
        );

        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: 'Torta actualizada' },
        });

        fireEvent.click(
            screen.getByRole('button', { name: /guardar|actualizar/i })
        );

        expect(screen.getByText('Producto actualizado correctamente.')).toBeTruthy();
        expect(screen.getByText('Torta actualizada')).toBeTruthy();
    });

    it('sale del modo de edición si elimina el producto que estaba editando', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        render(<AdminPage />);

        fireEvent.click(
            screen.getAllByRole('button', { name: /editar/i })[0]
        );

        fireEvent.click(
            screen.getAllByRole('button', { name: 'Eliminar' })[0]
        );

        expect(screen.getByText('Productos registrados (15)')).toBeTruthy();
        expect(
            screen.getByRole('button', { name: 'Crear producto' })
        ).toBeTruthy();
    });
});