//PaginaHome
export function generateEventCard(event) {
  return `
    <div class="box-one ${event.category}">
      <div class="card" style="width: 14rem;">
        <img src="${event.image}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${event.name}</h5>
          <p class="card-text">${event.description}</p>
          <a href="./Assets/pages/details.html?name=${event.name}" class="btn btn-primary">More Details</a> 
        </div>
      </div>
    </div>
  `;
}

export function showEvents(events) {
  const eventosContainer = document.getElementById('eventos-container');
  eventosContainer.innerHTML = '';

  if (events.length === 0) {
    const noResultsMessage = document.createElement('h2');
    noResultsMessage.textContent = 'There are no search results. 🧐';
    eventosContainer.appendChild(noResultsMessage);
  } else {
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const eventCard = generateEventCard(event);
      eventosContainer.innerHTML += eventCard;
    }
  }
}

//SEARCH e INPUTS


// Funcion para crear un checkbox con una categoria dada
export function crearCheck(category) {
  const div = document.createElement('DIV')

  const input = document.createElement('INPUT')
  input.type = "checkbox"
  input.className = "form-check-input"
  input.value = category
  input.id = `${category}-check`
  input.name = "category"

  const label = document.createElement('LABEL')
  label.className = "form-check-label"
  label.setAttribute('for', `${category}-check`)
  label.textContent = category

  div.appendChild(input)
  div.appendChild(label)

  return div
}

// Funcion para agregar los checkboxes al DOM
export function pintarCheckbox(categories, elemento) {
  const div = document.getElementById('checkboxs')
  const fragment = document.createDocumentFragment()

  for (const category of categories) {
    const div = crearCheck(category)
    fragment.appendChild(div)
  }

  div.appendChild(fragment)

}
// FUNCION DE FILTRADO Y SEARCH
export function filtersN(eventosJs) {
  const searchInput = document.querySelector('.search input[type="search"]');
  let checkboxes = document.querySelectorAll('input[type="checkbox"]')
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', filterEvents);
  });

  searchInput.addEventListener('input', filterEvents);

  function filterEvents() {
    const checkboxesdiv = document.getElementById('checkboxs');
    const checkedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => (checkbox.value).toLowerCase());
    const searchValue = searchInput.value.toLowerCase();

    const filteredEvents = eventosJs.filter(event => {
      const eventName = event.name.toLowerCase();
      const eventDescription = event.description.toLowerCase();
      const eventCategory = event.category.toLowerCase();

      const matchesSearch = eventName.includes(searchValue) || eventDescription.includes(searchValue);
      const matchesCategories = checkedCategories.length === 0 || checkedCategories.includes(eventCategory);

      return matchesSearch && matchesCategories;
    });



    showEvents(filteredEvents);
  }
}

//PASTEVENTS




//stats

// Función para filtrar la capacidad
export function filteredCapacity(events) {
  return events.sort((a, b) => a.capacity - b.capacity);
}

// Función para filtrar la asistencia y el porcentaje de asistencia
export function filteredAssistanceAndPercentage(events) {
  return events
    .filter(event => event.assistance)
    .map(event => ({
      event: event.name,
      percentage: (event.assistance * 100 / event.capacity).toFixed(2)
    }))
    .sort((a, b) => a.percentage - b.percentage);
}

// Función para filtrar las ganancias
export function filteredRevenues(arrayA, arrayB) {
  return arrayA.map(category => {
    const categ = arrayB.filter(event => event.category === category);
    const revenues = categ.reduce((accumulator, event) => {
      const attendance = event.assistance || event.estimate;
      return accumulator + (attendance * event.price);
    }, 0);
    const percentages = (
      categ.reduce((accumulator, event) => {
        const attendance = event.assistance || event.estimate;
        return accumulator + (attendance * 100 / event.capacity);
      }, 0) / categ.length
    ).toFixed(2);
    return {
      category: category,
      revenue: revenues,
      percentage: percentages
    };
  });
}

// Función para crear la primera tabla
export function renderTable1(arrayA, arrayB, table) {
  const highPercent = arrayA[arrayA.length - 1];
  const lowPercent = arrayA[0];
  const highCapacity = arrayB[arrayB.length - 1];

  table.innerHTML = `
      <th colspan="3">Event statistics</th>
      <tr> 
        <td>Events with the highest Percentage of attendance</td>
        <td>Events with the lowest Percentage of attendance</td>
        <td>Event with larger capacity</td>
      </tr>
      <tr>
        <td>${highPercent.event} ${highPercent.percentage}%</td>
        <td>${lowPercent.event} ${lowPercent.percentage}%</td>
        <td>${highCapacity.name} ${highCapacity.capacity.toLocaleString()}</td>
      </tr>
    `;
}

// Función para crear las otras tablas
export function renderTables2(array, element) {
  const rows = array.map(event => `
      <tr>
        <td>${event.category}</td>
        <td>$ ${event.revenue.toLocaleString()}</td>
        <td>${event.percentage}%</td>
      </tr>
    `);

  element.innerHTML = rows.join('');
}

