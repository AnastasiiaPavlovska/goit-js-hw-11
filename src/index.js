import './css/styles.css';
import Notiflix from 'notiflix';
import NewApiService from './js/pixabay-api-service';
import 'simplelightbox/dist/simple-lightbox.min.css';

const REFS = {
    form: document.querySelector('.search-form'),
    boxImg: document.querySelector('.gallery'),
    btn: document.querySelector('.load-more'),
};

