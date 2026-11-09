import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    createCategory,
    deleteCategory,
    listCategories,
    subscribeCategories,
    updateCategory,
} from '../services/categoryRepository.js';
import { listProducts } from '../services/productRepository.js';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState(() => listCategories());
    const [form, setForm] = useState({ id: '', label: '' });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        return subscribeCategories(() => setCategories(listCategories()));
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setError('');
        setMessage('');
    }

    function resetForm() {
        setForm({ id: '', label: '' });
        setEditingId(null);
    }

    function handleSubmit(event) {
        event.preventDefault();

        try {
            if (editingId) {
                updateCategory(editingId, { label: form.label });
                setMessage('Categoría actualizada correctamente.');
            } else {
                createCategory(form);
                setMessage('Categoría creada correctamente.');
            }

            setError('');
            resetForm();
        } catch (saveError) {
            setError(saveError.message);
        }
    }

    function handleEdit(category) {
        setEditingId(category.id);
        setForm({ id: category.id, label: category.label });
        setError('');
        setMessage('');
    }

    function handleDelete(category) {
        const hasProducts = listProducts().some(
            (product) => product.category === category.id
        );

        if (hasProducts) {
            setError(
                'No puedes eliminar esta categoría mientras tenga productos asociados.'
            );
            setMessage('');
            return;
        }

        if (!window.confirm(`¿Eliminar la categoría "${category.label}"?`)) {
            return;
        }

        deleteCategory(category.id);
        setError('');
        setMessage('Categoría eliminada correctamente.');

        if (editingId === category.id) resetForm();
    }

    return (
        <section className="admin-page">
            <header className="admin-dashboard-header">
                <div>
                    <p className="catalog-eyebrow">Administración</p>
                    <h1 className="h2">Gestión de categorías</h1>
                    <p className="text-secondary">
                        Crea categorías para organizar los productos de la tienda.
                    </p>
                </div>

                <Link to="/admin" className="btn btn-outline-primary">
                    Volver al Dashboard
                </Link>
            </header>

            <div className="card admin-panel admin-form-panel mb-4">
                <h2 className="h4">
                    {editingId ? 'Editar categoría' : 'Crear categoría'}
                </h2>

                <form onSubmit={handleSubmit} noValidate>
                    {!editingId && (
                        <div className="mb-3">
                            <label htmlFor="category-id" className="form-label">
                                Identificador
                            </label>
                            <input
                                id="category-id"
                                name="id"
                                className="form-control"
                                value={form.id}
                                onChange={handleChange}
                                placeholder="Ej.: sin-azucar"
                                required
                            />
                            <div className="form-text">
                                Usa minúsculas, números y guiones. Este identificador
                                se vincula con los productos.
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="category-label" className="form-label">
                            Nombre visible
                        </label>
                        <input
                            id="category-label"
                            name="label"
                            className="form-control"
                            value={form.label}
                            onChange={handleChange}
                            placeholder="Ej.: Productos sin azúcar"
                            minLength="3"
                            required
                        />
                    </div>

                    {error && <p className="text-danger" role="alert">{error}</p>}
                    {message && <p className="text-success" role="status">{message}</p>}

                    <button type="submit" className="btn btn-primary me-2">
                        {editingId ? 'Guardar cambios' : 'Crear categoría'}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={resetForm}
                        >
                            Cancelar edición
                        </button>
                    )}
                </form>
            </div>

            <div className="card admin-panel admin-products-panel">
                <h2 className="h4">
                    Categorías registradas ({categories.length})
                </h2>

                <div className="table-responsive">
                    <table className="table admin-table align-middle">
                        <thead>
                        <tr>
                            <th>Identificador</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.label}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => handleEdit(category)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(category)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}