import { generateEventCard, showEvents, crearCheck, pintarCheckbox, filtersN } from '../module/functions.js';




fetch("https://mindhub-xj03.onrender.com/api/amazing")
  .then(response => response.json())
  .then(data => {
    let eventosJs = data.events
    const checkboxesdiv = document.getElementById('checkboxs');
    const categories = data.events.map(event => event.category);
    const categoriesSinRepetidos = new Set(categories);
    const arrayCategoriesSinRepetidos = Array.from(categoriesSinRepetidos);
    pintarCheckbox(arrayCategoriesSinRepetidos, checkboxesdiv);

    showEvents(eventosJs)
    filtersN(eventosJs)

  })
  .catch(err => console.log(err))

// EVENTOS DE IMAGENES
