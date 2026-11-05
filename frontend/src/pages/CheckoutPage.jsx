import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../data/products.js';
import { clearCart, getCart } from '../services/cartRepository.js';
import { getProductById } from '../services/productRepository.js';
import { getCurrentUser } from '../services/authRepository.js';
import { calculateDiscount } from '../services/discountRules.js';
import { saveOrderToHistory } from '../services/orderRepository.js';


function FormField({ label, name, value, onChange, error, type = 'text' }) {
    const inputId = `checkout-${name}`;

    return (
        <div className="mb-3">
            <label htmlFor={inputId} className="form-label">{label}</label>
            <input
                id={inputId}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className={`form-control ${error ? 'is-invalid' : ''}`}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}

export default function CheckoutPage() {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();
    const [form, setForm] = useState({
        name: currentUser?.nombre || '',
        email: currentUser?.email || '',
        phone: currentUser?.telefono || '',
        address: currentUser?.direccion || '',
        commune: '',
        paymentMethod: '',
    });
    const [errors, setErrors] = useState({});
    const [couponCode, setCouponCode] = useState('');

    const items = getCart()
        .map((item) => ({
            ...item,
            product: getProductById(item.productId),
        }))
        .filter((item) => item.product);

    const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const discount = calculateDiscount(subtotal, currentUser, couponCode);

    const shipping = subtotal > 0 ? 3500 : 0;
    const total = Math.max(0, subtotal - discount.amount) + shipping;

// El subtotal ya incluye IVA; este cálculo lo separa para mostrarlo
// en el detalle, igual que hacía el HTML original.
    const iva = Math.round(total * 0.19 / 1.19);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        const nextErrors = {};
        const digits = form.phone.replace(/\D/g, '');

        if (form.name.trim().length < 3) {
            nextErrors.name = 'Ingresa tu nombre completo.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            nextErrors.email = 'Ingresa un correo válido.';
        }
        if (digits.length < 8 || digits.length > 15) {
            nextErrors.phone = 'Ingresa un teléfono válido.';
        }
        if (form.address.trim().length < 5) {
            nextErrors.address = 'Ingresa una dirección válida.';
        }
        if (form.commune.trim().length < 2) {
            nextErrors.commune = 'Ingresa tu comuna.';
        }
        if (!form.paymentMethod) {
            nextErrors.paymentMethod = 'Selecciona un medio de pago.';
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        const order = {
            code: `MS-${Date.now()}`,
            customer: form,
            items: items.map(({ product, quantity }) => ({
                productId: product.id,
                name: product.name,
                unitPrice: product.price,
                quantity,
            })),
            subtotal,
            discountPercentage: discount.percentage,
            discountAmount: discount.amount,
            discountReason: discount.reason,
            shipping,
            iva,
            couponCode: couponCode.trim().toUpperCase(),
            total,
            accountEmail: currentUser?.email || form.email,
        };

        localStorage.setItem('mil-sabores-last-order', JSON.stringify(order));
        saveOrderToHistory(order);
        clearCart();
        navigate('/compra/exito');
    }

    if (items.length === 0) {
        return (
            <section className="card border-0 shadow-sm p-4">
                <h1 className="h2">No hay productos para comprar</h1>
                <Link to="/categorias" className="btn btn-primary align-self-start">
                    Ver productos
                </Link>
            </section>
        );
    }

    return (
        <section className="row g-4 checkout-layout">
            <div className="col-lg-7">
                <div className="card checkout-panel checkout-form-card">
                    <h1 className="h2 mb-4">Datos de compra</h1>

                    <form noValidate onSubmit={handleSubmit}>
                        <FormField
                            label="Nombre completo"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                            autoComplete="name"
                        />
                        <FormField
                            label="Correo electrónico"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                            autoComplete="email"
                        />
                        <FormField
                            label="Teléfono"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            error={errors.phone}
                            autoComplete="tel"
                        />
                        <FormField
                            label="Dirección"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            error={errors.address}
                            autoComplete="street-address"
                        />
                        <FormField
                            label="Comuna"
                            name="commune"
                            value={form.commune}
                            onChange={handleChange}
                            error={errors.commune}
                            autoComplete="address-level2"
                        />

                        <div className="mb-4">
                            <label htmlFor="checkout-paymentMethod" className="form-label">
                                Medio de pago
                            </label>
                            <select
                                id="checkout-paymentMethod"
                                name="paymentMethod"
                                value={form.paymentMethod}
                                onChange={handleChange}
                                className={`form-select ${errors.paymentMethod ? 'is-invalid' : ''}`}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="Débito">Tarjeta de débito</option>
                                <option value="Transferencia">Transferencia</option>
                            </select>
                            {errors.paymentMethod && (
                                <div className="invalid-feedback">{errors.paymentMethod}</div>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Confirmar compra
                        </button>
                    </form>
                </div>
            </div>

            <aside className="col-lg-5 checkout-summary-column">
                <div className="card checkout-panel checkout-summary-card">
                    <h2 className="h4">Resumen</h2>

                    {items.map(({ product, quantity }) => (
                        <div
                            key={product.id}
                            className="d-flex justify-content-between gap-3 py-2 checkout-summary-item"
                        >
                            <span>{product.name} × {quantity}</span>
                            <span>{formatPrice(product.price * quantity)}</span>
                        </div>
                    ))}

                    <div className="mb-3 checkout-coupon">
                        <label htmlFor="checkout-coupon" className="form-label">
                            Código de descuento
                        </label>
                        <input
                            id="checkout-coupon"
                            type="text"
                            className="form-control"
                            value={couponCode}
                            onChange={(event) => setCouponCode(event.target.value)}
                            placeholder="Ej.: FELICES50"
                        />

                        {couponCode.trim() && (
                            <small className={discount.couponValid ? 'text-success' : 'text-danger'}>
                                {discount.couponValid
                                    ? 'Código reconocido.'
                                    : 'Código inválido o no disponible para esta cuenta.'}
                            </small>
                        )}
                    </div>

                    <hr />

                    <p className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>{formatPrice(subtotal)}</span>
                    </p>

                    {discount.amount > 0 && (
                        <p className="d-flex justify-content-between text-success mb-2">
                <span>
                    Descuento ({discount.percentage}% · {discount.reason}):
                </span>
                            <span>-{formatPrice(discount.amount)}</span>
                        </p>
                    )}

                    <p className="d-flex justify-content-between mb-2">
                        <span>Despacho:</span>
                        <span>{formatPrice(shipping)}</span>
                    </p>

                    <p className="d-flex justify-content-between text-secondary mb-2">
                        <span>IVA incluido:</span>
                        <span>{formatPrice(iva)}</span>
                    </p>

                    <p className="fs-5 fw-bold d-flex justify-content-between mb-0">
                        <span>Total:</span>
                        <span>{formatPrice(total)}</span>
                    </p>
                </div>
            </aside>
        </section>
    );
}