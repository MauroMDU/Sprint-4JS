import { filteredAssistanceAndPercentage, filteredCapacity, filteredRevenues, renderTable1, renderTables2 } from "../module/functions.js";

const url = "https://mindhub-xj03.onrender.com/api/amazing";
let table1 = document.getElementById('table1');
let tableUpcomingEvent = document.getElementById('upcommingEventsTable');
let tablePastEvent = document.getElementById('pastEventsTable');

fetch(url)
  .then(response => response.json())
  .then(data => {
    let currentDate = new Date(data.currentDate);
    let upcomingEvents = data.events.filter(event => (new Date(event.date) > currentDate));
    let pastEvents = data.events.filter(event => (new Date(event.date) < currentDate));
    let upcomingEventCategories = [...new Set(upcomingEvents.map(event => event.category))];
    let pastEventsCategories = [...new Set(pastEvents.map(event => event.category))];
    let assistanceAndPercentage = filteredAssistanceAndPercentage(data.events);
    let eventsCapacity = filteredCapacity(data.events);
    let pastValues = filteredRevenues(pastEventsCategories, pastEvents);
    let upcomingValues = filteredRevenues(upcomingEventCategories, upcomingEvents);
    renderTable1(assistanceAndPercentage, eventsCapacity, table1);
    renderTables2(pastValues, tablePastEvent);
    renderTables2(upcomingValues, tableUpcomingEvent);
  });
