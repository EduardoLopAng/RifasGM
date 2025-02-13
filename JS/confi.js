// D:\Joyeria GM\JS\configuracion.js
 contrasenaAnfitrion = '123456'; // Contraseña inicial, cambiar aquí si es necesario

function verificarAnfitrion() {
    const password = document.getElementById('password').value;
    if (password === contrasenaAnfitrion) {
        document.getElementById('configuracion-anfitrion').style.display = 'block';
        document.getElementById('formulario-anfitrion').style.display = 'none';
    } else {
        alert('Contraseña incorrecta. Por favor, intenta nuevamente.');
    }
}

function mostrarMensajeCambios() {
    const mensaje = document.getElementById('mensaje-cambios');
    mensaje.style.display = 'block';
    setTimeout(() => {
        mensaje.style.display = 'none';
        location.href = 'Rifas_PaginaPrincipal.html'; // Redirigir a la página principal de la rifa
    }, 2000);
}

function guardarConfiguracion() {
    const nuevoNombreRifa = document.getElementById('nuevo-nombre-rifa').value;
    const nuevaFechaRifa = document.getElementById('nueva-fecha-rifa').value;
    const nuevoCostoBoleto = document.getElementById('nuevo-costo-boleto').value;
    const nuevaContrasena = document.getElementById('nueva-contrasena').value;
    if (nuevoNombreRifa) {
        localStorage.setItem('nombre-rifa', nuevoNombreRifa);
    }
    if (nuevaFechaRifa) {
        localStorage.setItem('fecha-rifa', nuevaFechaRifa);
    }
    if (nuevoCostoBoleto) {
        localStorage.setItem('costo-boleto', nuevoCostoBoleto);
    }
    if (nuevaContrasena) {
        contrasenaAnfitrion = nuevaContrasena;
    }
    mostrarMensajeCambios();
}

function resetearRifa() {
    if (confirm('¿Estás seguro de que deseas resetear la rifa?')) {
        localStorage.removeItem('participantes');
        alert('Rifa reseteada');
        location.href = 'Rifas_PaginaPrincipal.html'; // Redirigir a la página principal de la rifa
    }
}
