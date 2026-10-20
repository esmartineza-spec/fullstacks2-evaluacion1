export default function PlaceholderPage({ title, description }) {
    return (
        <section className="card border-0 shadow-sm p-4 p-md-5">
            <p className="text-uppercase small fw-bold text-primary mb-2">
                Pastelería Mil Sabores
            </p>
            <h1 className="h2">{title}</h1>
            <p className="text-secondary mb-0">{description}</p>
        </section>
    );
}