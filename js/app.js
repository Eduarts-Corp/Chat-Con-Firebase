console.log('funcionando');

const nombreUsuario = document.querySelector('#nombreUsuario')
const btnIngreso = document.querySelector('#btnIngreso');
const btnCerrarSesion = document.querySelector('#btnCerrarSesion');
const contenidoWeb = document.querySelector('#contenidoWeb');
const formulario = document.querySelector('#formulario');
const texto = document.querySelector('#texto'); 

const contenidoChat = user => {
    formulario.addEventListener('submit', e => {
        e.preventDefault();
        console.log(texto.value);
        if (!texto.value.trim()) {
            console.log('Texto Vacio');
            return;
        }

        firebase.firestore().collection('whatsapp').add({
            texto: texto.value,
            uid: user.uid,
            fecha: Date.now()
        }).then(res => {
            console.log('Texto Agragado a FIrestore');
        })

        texto.value = '';

    })

    firebase.firestore().collection("whatsapp").orderBy('fecha')
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                console.log(" add whatsapp: ", change.doc.data());

                if (user.uid === change.doc.data().uid) {
                    contenidoWeb.innerHTML += `
                    <div class="text-end">
                        <span class="badge bg-primary">${change.doc.data().texto}</span>
                    </div>
                    `
                } else {
                    contenidoWeb.innerHTML += `
                    <div class="text-start">
                        <span class="badge bg-secondary">${change.doc.data().texto}</span>
                    </div>
                    `
                }

                contenidoWeb.scrollTop = contenidoWeb.scrollHeight;
            }
            // if (change.type === "modified") {
            //     console.log("Modified whatsapp: ", change.doc.data());
            // }
            // if (change.type === "removed") {
            //     console.log("Removed whatsapp: ", change.doc.data());
            // }
        });
    });
}



firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      contenidoWeb.innerHTML = '';
      console.log(user)
      accionCerrarSesion();
      nombreUsuario.innerHTML = user.displayName;
      contenidoChat(user)
      
      
  } else {     
      accionAcceder();
      nombreUsuario.innerHTML = 'Fuera de Linea';
      contenidoWeb.innerHTML = `
         <p class="lead mt-5 text-center border">Debes iniciar Sesión</p>`  
  }
});


const accionAcceder = () => {
    console.log('Sin Usuario Registrado');
    formulario.classList.add('d-none');
   

    btnIngreso.addEventListener('click', async() => {
        console.log('Quieres Iniciar Sesión');
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await firebase.auth().signInWithPopup(provider);
        } catch (error) {
            console.log(error);
        }
    })
}


const accionCerrarSesion = () => {
    console.log('Usuario Registrado');
    formulario.classList.remove('d-none');
    btnCerrarSesion.addEventListener('click', () => {
        console.log('Me diste click cerrar Sesión');
        firebase.auth().signOut()
    })
}




