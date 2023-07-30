import './css/styles.css';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import NewApiService from './js/pixabay-api-service.js';

const REFS = {
    form: document.querySelector('#search-form'),
    boxImg: document.querySelector('.gallery'),
    btn: document.querySelector('.load-more'),
};

const newApiService = new NewApiService();
hideBtn();
REFS.form.addEventListener('submit', onSearch);
REFS.btn.addEventListener('click', fetchImg);

function onSearch(event) {
    event.preventDefault();

    newApiService.query = event.currentTarget.elements[0].value.trim();
    if (!newApiService.query) {
        Notiflix.Notify.failure('Please clarify your search');
        return;
    }
    clearMarkup();
    newApiService.resetPage();
    fetchImg();
}

async function fetchImg() {
    hideBtn();
    try {
        const data = await newApiService.fetchImg();
        checkData(data);
        createNotifTotalHits(data);
        checkEndList(data);
        simpleLightbox.refresh();
    } catch (error) {
        console.log(error.message);
    }
}

function checkEndList(data) {
    const { totalHits, hits } = data;
    if (
      totalHits <= (newApiService.page - 1) * newApiService.perPage &&
      hits.length > 0
    ) {
      hideBtn();
  
      return Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  }
  
  function checkData(data) {
    const { hits } = data;
    if (hits.length === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    makeMarkup(hits);
  }
  
  function createNotifTotalHits(data) {
    const { totalHits, hits } = data;
    if (newApiService.page === 2 && hits.length > 0) {
      return Notiflix.Notify.info(`Hooray! We found ${totalHits} images..`);
    }
  }
  
  function makeMarkup(hits) {
    const markUp = hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
          <div class="photo-card">     <a class="gallery__item"              
                        href="${largeImageURL}"><img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                    
                        <div class="info">
                          <p class="info-item"><b>Likes</b> ${likes}</p>
                          <p class="info-item"><b>Views</b> ${views}</p>
                          <p class="info-item"><b>Comments</b> ${comments}</p>
                          <p class="info-item"><b>Downloads</b> ${downloads}</p>
                        </div>
                        </a>
                  </div>
                  `;
        }
      )
      .join('');
  
    REFS.boxImg.insertAdjacentHTML('beforeend', markUp);
    showBtn();
  
    if (newApiService.page > 2) {
      scroll();
    }
  
    //   initInfinityLoading(hits);
  }
  
  function clearMarkup() {
    REFS.boxImg.innerHTML = '';
  }
  function scroll() {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
  
  function initInfinityLoading(hits) {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && hits.length > 0) {
            fetchImg();
          }
  
          console.log(entry);
          console.log(entry.isIntersecting);
        }
      },
      { rootMargin: '400px' }
    );
  
    observer.observe(REFS.btn);
  }
  
  //About button
  function showBtn() {
    REFS.btn.classList.remove('is-hidden');
  }
  function hideBtn() {
    REFS.btn.classList.add('is-hidden');
  }
  
  //SimpleLightbox
  let simpleLightbox = new SimpleLightbox('.photo-card a', {});
  