import { Link } from 'react-router-dom';

export default function PaymentErrorPage() {
    return (
        <main className="container py-5 text-center">
            <div className="alert alert-warning mx-auto" role="alert">
                <h1 className="h2">No se pudo completar la compra</h1>
                <p className="mb-0">
                    El pago no fue confirmado. Puedes revisar tu carrito e intentarlo nuevamente.
                </p>
            </div>

            <div className="d-flex justify-content-center gap-2 mt-4">
                <Link to="/carrito" className="btn btn-primary">
                    Revisar carrito
                </Link>
                <Link to="/categorias" className="btn btn-outline-secondary">
                    Volver a la tienda
                </Link>
            </div>
        </main>
    );
}