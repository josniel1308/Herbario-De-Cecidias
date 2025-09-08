<?php
// Configuración para desarrollo - permitir CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight requests de CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ruta del archivo donde se guardan los comentarios (en la misma carpeta php)
$archivo = 'comentarios.json';

// Verificar si se recibieron datos
$input = file_get_contents("php://input");
if (empty($input)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "mensaje" => "No se recibieron datos"]);
    exit;
}

// Decodificar los datos recibidos
$datos = json_decode($input, true);
if ($datos === null) {
    http_response_code(400);
    echo json_encode(["status" => "error", "mensaje" => "Datos JSON inválidos"]);
    exit;
}

// Validar que los campos necesarios existen
if (!isset($datos['nombre']) || !isset($datos['mensaje']) || 
    empty(trim($datos['nombre'])) || empty(trim($datos['mensaje']))) {
    http_response_code(400);
    echo json_encode(["status" => "error", "mensaje" => "Nombre y mensaje son requeridos"]);
    exit;
}

// Sanitizar los datos
$nombre = htmlspecialchars(trim($datos['nombre']));
$mensaje = htmlspecialchars(trim($datos['mensaje']));
$fecha = date('Y-m-d H:i:s');

// Cargar los comentarios existentes
if (file_exists($archivo)) {
    $contenido = file_get_contents($archivo);
    $comentarios = json_decode($contenido, true);
    
    // Si el archivo está corrupto o vacío, inicializar como array vacío
    if ($comentarios === null) {
        $comentarios = [];
    }
} else {
    $comentarios = [];
}

// Agregar el nuevo comentario al inicio con fecha
$nuevoComentario = [
    'nombre' => $nombre,
    'mensaje' => $mensaje,
    'fecha' => $fecha
];

array_unshift($comentarios, $nuevoComentario);

// Intentar guardar en el archivo JSON
if (file_put_contents($archivo, json_encode($comentarios, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
    http_response_code(500);
    echo json_encode(["status" => "error", "mensaje" => "Error al guardar el comentario. Verifica los permisos del archivo."]);
    exit;
}

// Respuesta exitosa al cliente
echo json_encode(["status" => "ok", "mensaje" => "Comentario guardado exitosamente"]);
?>