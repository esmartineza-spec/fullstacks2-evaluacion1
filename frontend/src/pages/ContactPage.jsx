import { useState } from 'react';

export default function ContactPage() {
    const [sent, setSent] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        setSent(true);
        event.currentTarget.reset();
    }

    return (
        <main>
            <h1 className="h2 mb-3">Contáctanos</h1>
            <p className="text-secondary">
                Déjanos tu consulta y te ayudaremos.
            </p>

            {sent && (
                <div className="alert alert-success" role="status">
                    Tu mensaje quedó registrado. Gracias por contactarnos.
                </div>
            )}

            <form className="card card-body shadow-sm" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="contact-name" className="form-label">
                        Nombre
                    </label>
                    <input
                        id="contact-name"
                        name="name"
                        className="form-control"
                        type="text"
                        minLength="3"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="contact-email" className="form-label">
                        Correo electrónico
                    </label>
                    <input
                        id="contact-email"
                        name="email"
                        className="form-control"
                        type="email"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="contact-message" className="form-label">
                        Mensaje
                    </label>
                    <textarea
                        id="contact-message"
                        name="message"
                        className="form-control"
                        rows="5"
                        minLength="10"
                        required
                    />
                </div>

                <button className="btn btn-primary align-self-start" type="submit">
                    Enviar mensaje
                </button>
            </form>
        </main>
    );
}