import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '@fortawesome/fontawesome-free/js/all';
// import '@fortawesome/fontawesome-free/css/all.css';

export default class Markup {
  constructor({ selector }) {
    this.items = null;
    this.selector = selector;
    this.lightbox = null;
  }

  render() {
    const gallery = this.items
      .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
        return `<a class="card-link" href="${webformatURL}">
      <div class="photo-card">
      <div class="thumb">
        <img class="photo" src="${webformatURL}" alt="${tags}"  loading="lazy" />
      </div>
        <div class="info">
          <p class="info-item">
            <b><i class="fas fa-heart"></i></b>
            ${likes}
          </p>
          <p class="info-item">
            <b><i class="fas fa-eye"></i></b>
            ${views}
          </p>
          <p class="info-item">
            <b><i class="fas fa-comment-dots"></i></b>
            ${comments}
          </p>
          <p class="info-item">
            <b><i class="fas fa-download"></i></b>
            ${downloads}
          </p>
        </div>
      </div>
      </a>`;
      })
      .join('');

    this.selector.insertAdjacentHTML('beforeend', gallery);
    this.initModal('.gallery a');
  }

  initModal(selector) {
    this.lightbox = new SimpleLightbox(selector);
  }

  reset() {
    this.selector.innerHTML = '';
  }
}
