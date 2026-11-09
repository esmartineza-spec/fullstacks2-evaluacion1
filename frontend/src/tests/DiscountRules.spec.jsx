import { calculateDiscount } from '../services/discountRules.js';

describe('calculateDiscount', () => {
    it('no aplica descuento si el cliente no cumple beneficios ni ingresa código', () => {
        expect(calculateDiscount(1000, null)).toEqual({
            percentage: 0,
            amount: 0,
            reason: 'Sin descuento',
            couponValid: true,
        });
    });

    it('rechaza un subtotal negativo o no numérico', () => {
        expect(() => calculateDiscount(-1, null))
            .toThrowError('El subtotal debe ser un número igual o mayor que cero.');

        expect(() => calculateDiscount(Number.NaN, null))
            .toThrowError('El subtotal debe ser un número igual o mayor que cero.');
    });

    it('aplica el beneficio senior al cumplir 50 años', () => {
        const result = calculateDiscount(1000, { edad: 50 });

        expect(result.percentage).toBe(50);
        expect(result.amount).toBe(500);
        expect(result.reason).toBe('Beneficio senior de 50 años o más');
    });

    it('aplica el beneficio automático de estudiante Duoc', () => {
        const result = calculateDiscount(1000, { esEstudianteDuoc: true });

        expect(result.percentage).toBe(20);
        expect(result.amount).toBe(200);
    });

    it('reconoce FELICES50 aunque tenga espacios y minúsculas', () => {
        const result = calculateDiscount(1000, null, ' felices50 ');

        expect(result.percentage).toBe(10);
        expect(result.amount).toBe(100);
        expect(result.couponValid).toBe(true);
    });

    it('acepta DUOCUMPLE solo para un estudiante Duoc', () => {
        const studentResult = calculateDiscount(
            1000,
            { esEstudianteDuoc: true },
            'DUOCUMPLE'
        );

        const regularResult = calculateDiscount(
            1000,
            { esEstudianteDuoc: false },
            'DUOCUMPLE'
        );

        expect(studentResult.percentage).toBe(20);
        expect(studentResult.couponValid).toBe(true);
        expect(regularResult.percentage).toBe(0);
        expect(regularResult.couponValid).toBe(false);
    });

    it('aplica solo el mayor descuento, sin acumular beneficios', () => {
        const result = calculateDiscount(
            1000,
            { edad: 60, esEstudianteDuoc: true },
            'FELICES50'
        );

        expect(result.percentage).toBe(50);
        expect(result.amount).toBe(500);
        expect(result.reason).toBe('Beneficio senior de 50 años o más');
    });

    it('redondea el monto del descuento al peso', () => {
        const result = calculateDiscount(1055, null, 'FELICES50');

        expect(result.amount).toBe(106);
    });

    it('marca como inválido un código desconocido', () => {
        const result = calculateDiscount(1000, null, 'CODIGO-ERROR');

        expect(result.percentage).toBe(0);
        expect(result.couponValid).toBe(false);
    });
});