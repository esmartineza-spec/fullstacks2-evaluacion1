const DISCOUNTS = {
    SENIOR: 50,
    DUOC: 20,
    FELICES50: 10,
};

/**
 * Calcula el mejor descuento disponible para la compra.
 * Los beneficios no se acumulan: se aplica solo el porcentaje mayor.
 */
export function calculateDiscount(subtotal, user, couponCode = '') {
    const amount = Number(subtotal);

    if (!Number.isFinite(amount) || amount < 0) {
        throw new Error('El subtotal debe ser un número igual o mayor que cero.');
    }

    const options = [];

    // Beneficio automático para personas de 50 años o más.
    if (user?.descuentoSenior || Number(user?.edad) >= 50) {
        options.push({
            percentage: DISCOUNTS.SENIOR,
            reason: 'Beneficio senior de 50 años o más',
        });
    }

    // Beneficio automático para quien se registró con correo Duoc.
    if (user?.esEstudianteDuoc) {
        options.push({
            percentage: DISCOUNTS.DUOC,
            reason: 'Beneficio estudiante Duoc UC',
        });
    }

    const code = String(couponCode).trim().toUpperCase();

    if (code === 'FELICES50') {
        options.push({
            percentage: DISCOUNTS.FELICES50,
            reason: 'Código FELICES50',
        });
    }

    // DUOCUMPLE solo se acepta para una cuenta Duoc.
    if (code === 'DUOCUMPLE' && user?.esEstudianteDuoc) {
        options.push({
            percentage: DISCOUNTS.DUOC,
            reason: 'Promoción de cumpleaños Duoc UC',
        });
    }

    const bestOption = options.reduce(
        (best, option) =>
            option.percentage > best.percentage ? option : best,
        { percentage: 0, reason: 'Sin descuento' }
    );

    const couponValid =
        !code ||
        code === 'FELICES50' ||
        (code === 'DUOCUMPLE' && user?.esEstudianteDuoc);

    return {
        percentage: bestOption.percentage,
        amount: Math.round(amount * bestOption.percentage / 100),
        reason: bestOption.reason,
        couponValid,
    };
}