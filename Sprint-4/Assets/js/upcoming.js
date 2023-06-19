const eventosContainer = document.getElementById('eventos-container');
const searchInput = document.querySelector('.search input[type="search"]');

fetch("https://mindhub-xj03.onrender.com/api/amazing")
  .then(response => response.json())
  .then(data => {
    let eventosJs = data.events.filter(event => {
      const eventoDate = new Date(event.date);
      const eventYear = eventoDate.getFullYear();
      return eventYear === 2023;
    });

    const checkboxesdiv = document.getElementById('checkboxs');
    const categories = eventosJs.map(event => event.category);
    const categoriesSinRepetidos = new Set(categories);
    const arrayCategoriesSinRepetidos = Array.from(categoriesSinRepetidos);
    pintarCheckbox(arrayCategoriesSinRepetidos, checkboxesdiv);

    showUpcomingEvents(eventosJs);
    filtersN(eventosJs);
  })
  .catch(err => console.log(err));

function generateEventCard(event) {
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

function showUpcomingEvents(events) {
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


function crearCheck(category) {
  const div = document.createElement('DIV');

  const input = document.createElement('INPUT');
  input.type = "checkbox";
  input.className = "form-check-input";
  input.value = category;
  input.id = `${category}-check`;
  input.name = "category";

  const label = document.createElement('LABEL');
  label.className = "form-check-label";
  label.setAttribute('for', `${category}-check`);
  label.textContent = category;

  div.appendChild(input);
  div.appendChild(label);

  return div;
}

function pintarCheckbox(categories, elemento) {
  const div = document.getElementById('checkboxs');
  const fragment = document.createDocumentFragment();

  for (const category of categories) {
    const div = crearCheck(category);
    fragment.appendChild(div);
  }

  div.appendChild(fragment);
}

function filtersN(eventosJs) {
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', filterEvents);
  });

  searchInput.addEventListener('input', filterEvents);

  function filterEvents() {
    const checkboxesdiv = document.getElementById('checkboxs');
    const checkedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value.toLowerCase());
    const searchValue = searchInput.value.toLowerCase();

    const filteredEvents = eventosJs.filter(event => {
      const eventName = event.name.toLowerCase();
      const eventDescription = event.description.toLowerCase();
      const eventCategory = event.category.toLowerCase();

      const matchesSearch = eventName.includes(searchValue) || eventDescription.includes(searchValue);
      const matchesCategories = checkedCategories.length === 0 || checkedCategories.includes(eventCategory);

      return matchesSearch && matchesCategories;
    });

    showUpcomingEvents(filteredEvents);
  }
}
