// Constante que almacena el elemento con ID = "IMGrande"
const IMGrande = document.getElementById("IMGrande");

// Constante que almacena el elemento con ID = "img"
let img = document.getElementById("img");

// Constantes que almacena los elementos de cerrar
const EquisCerrar = document.getElementById("EquisCerrar");

// Obtener el contenedor de la galería
const galleryGrid = document.getElementById("galleryGrid");

// Vista previa de archivos subidos y evitar repetidos
const archivosSubidos = new Set();
const archivoInput = document.getElementById('archivoInput');
const mensajeError = document.getElementById('mensajeError');
const formSubida = document.getElementById('formSubida');

// Inicializar la galería
function inicializarGaleria() {
    // Obtener todos los elementos con clase gallery_item
    let gallery_Items = document.querySelectorAll(".gallery_item");
    
    // Recorrer todos los elementos de la galería
    gallery_Items.forEach((elemento, i) => {
        // Para cada elemento, agrega un evento click
        elemento.addEventListener("click", (e) => {
            // Encontrar la imagen dentro del div
            const imagen = elemento.querySelector('img');
            
            // Mostrar en el elemento imagen de IMGrande a la que se le da click
            IMGrande.style.display = "flex";
            img.src = imagen.src;
        });
    });
}

// Inicializar la galería al cargar la página
document.addEventListener('DOMContentLoaded', inicializarGaleria);

// Se oculta la imagen grande al dar click sobre la x
EquisCerrar.addEventListener("click", (e) => {
    IMGrande.style.display = "none";
});

// Se oculta la imagen grande al dar click alrededor de ella
IMGrande.addEventListener("click", (e) => {
    if(e.target.classList.contains("IMGrande")) {
        IMGrande.style.display = "none";
    }
});

// Se oculta la imagen grande al presionar la tecla Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && IMGrande.style.display === "flex") {
        IMGrande.style.display = "none";
    }
});

// Función para agregar una imagen a la galería
function agregarImagenAGaleria(src, nombre) {
    const nuevoItem = document.createElement('div');
    nuevoItem.className = 'gallery_item';
    
    const nuevaImagen = document.createElement('img');
    nuevaImagen.src = src;
    nuevaImagen.alt = nombre;
    
    nuevoItem.appendChild(nuevaImagen);
    galleryGrid.appendChild(nuevoItem);
    
    // Agregar el evento click a la nueva imagen
    nuevoItem.addEventListener('click', () => {
        IMGrande.style.display = "flex";
        img.src = src;
    });
}

// Manejar el envío del formulario
formSubida.addEventListener('submit', function(e) {
    e.preventDefault();
    mensajeError.textContent = '';
    const archivos = Array.from(archivoInput.files);
    let repetido = false;

    archivos.forEach(archivo => {
        if (archivosSubidos.has(archivo.name)) {
            repetido = true;
        } else if (archivo.type.startsWith('image/')) {
            archivosSubidos.add(archivo.name);
            
            const reader = new FileReader();
            reader.onload = function(e) {
                agregarImagenAGaleria(e.target.result, archivo.name);
            };
            reader.readAsDataURL(archivo);
        }
    });

    if (repetido) {
        mensajeError.textContent = 'Uno o más archivos ya fueron subidos.';
    } else if (archivos.length === 0) {
        mensajeError.textContent = 'Por favor, selecciona al menos una imagen.';
    } else {
        mensajeError.textContent = 'Imágenes subidas correctamente.';
        mensajeError.style.color = '#4caf50';
        
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
            mensajeError.textContent = '';
        }, 3000);
    }

    archivoInput.value = '';
});
// Ocultar splash después de 5 segundos
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("splash").style.display = "none";
    }, 3000);
});