/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

/* A quick filter that will return something based on a matching input */

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function injectHTML(list) {
  console.log('fired injectHTML')
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = '';
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str
  })
}

function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  })

function cutRestaurantList(list) {
  console.log('fired cut list');
  const range = [...Array(15).keys()];
  return newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length -1);
    return list[index]
  })
}
  /*
    Using the .filter array method,
    return a list that is filtered by comparing the item name in lower case
    to the query in lower case
    Ask the TAs if you need help with this
  */
}

function initMap() {
const carto = L.map('map').setView([38.98, -76.93], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(carto);
return carto
}

function markerPlace(array, map) {
console.log('array for markers', array);

map.eachLayer((layer) => {
if (layer instanceof L.Marker) {
layer.remove();
}
});

array.forEach((item) => {
console.log('markerPlace', item);
const {coordinates} = item.geocoded_column_1;

L.marker([coordinates[1], coordinates[0]]).addTo(map)
})
}

async function mainEvent() { // the async keyword means we can make API requests
  const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
  const filterButton = document.querySelector('#filter_button');
  const loadDataButton = document.querySelector('#data_load');
  const generateListButton = document.querySelector('#generate');
  const textField = document.querySelector('#resto');
  // Add a querySelector that targets your filter button here

  const loadAnimation = document.querySelector('#data_load_animation');
  loadAnimation.style.display = 'none';
  generateListButton.style.display.add = ('hidden');

  const carto = initMap();

  const storedData = localStorage.getItem('storedData')
  let parsedData = JSON.parse(storedData)
  if (parsedData?.length > 0) {
  generateListButton.classList.remove('hidden')
  }

  let currentList = []; // this is "scoped" to the main event function

  /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  mainForm.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
    console.log('Loading data');
    loadAnimation.style.display = 'inline-block';
    // This prevents your page from becoming a list of 1000 records from the county, even if your form still has an action set on it
    submitEvent.preventDefault();

    // this is substituting for a "breakpoint" - it prints to the browser to tell us we successfully submitted the form
    console.log('form submission');

    /*
      ## GET requests and Javascript
        We would like to send our GET request so we can control what we do with the results
        Let's get those form results before sending off our GET request using the Fetch API

      ## Retrieving information from an API
        The Fetch API is relatively new,
        and is much more convenient than previous data handling methods.
        Here we make a basic GET request to the server using the Fetch method to the county
    */

    // Basic GET request - this replaces the form Action
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');

    // This changes the response from the GET into data we can use - an "object"

    const storedList = await results.json();
    localStorage.setItem('storedData', JSON.stringify(storedList));
    if (storedList.length > 0) {
      generateListButton.classList.remove('hidden');
    }

    /*
      This array initially contains all 1,000 records from your request,
      but it will only be defined _after_ the request resolves - any filtering on it before that
      simply won't work.
    */
    loadAnimation.style.display = "none";
    // console.table(storedList);
  });



  filterButton.addEventListener('click', (event) => {
      console.log('clicked filterButton');

      const formData = new FormData(mainForm);
      const formProps = Object.fromEntries(formData);

      console.log(formProps);
      const newList = filterList(currentList, formProps.resto);

      console.log(newList);
      injectHTML(newList);
  })

  generateListButton.addEventListener('click', (event) => {
    console.log('generate new list');
    const recalList = localStorage.getItem('storedData');
    console.log('what is the type of recalList:', typeof recalList);

    currentList = cutRestaurantList(storedList);
    console.log(currentList);
    injectHTML(currentList);
  })

  textField.addEventListener('input', (event) => {
    console.log('input', event.target.value);
    const newList = filterList(currentList, event.target.value);
    console.log(newList);
    injectHTML(newList);
  })
  /*
    Now that you HAVE a list loaded, write an event listener set to your filter button
    it should use the 'new FormData(target-form)' method to read the contents of your main form
    and the Object.fromEntries() method to convert that data to an object we can work with
    When you have the contents of the form, use the placeholder at line 7
    to write a list filter
    Fire it here and filter for the word "pizza"
    you should get approximately 46 results
  */
}

/*
  This adds an event listener that fires our main event only once our page elements have loaded
  The use of the async keyword means we can "await" events before continuing in our scripts
  In this case, we load some data when the form has submitted
*/
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
