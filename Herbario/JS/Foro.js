const form = document.getElementById("comentarioForm");
const lista = document.getElementById("listaComentarios");

// Función para mostrar mensajes al usuario
function mostrarMensaje(mensaje, tipo = 'error') {
    // Eliminar mensajes anteriores
    const mensajesAnteriores = document.querySelectorAll('.mensaje-usuario');
    mensajesAnteriores.forEach(msg => msg.remove());
    
    // Crear nuevo mensaje
    const divMensaje = document.createElement('div');
    divMensaje.className = `mensaje-usuario ${tipo}`;
    divMensaje.textContent = mensaje;
    divMensaje.style.padding = '10px';
    divMensaje.style.margin = '10px 0';
    divMensaje.style.borderRadius = '4px';
    divMensaje.style.color = tipo === 'error' ? '#721c24' : '#155724';
    divMensaje.style.backgroundColor = tipo === 'error' ? '#f8d7da' : '#d4edda';
    divMensaje.style.border = `1px solid ${tipo === 'error' ? '#f5c6cb' : '#c3e6cb'}`;
    
    // Insertar mensaje después del formulario
    form.parentNode.insertBefore(divMensaje, form.nextSibling);
    
    // Auto-eliminarse después de 5 segundos
    setTimeout(() => {
        divMensaje.remove();
    }, 5000);
}

// Función para cargar los comentarios guardados
async function cargarComentarios() {
  try {
    // RUTA CORREGIDA: apuntando a php/comentarios.json en lugar de comentarios.json
    const res = await fetch("php/comentarios.json?nocache=" + Date.now());
    if (res.ok) {
      const comentarios = await res.json();
      lista.innerHTML = "";
      
      if (comentarios.length === 0) {
        lista.innerHTML = "<li>No hay comentarios aún. ¡Sé el primero en comentar!</li>";
        return;
      }
      
      comentarios.forEach(c => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${c.nombre}</strong> 
          <span style="font-size: 0.8em; color: #666;">${c.fecha ? formatFecha(c.fecha) : ''}</span>
          <p>${c.mensaje}</p>
        `;
        lista.appendChild(li);
      });
    } else {
      console.error("No se pudo cargar comentarios");
      lista.innerHTML = "<li>No hay comentarios aún</li>";
    }
  } catch (error) {
    console.error("Error al cargar comentarios:", error);
    lista.innerHTML = "<li>No hay comentarios aún</li>";
  }
}

// Formatear fecha para mostrar
function formatFecha(fechaStr) {
  try {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString();
  } catch (e) {
    return '';
  }
}

// Manejar envío del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  if (!nombre || !mensaje) {
    mostrarMensaje("Por favor, completa todos los campos", "error");
    return;
  }

  const nuevo = { nombre, mensaje };

  try {
    // Ruta corregida - apuntando a php/index.php
    const res = await fetch("php/index.php", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(nuevo)
    });

    // Verificar si la respuesta es JSON válido
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Respuesta no JSON del servidor:", text);
      mostrarMensaje("Error en la respuesta del servidor");
      return;
    }

    if (data.status === "ok") {
      mostrarMensaje("Comentario publicado con éxito", "success");
      cargarComentarios();
      form.reset();
    } else {
      console.error("Error al guardar comentario:", data.mensaje);
      mostrarMensaje(data.mensaje || "Error al publicar comentario");
    }
  } catch (error) {
    console.error("Error al enviar comentario:", error);
    mostrarMensaje("Error de conexión. Intenta nuevamente.");
  }
});

// Ocultar splash después de 3 segundos
window.addEventListener("load", () => {
  setTimeout(() => {
    const splash = document.getElementById("splash");
    if (splash) splash.style.display = "none";
  }, 3000);
  
  // Cargar comentarios al iniciar
  cargarComentarios();
});