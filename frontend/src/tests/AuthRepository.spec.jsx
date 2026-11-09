import {
    calculateAge,
    createUserByAdmin,
    deleteUser,
    demoAdminCredentials,
    getCurrentUser,
    isAdmin,
    listUsers,
    loginUser,
    logoutUser,
    registerUser,
    updateUser,
} from '../services/authRepository.js';

const USERS_KEY = 'usuarios_mil_sabores_lista';
const SESSION_KEY = 'usuario_mil_sabores_activo';

const validUser = {
    nombre: 'Ana Prueba',
    email: 'ana@example.com',
    password: 'Clave123',
    fechaNacimiento: '1990-01-01',
    telefono: '912345678',
    direccion: 'Calle de prueba 123',
};

function dateAfterTomorrow() {
    const date = new Date();
    date.setDate(date.getDate() + 2);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

describe('authRepository', () => {
    beforeEach(() => {
        localStorage.removeItem(USERS_KEY);
        localStorage.removeItem(SESSION_KEY);
    });

    it('calcula cero años si la fecha falta o es inválida', () => {
        expect(calculateAge('')).toBe(0);
        expect(calculateAge('fecha-invalida')).toBe(0);
    });

    it('lista el administrador demo sin revelar su contraseña', () => {
        const users = listUsers();
        const admin = users.find(
            (user) => user.email === demoAdminCredentials.email
        );

        expect(admin).toBeTruthy();
        expect(admin.password).toBeUndefined();
    });

    it('registra un estudiante Duoc y crea su sesión sin revelar la contraseña', () => {
        const user = registerUser({
            ...validUser,
            nombre: ' Ana Prueba ',
            email: ' ANA@DUOCUC.CL ',
            fechaNacimiento: '1950-01-01',
        });

        expect(user.nombre).toBe('Ana Prueba');
        expect(user.email).toBe('ana@duocuc.cl');
        expect(user.esEstudianteDuoc).toBe(true);
        expect(user.descuentoSenior).toBe(true);
        expect(user.password).toBeUndefined();
        expect(getCurrentUser().email).toBe('ana@duocuc.cl');
    });

    it('rechaza registros con datos inválidos o correo duplicado', () => {
        expect(() => registerUser({ ...validUser, nombre: 'AB' }))
            .toThrowError('El nombre debe tener al menos 3 caracteres.');

        expect(() => registerUser({ ...validUser, email: 'correo-invalido' }))
            .toThrowError('Ingresa un correo válido.');

        expect(() => registerUser({ ...validUser, password: '123' }))
            .toThrowError('La contraseña debe tener al menos 8 caracteres.');

        expect(() => registerUser({
            ...validUser,
            fechaNacimiento: dateAfterTomorrow(),
        })).toThrowError('La fecha de nacimiento no puede estar en el futuro.');

        registerUser(validUser);

        expect(() => registerUser(validUser))
            .toThrowError('Ya existe una cuenta con ese correo.');
    });

    it('inicia sesión con el administrador demo y permite cerrar sesión', () => {
        const user = loginUser(
            demoAdminCredentials.email.toUpperCase(),
            demoAdminCredentials.password
        );

        expect(user.role).toBe('admin');
        expect(isAdmin()).toBe(true);

        logoutUser();

        expect(getCurrentUser()).toBeNull();
        expect(isAdmin()).toBe(false);
    });

    it('rechaza credenciales incorrectas', () => {
        expect(() => loginUser('nadie@example.com', 'incorrecta'))
            .toThrowError('Correo o contraseña incorrectos.');
    });

    it('permite que Admin cree un usuario sin iniciar sesión como ese usuario', () => {
        const user = createUserByAdmin(validUser);

        expect(user.email).toBe('ana@example.com');
        expect(user.password).toBeUndefined();
        expect(getCurrentUser()).toBeNull();
    });

    it('actualiza los datos del usuario que tiene la sesión activa', () => {
        registerUser(validUser);

        const updatedUser = updateUser('ANA@EXAMPLE.COM', {
            nombre: 'Ana Actualizada',
            telefono: '987654321',
            direccion: 'Nueva dirección 456',
        });

        expect(updatedUser.nombre).toBe('Ana Actualizada');
        expect(updatedUser.password).toBeUndefined();
        expect(getCurrentUser().nombre).toBe('Ana Actualizada');
    });

    it('rechaza actualizaciones de usuarios inexistentes, Admin o con nombre corto', () => {
        expect(() => updateUser('no-existe@example.com', { nombre: 'Nuevo' }))
            .toThrowError('No se encontró el usuario.');

        listUsers();

        expect(() => updateUser(demoAdminCredentials.email, { nombre: 'Nuevo Admin' }))
            .toThrowError('La cuenta administradora no se puede editar desde este panel.');

        registerUser(validUser);

        expect(() => updateUser(validUser.email, { nombre: 'AB' }))
            .toThrowError('El nombre debe tener al menos 3 caracteres.');
    });

    it('elimina al usuario de la sesión y rechaza eliminar al Admin', () => {
        registerUser(validUser);

        expect(deleteUser('ANA@EXAMPLE.COM')).toBe(true);
        expect(getCurrentUser()).toBeNull();
        expect(deleteUser(validUser.email)).toBe(false);

        expect(() => deleteUser(demoAdminCredentials.email))
            .toThrowError('No se puede eliminar una cuenta administradora.');
    });

    it('valida los datos al crear un usuario desde Admin', () => {
        expect(() => createUserByAdmin({ ...validUser, nombre: 'AB' }))
            .toThrowError('El nombre debe tener al menos 3 caracteres.');

        expect(() => createUserByAdmin({ ...validUser, email: 'correo-invalido' }))
            .toThrowError('Ingresa un correo válido.');

        expect(() => createUserByAdmin({ ...validUser, password: '123' }))
            .toThrowError('La contraseña debe tener al menos 8 caracteres.');

        expect(() => createUserByAdmin({
            ...validUser,
            fechaNacimiento: dateAfterTomorrow(),
        })).toThrowError('La fecha de nacimiento no puede estar en el futuro.');

        createUserByAdmin(validUser);

        expect(() => createUserByAdmin(validUser))
            .toThrowError('Ya existe una cuenta con ese correo.');
    });

    it('actualiza o elimina otro cliente sin alterar la sesión actual', () => {
        registerUser(validUser);

        const otherUser = createUserByAdmin({
            ...validUser,
            nombre: 'Beto Prueba',
            email: 'beto@example.com',
        });

        updateUser(otherUser.email, { nombre: 'Beto Actualizado' });

        expect(getCurrentUser().email).toBe('ana@example.com');

        expect(deleteUser(otherUser.email)).toBe(true);
        expect(getCurrentUser().email).toBe('ana@example.com');
    });
});