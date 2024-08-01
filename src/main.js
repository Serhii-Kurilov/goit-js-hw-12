import { fetchImages } from './js/pixabay-api.js';
import { renderImages, showNotification, clearGallery, showLoader, hideLoader } from './js/render-functions.js';

let query = '';
let page = 1;
const perPage = 15;
let totalHits = 0;

const form = document.getElementById('search-form');
const loadMoreBtn = document.getElementById('load-more');
const loader = document.getElementById('loader');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  query = form.searchQuery.value.trim();

  if (query === '') {
    showNotification('Please enter a search query.', 'error');
    return;
  }

  page = 1;
  clearGallery();
  loadMoreBtn.style.display = 'none';
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);
    totalHits = data.totalHits;

    if (totalHits === 0) {
      showNotification('Sorry, there are no images matching your search query. Please try again!', 'error');
    } else {
      renderImages(data.hits, false);
      if (data.hits.length < totalHits) {
        loadMoreBtn.style.display = 'block';
      }
    }
  } catch (error) {
    showNotification('Failed to fetch images. Please try again later.', 'error');
  } finally {
    hideLoader();
  }

  form.searchQuery.value = '';
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);
    renderImages(data.hits, true);

    const { height: cardHeight } = document.querySelector('.gallery-item').getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (page * perPage >= totalHits) {
      loadMoreBtn.style.display = 'none';
      showNotification("We're sorry, but you've reached the end of search results.", 'info');
    }
  } catch (error) {
    showNotification('Failed to fetch images. Please try again later.', 'error');
  } finally {
    hideLoader();
  }
});
