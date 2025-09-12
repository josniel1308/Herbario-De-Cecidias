 const comentarioForm=document.getElementById('comentarioForm');
    const listaComentarios=document.getElementById('listaComentarios');
    const menuToggle=document.getElementById('menuToggle');
    const sidebar=document.getElementById('sidebar');
    const content=document.getElementById('content');

    // cargar comentarios del localStorage
    function cargarComentarios(){
      listaComentarios.innerHTML="";
      const comentarios=JSON.parse(localStorage.getItem('comentarios'))||[];
      if(comentarios.length===0){
        listaComentarios.innerHTML='<li class="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</li>';
      }else{
        comentarios.forEach(c=>{
          const li=document.createElement('li');
          li.innerHTML=`<strong>${c.nombre}</strong><p>${c.mensaje}</p><span class="fecha">${c.fecha}</span>`;
          listaComentarios.appendChild(li);
        });
      }
    }

    function guardarComentario(c){
      const comentarios=JSON.parse(localStorage.getItem('comentarios'))||[];
      comentarios.push(c);
      localStorage.setItem('comentarios',JSON.stringify(comentarios));
    }

    function mostrarMensaje(texto,tipo){
      const div=document.createElement('div');
      div.className=`mensaje-usuario ${tipo}`;
      div.textContent=texto;
      document.querySelector('.formulario').prepend(div);
      setTimeout(()=>div.remove(),3000);
    }

    comentarioForm.addEventListener('submit',e=>{
      e.preventDefault();
      const nombre=document.getElementById('nombre').value.trim();
      const mensaje=document.getElementById('mensaje').value.trim();
      if(nombre && mensaje){
        const comentario={id:Date.now(),nombre,mensaje,fecha:new Date().toLocaleString('es-ES')};
        guardarComentario(comentario);
        comentarioForm.reset();
        cargarComentarios();
        mostrarMensaje('¡Comentario publicado con éxito!','success');
      }else{
        mostrarMensaje('Por favor, completa todos los campos.','error');
      }
    });

    menuToggle.addEventListener('click',()=>{
      sidebar.classList.toggle('active');
      content.classList.toggle('shifted');
      const icon=menuToggle.querySelector('i');
      if(sidebar.classList.contains('active')){
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      }else{
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // iniciar
    cargarComentarios();