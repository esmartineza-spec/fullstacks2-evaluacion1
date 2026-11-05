import { Link } from 'react-router-dom';

const offers = [
    {
        title: 'Cupón FELICES50',
        discount: '10% de descuento',
        description: 'Ingresa el código FELICES50 durante el checkout.',
        note: 'No se acumula con otros descuentos; se aplica el beneficio más alto.',
    },
    {
        title: 'Beneficio estudiante Duoc UC',
        discount: '20% de descuento',
        description: 'Se aplica automáticamente al comprar con una cuenta registrada con correo @duocuc.cl.',
        note: 'No necesitas ingresar un cupón.',
    },
    {
        title: 'Beneficio senior',
        discount: '50% de descuento',
        description: 'Se aplica automáticamente a clientes de 50 años o más, según la fecha de nacimiento registrada.',
        note: 'No se acumula con otros descuentos; se aplica el beneficio más alto.',
    },
];

export default function OffersPage() {
    return (
        <main className="offers-page">
            <div className="mb-4">
                <h1 className="h2 offer-title">Ofertas y beneficios</h1>
                <p className="text-secondary">
                    Revisa los descuentos disponibles antes de realizar tu compra.
                </p>
            </div>

            <div className="row g-4 offers-grid">
                {offers.map((offer) => (
                    <div className="col-12 col-md-6 col-lg-4" key={offer.title}>
                        <article className="card h-100 shadow-sm offer-card">
                            <div className="card-body d-flex flex-column">
                                <h2 className="h4">{offer.title}</h2>
                                <p className="fs-5 fw-bold text-success offer-discount">
                                    {offer.discount}
                                </p>
                                <p>{offer.description}</p>
                                <p className="small text-secondary mt-auto">
                                    {offer.note}
                                </p>
                            </div>
                        </article>
                    </div>
                ))}
            </div>

            <Link to="/categorias" className="btn btn-primary mt-4">
                Ver productos
            </Link>
        </main>
    );
}