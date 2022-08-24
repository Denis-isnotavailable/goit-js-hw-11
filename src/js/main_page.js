import Notiflix from 'notiflix';
import fetchPage from './fetch_page';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_URL = 'https://pixabay.com/api/';
const API_KEY = '29475888-3f29fbe102866df87d5390f6d';
let pageNumber = 1;
let requestPics = '';
let pageCounter = 0;

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

formEl.addEventListener('submit', showPics);
loadMoreBtnEl.addEventListener('click', loadNextPage);

let gallery = new SimpleLightbox('.gallery a');


function showPics(e) {
    e.preventDefault();
    
    loadBtnDeactevated();

    if (requestPics !== e.currentTarget.searchQuery.value) {
        galleryEl.innerHTML = '';
        pageNumber = 1;
        pageCounter = 0;        
    }

    requestPics = e.currentTarget.searchQuery.value;

    let currentUrl = createCurrentUrl(requestPics, pageNumber);
    
    loadPage(currentUrl);   
    
}

function loadNextPage(e) {
    pageNumber += 1;
    console.log();
    let currentUrl = createCurrentUrl(requestPics, pageNumber);
    
    loadPage(currentUrl);
}

function createCurrentUrl(requestPics, pageNumber) {
    return `${API_URL}?key=${API_KEY}&q=${requestPics.trim()}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`;
}


function loadPage(currentUrl) {
    fetchPage(currentUrl)
        .then(({ data }) => {  
            console.log(data);
            pageCounter += data.hits.length;            
            
            if (data.hits.length === 0) {
                return Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
            }

            if (pageNumber === 1) {
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
            }
            
            
            galleryEl.insertAdjacentHTML('beforeend', createGallery(data));
            loadBtnActevated();
            gallery.refresh();

            if (pageCounter === data.totalHits) {
                loadBtnDeactevated();
                Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");               
            }
        })
        .catch(error => {
        Notiflix.Notify.failure(`Something go wrong. Error: ${error}`);
    });
}


function createGallery(data) {
    return data.hits.map(pic => {
        return `<a href="${pic.largeImageURL}" class="photo-card">
                        <img src="${pic.webformatURL}" alt="${pic.tags}" loading="lazy" width="320" height="180" />
                        <div class="info">
                            <p class="info-item">
                            <b>Likes</b> ${pic.likes}
                            </p>
                            <p class="info-item">
                            <b>Views</b> ${pic.views}
                            </p>
                            <p class="info-item">
                            <b>Comments</b> ${pic.comments}
                            </p>
                            <p class="info-item">
                            <b>Downloads</b> ${pic.downloads}
                            </p>
                        </div>
                    </a>`;
    }).join('');
}

function loadBtnDeactevated() {
    loadMoreBtnEl.setAttribute('disabled', true);
    loadMoreBtnEl.classList.add('disabled');
}

function loadBtnActevated() {
    loadMoreBtnEl.removeAttribute('disabled');
    loadMoreBtnEl.classList.remove('disabled');
}