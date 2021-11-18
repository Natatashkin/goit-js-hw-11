import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '14467768-9171c4f16b15a9d8391496270';
const PER_PAGE = 40;
let lightbox = null;
let totalPages = null;
let searchQuery = '';
let page = 1;

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onloadMoreBtnClick);

// Submit handler
async function onFormSubmit(e) {
  e.preventDefault();

  refs.gallery.innerHTML = '';
  hideLoadMoreBtn();

  page = 1;

  searchQuery = refs.form.elements.searchQuery.value.trim();

  try {
    await initFetchQueryAndRender(searchQuery);
  } catch (error) {
    Notify.failure(error.message);
  }

  refs.form.reset();
}

// Load More Button
async function onloadMoreBtnClick() {
  page += 1;
  await initFetchQueryAndRender(searchQuery);
  lightbox.refresh();
  pageScroll();
}

function displayingLoadMoreBtn() {
  if (page === totalPages) {
    hideLoadMoreBtn();
    Notify.info("We're sorry, but you've reached the end of search results.");
    return;
  }

  refs.loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

// Fetch API
function createSeachOptions(query) {
  return new URLSearchParams({
    key: `${API_KEY}`,
    q: `${query}`,
    page,
    per_page: `${PER_PAGE}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });
}

async function fetchImages(options) {
  const response = await axios.get(`${BASE_URL}?${options}`);
  const data = await response.data;

  if (data.total === 0) {
    throw new Error('Sorry, there are no images matching your search query. Please try again.');
  }
  const images = await data.hits;

  if (options.get('page') === '1') {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  totalPages = Math.ceil(data.totalHits / PER_PAGE);

  return images;
}

async function initFetchQueryAndRender(searchQuery) {
  const query = await fetchImages(createSeachOptions(searchQuery));
  renderMarkup(query);
}

// Render murkup
function renderMarkup(items) {
  const galleryItems = items;

  const gallery = galleryItems
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<a class="card-link" href="${webformatURL}">
      <div class="photo-card">
      <div class="thumb">
        <img class="photo" src="${webformatURL}" alt="${tags}"  loading="lazy" />
      </div>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
      </div>
      </a>`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', gallery);
  lightbox = new SimpleLightbox('.gallery a');
  displayingLoadMoreBtn();
}

// Прокрутка
function pageScroll() {
  const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
