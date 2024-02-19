import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const errorElement = document.querySelector('.error');

try {
  loader.classList.remove('hidden');
  fetchBreeds().then(data => renderSelect(data));
} catch (error) {
  console.log(error);
}

function renderSelect(breeds) {
  const markup = breeds
    .map(({ id, name }) => {
      return `<option value="${id}">${name}</option>`;
    })
    .join('');
  breedSelect.insertAdjacentHTML('beforeend', markup);
  loader.classList.add('hidden');
}

breedSelect.addEventListener('change', e => {
  catInfo.innerHTML = '';
  loader.classList.remove('hidden');
  fetchCatByBreed(e.target.value)
    .then(data => {
      renderCat(data[0]);
      loader.classList.add('hidden');
    })
    .catch(error => {
      console.error('Error fetching cat by breed:', error);
      loader.classList.add('hidden');
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    });
});

function renderCat(catData) {
  const { url } = catData;
  const { description, name, temperament } = catData.breeds[0];
  const catContainer = document.createElement('div');
  catContainer.classList.add('cat-container');
  const catImage = document.createElement('img');
  catImage.src = url;
  catImage.alt = name;
  catContainer.appendChild(catImage);
  const catInfoContainer = document.createElement('div');
  catInfoContainer.classList.add('cat-info-container');
  const catName = document.createElement('h2');
  catName.textContent = name;
  const catTemperament = document.createElement('p');
  catTemperament.innerHTML = `<strong>Temperament:</strong> ${temperament}`;
  const catDescription = document.createElement('p');
  catDescription.textContent = description;
  catInfoContainer.appendChild(catName);
  catInfoContainer.appendChild(catDescription);
  catInfoContainer.appendChild(catTemperament);
  catContainer.appendChild(catInfoContainer);
  catInfo.appendChild(catContainer);
  loader.classList.add('hidden');
  Notiflix.Loading.remove();
}

//   fetchCatByBreed(e.target.value).then(data => renderCat(data[0]));

// function renderCat(catData) {
//   const { url } = catData;
//   const { description, name, temperament } = catData.breeds[0];
//   catInfo.insertAdjacentHTML(
//     'beforeend',
//     `<div>
//         <h2>${name}</h2>
//         <img src="${url}" alt="${name}" />
//         <p>${description}</p>
//         <p><strong>Temperament:</strong> ${temperament}</p>
//     </div>`
//   );
//   loader.classList.add('hidden');
// }

// new SlimSelect({
//   select: '#slim-select',
// });
