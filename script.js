const countriesList = document.querySelector('.countries-list');
const number = document.querySelector('.number');
const input = document.querySelector('input');
const sortBtns = document.querySelectorAll('.sort');
const chartsBtns = document.querySelectorAll('.charts-btn');
const listInfo = document.querySelector('.list-info');
const chartLanguages = document.querySelector('.chart-languages');
const chartPopulation = document.querySelector('.chart-population');
let storedCountries = [...countries];
let isAZ = false;

number.textContent = countries.length;

// Filter and sorting Functions

// generating the initial list of countries
function listGenerator(countries) {
  countriesList.innerHTML = '';
  countries.forEach((newCountry, index) => {
    country = document.createElement('div');
    content = `<p class='p-flag'><img src='${newCountry.flag}'></p>
    <p class='p-name'>${newCountry.name}</p>
      <p class='p-capital'>Capital:</br>${newCountry.capital}</p>
      <p class='p-language'>Official Languages:</br>${newCountry.languages.join(
        ', '
      )}</p>
      <p class='p-population'>Population:</br>${newCountry.population.toLocaleString()}</p>`;
    country.innerHTML = content;
    country.classList.add('country');
    countriesList.appendChild(country);
    index % 2 != 0
      ? country.classList.add('odd')
      : country.classList.add('even');
  });
}
// filtering the list based on the name||capital||language
function filterCountries() {
  let search = input.value;
  let countriesFilter = countries.filter(country => {
    return (
      country.name.toUpperCase().includes(search.toUpperCase()) ||
      country.capital.toUpperCase().includes(search.toUpperCase()) ||
      country.languages
        .join('')
        .toUpperCase()
        .includes(search.toUpperCase())
    );
  });
  search != ''
    ? (listInfo.innerHTML = `<b>We found you <span class='red'>${
        countriesFilter.length
      }</span> Countries</b>`)
    : (listInfo.innerHTML = '');
  storedCountries = countriesFilter;
  listGenerator(countriesFilter);
}
// sort the selection by name
function sortName() {
  filterCountries(countries.reverse());
}
// sort the selection by capital
function sortCapital() {
  if (isAZ)
    (isAZ = false),
      storedCountries.sort((a, b) => {
        if (a.capital.toUpperCase() > b.capital.toUpperCase()) return -1;
      });
  else
    (isAZ = true),
      storedCountries.sort((a, b) => {
        if (a.capital.toUpperCase() < b.capital.toUpperCase()) return -1;
      });
  listGenerator(storedCountries);
}
// sort the selection by population size
function sortPopulation() {
  if (isAZ)
    (isAZ = false),
      storedCountries.sort((a, b) => {
        if (a.population > b.population) return -1;
      });
  else
    (isAZ = true),
      storedCountries.sort((a, b) => {
        if (a.population < b.population) return -1;
      });
  listGenerator(storedCountries);
}
// checking what button is clicked and the corresponding ran functions
function btnChecker() {
  this.querySelector('.fas').classList.toggle('fa-sort-alpha-up');
  sortBtns.forEach(button => {
    if (this.classList != button.classList)
      button.querySelector('.fas').classList.remove('fa-sort-alpha-up');

    button.classList.remove('checked');
    if (this.classList.contains('name'))
      sortName(), this.classList.add('checked');
    else if (this.classList.contains('capital'))
      sortCapital(), this.classList.add('checked');
    else if (this.classList.contains('population'))
      sortPopulation(), this.classList.add('checked');
  });
}

// Top10 functions

let totalPopulation = countries.reduce((a, b) => a + b.population, 0);
console.log(totalPopulation);
// let totalLanguages = topLanguages.reduce((a, b) => a + b[1], 0);
// console.log(totalLanguages);

// get the top10 population of the selection
function top10Population() {
  topPopulation = storedCountries
    .sort((a, b) => {
      if (a.population > b.population) return -1;
    })
    .slice(0, 10);
  graphGeneratorPop(topPopulation);
}
// get the top10 languages of the selection
function top10Languages() {
  let map = new Map();
  storedCountries.forEach(country => {
    country.languages.forEach(language => {
      if (map.has(language)) map.set(language, map.get(language) + 1);
      else map.set(language, 1);
    });
  });
  topLanguages = Array.from(map)
    .sort((a, b) => {
      if (a[1] > b[1]) return -1;
    })
    .slice(0, 10);
  graphGeneratorLang(topLanguages);
}

// generating the chart for the population
function graphGeneratorPop() {
  chartPopulation.innerHTML = '';
  let header = document.createElement('h2');
  header.innerHTML = `<span class='red'>Most</span> <span class='yellow'>Populated</span> <span class='blue'>Countries</span>`;
  chartPopulation.appendChild(header);
  topPopulation.forEach(country => {
    let bar = document.createElement('div');
    let width = (country.population / topPopulation[0].population) * 100 + '%';
    content = `<span class='bar' style='width:${width}'></span><p>${
      country.name
    }: ${country.population.toLocaleString()}</p>`;
    bar.innerHTML = content;
    chartPopulation.appendChild(bar);
  });
}
// generating the chart for the langauges
function graphGeneratorLang() {
  chartLanguages.innerHTML = '';
  let header = document.createElement('h2');
  header.innerHTML = `<span class='green'>Most</span> <span class='red'>Spoken</span> <span class='blue'>Languages</span>`;
  chartLanguages.appendChild(header);
  topLanguages.forEach(language => {
    let bar = document.createElement('div');
    bar.innerHTML = '';
    let width = (language[1] / topLanguages[0].slice(1)) * 100 + '%';
    content = `<span class='bar' style='width:${width}'></span><p>${
      language[0]
    }: ${language[1]}</p>`;
    bar.innerHTML = content;
    chartLanguages.appendChild(bar);
  });
}
// checking which button is checked to make the charts appear or not
function chartBtnChecker() {
  this.classList.toggle('active');
  if (this.classList.contains('active'))
    if (this.classList.contains('lang-btn'))
      document.querySelector('.chart-languages').style.display = 'block';
    else document.querySelector('.chart-population').style.display = 'block';
  else
    document.querySelector(`.chart-${this.dataset.chart}`).style.display =
      'none';
}

// Functions calls and eventListener
listGenerator(countries);
top10Languages();
top10Population();

input.addEventListener('keyup', filterCountries);
input.addEventListener('keyup', top10Languages);
input.addEventListener('keyup', top10Population);
sortBtns.forEach(button => button.addEventListener('click', btnChecker));
chartsBtns.forEach(button => button.addEventListener('click', chartBtnChecker));
