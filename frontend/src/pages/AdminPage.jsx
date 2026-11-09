import { useEffect, useState } from 'react';
import { formatPrice } from '../data/products.js';
import {
    listCategories,
    subscribeCategories,
} from '../services/categoryRepository.js';
import {
    createProduct,
    deleteProduct,
    listProducts,
    subscribeProducts,
    updateProduct,
} from '../services/productRepository.js';

const emptyForm = {
    id: '',
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    stock: '10',
};

export default function AdminPage() {
    const [products, setProducts] = useState(() => listProducts());
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [categories, setCategories] = useState(() => listCategories());
    const stock = Number(form.stock);

    useEffect(() => {
        return subscribeProducts(() => setProducts(listProducts()));
    }, []);
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
        setForm(emptyForm);

        setEditingId(null);
    }

    function handleSubmit(event) {
        event.preventDefault();

        const price = Number(form.price);

        if (form.name.trim().length < 3) {
            setError('El nombre debe tener al menos 3 caracteres.');
            return;
        }
        if (!form.category) {
            setError('Selecciona una categoría.');
            return;
        }
        if (!Number.isFinite(price) || price <= 0) {
            setError('El precio debe ser mayor que cero.');
            return;
        }
        if (form.description.trim().length < 5) {
            setError('La descripción debe tener al menos 5 caracteres.');
            return;
        }
        if (!form.image.trim()) {
            setError('Ingresa la ruta de la imagen.');
            return;
        }
        if (form.stock.trim() === '' || !Number.isInteger(stock) || stock < 0) {
            setError('El stock debe ser un número entero igual o mayor que cero.');
            return;
        }

        const productData = {
            id: form.id.trim(),
            name: form.name.trim(),
            category: form.category,
            price,
            description: form.description.trim(),
            image: form.image.trim(),
            stock,
        };

        try {
            if (editingId) {
                updateProduct(editingId, productData);
                setMessage('Producto actualizado correctamente.');
            } else {
                createProduct(productData);
                setMessage('Producto creado correctamente.');
            }

            setError('');
            resetForm();
        } catch (saveError) {
            setError(saveError.message);
        }
    }

    function handleEdit(product) {
        setEditingId(product.id);
        setForm({
            id: product.id,
            name: product.name,
            category: product.category,
            price: String(product.price),
            description: product.description,
            image: product.image,
            stock: String(product.stock ?? 0),
        });
        setError('');
        setMessage('');
    }

    function handleDelete(product) {
        const confirmed = window.confirm(
            `¿Quieres eliminar "${product.name}"?`
        );

        if (!confirmed) return;

        deleteProduct(product.id);
        setMessage('Producto eliminado correctamente.');

        if (editingId === product.id) {
            resetForm();
        }
    }
//FORMULARIOS
    return (
        <section className="admin-page">
            <h1 className="h2 mb-4">Administración de productos</h1>

            <div className="card admin-panel admin-form-panel">
                <h2 className="h4">
                    {editingId ? 'Editar producto' : 'Crear producto'}
                </h2>

                <form onSubmit={handleSubmit} noValidate>
                    {!editingId && (
                        <div className="mb-3">
                            <label htmlFor="product-id" className="form-label">
                                Código (opcional)
                            </label>
                            <input
                                id="product-id"
                                name="id"
                                value={form.id}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ejemplo: DEMO001"
                            />
                            <div className="form-text">
                                Si lo dejas vacío, se generará automáticamente.
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="product-name" className="form-label">
                            Nombre
                        </label>
                        <input
                            id="product-name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="product-category" className="form-label">
                                Categoría
                            </label>
                            <select
                                id="product-category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories
                                    .filter((category) => category.id !== 'todas')
                                    .map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.label}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="product-price" className="form-label">
                                Precio en pesos
                            </label>
                            <input
                                id="product-price"
                                name="price"
                                type="number"
                                min="1"
                                value={form.price}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="product-stock" className="form-label">
                            Stock disponible
                        </label>
                        <input
                            id="product-stock"
                            name="stock"
                            type="number"
                            min="0"
                            step="1"
                            value={form.stock}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="product-description" className="form-label">
                            Descripción
                        </label>
                        <textarea
                            id="product-description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="form-control"
                            rows="3"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="product-image" className="form-label">
                            Ruta de la imagen
                        </label>
                        <input
                            id="product-image"
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="/img/producto_nuevo.jpg"
                        />
                    </div>

                    {error && <p className="text-danger" role="alert">{error}</p>}
                    {message && <p className="text-success" role="status">{message}</p>}

                    <button type="submit" className="btn btn-primary me-2">
                        {editingId ? 'Guardar cambios' : 'Crear producto'}
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
                <h2 className="h4">Productos registrados ({products.length})</h2>

                <div className="table-responsive">
                    <table className="table admin-table align-middle">
                        <thead>
                        <tr>
                            <th>Código</th>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>

                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{formatPrice(product.price)}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => handleEdit(product)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(product)}
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