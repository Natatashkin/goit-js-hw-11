import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesAPIService from './js/ImagesAPIServise';
import LoadMoreBtn from './js/loadMoreBtn';
import Markup from './js/renderMarkup';
import Preloader from './js/preloader';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const imagesAPIService = new ImagesAPIService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more' });
const renderMarkup = new Markup({ selector: refs.gallery });
const preloader = new Preloader({ selector: '.preloader' });

refs.form.addEventListener('submit', onFormSubmit);
loadMoreBtn.button.addEventListener('click', onloadMoreBtnClick);

// Submit handler
async function onFormSubmit(e) {
  e.preventDefault();
  renderMarkup.reset();
  loadMoreBtn.hideBtn();
  imagesAPIService.query = e.currentTarget.searchQuery.value.trim();

  if (imagesAPIService.query === '') {
    loadMoreBtn.hideBtn();
    Notify.info('Your query is empty. Try again!');
    return;
  }

  imagesAPIService.resetPage();

  try {
    await initFetchImages();
  } catch (error) {
    preloader.hide();
    loadMoreBtn.hideBtn();
    Notify.failure(error.message);
  }

  refs.form.reset();
}

// Load-More Button handler
async function onloadMoreBtnClick() {
  loadMoreBtn.hideBtn();
  await initFetchImages();
  pageScroll();
  renderMarkup.lightbox.refresh();
}

// Send request
async function initFetchImages() {
  preloader.show();
  const images = await imagesAPIService.fetchImages();
  renderMarkup.items = images;
  preloader.hide();
  renderMarkup.render();

  if (imagesAPIService.endOfHits) {
    preloader.hide();
    loadMoreBtn.hideBtn();
    return;
  }
  loadMoreBtn.showBtn();
}

// Scroll page
function pageScroll() {
  const { height: formHeight } = refs.form.getBoundingClientRect();
  const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2 - formHeight * 2,
    behavior: 'smooth',
  });
}
