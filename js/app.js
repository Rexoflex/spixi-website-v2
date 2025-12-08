/**
 * Spixi Mini Apps Directory
 * Main JavaScript file
 * 
 * Apps are loaded from data/apps.json
 * Community can submit apps via GitHub PRs
 */

// DOM Elements
const appGrid = document.getElementById('app-grid');
const searchInput = document.getElementById('search-input');
const categoryFilters = document.getElementById('category-filters');
const loadMoreBtn = document.getElementById('load-more-btn');

// State
let apps = [];
let categories = [];
let activeCategory = 'All';
let searchTerm = '';
let displayedCount = 9; // Initial number of apps to show
const appsPerPage = 6; // Number of apps to load on "load more"

/**
 * Fetch apps data from JSON file
 */
async function fetchApps() {
  try {
    const response = await fetch('data/apps.json');
    const data = await response.json();
    apps = data.apps;
    categories = data.categories;
    renderApps();
    updateLoadMoreVisibility();
  } catch (error) {
    console.error('Error loading apps:', error);
    if (appGrid) {
      appGrid.innerHTML = '<p style="color: var(--color-text-02); padding: var(--spacing-xl); text-align: center;">Failed to load apps. Please try again later.</p>';
    }
  }
}

/**
 * Get filtered apps based on category and search
 */
function getFilteredApps() {
  let filtered = apps;

  // Filter by category
  if (activeCategory !== 'All') {
    filtered = filtered.filter(app => app.category === activeCategory);
  }

  // Filter by search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(app =>
      app.name.toLowerCase().includes(term) ||
      app.description.toLowerCase().includes(term) ||
      app.publisher.toLowerCase().includes(term)
    );
  }

  return filtered;
}

/**
 * Render app cards to the grid
 */
function renderApps() {
  if (!appGrid) return;

  const filteredApps = getFilteredApps();
  const appsToShow = filteredApps.slice(0, displayedCount);

  if (appsToShow.length === 0) {
    appGrid.innerHTML = `
      <div class="empty-state">
        <img src="assets/icons/SmileyMeh.svg" alt="" class="empty-state__icon">
        <h3 class="empty-state__title">No apps found</h3>
        <p class="empty-state__description">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    `;
    return;
  }

  appGrid.innerHTML = appsToShow.map(app => createAppCard(app)).join('');
  updateLoadMoreVisibility();
}

/**
 * Create HTML for a single app card
 * @param {Object} app - App data object
 * @returns {string} - HTML string
 */
function createAppCard(app) {
  const githubLink = app.github
    ? `<a href="${app.github}" class="app-card__github" target="_blank" rel="noopener noreferrer" aria-label="View on GitHub">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="currentColor">
          <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H108A59.75,59.75,0,0,0,60,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,40,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,80,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40h8v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,200,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM184,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.55a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h16.36a8,8,0,0,0,6.71-3.97,43.88,43.88,0,0,1,32.32-20.06A43.81,43.81,0,0,1,176,73.55a8,8,0,0,0,1.1,7.97A41.74,41.74,0,0,1,184,104Z"/>
        </svg>
      </a>`
    : '';

  const websiteLink = app.website || 'https://spixi.io';
  const webLink = `<a href="${websiteLink}" class="app-card__github" target="_blank" rel="noopener noreferrer" aria-label="Visit Website">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="currentColor">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm0-160a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"/>
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" opacity="0"/>
        <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm6.15-58.42a48.16,48.16,0,0,0,17.26-24.08h29.82A88.35,88.35,0,0,1,134.15,157.58ZM74.77,133.5h29.82a48.16,48.16,0,0,0,17.26,24.08A88.35,88.35,0,0,1,74.77,133.5Zm47.08,26.54A63.88,63.88,0,0,1,89.5,133.5h77a63.88,63.88,0,0,1-32.35,26.54ZM134.15,98.42A88.35,88.35,0,0,1,181.23,122.5H151.41A48.16,48.16,0,0,0,134.15,98.42ZM89.5,122.5A63.88,63.88,0,0,1,121.85,95.96a63.88,63.88,0,0,1,32.35,26.54ZM74.77,122.5A88.35,88.35,0,0,1,121.85,98.42a48.16,48.16,0,0,0-17.26,24.08Zm106.46-9.16a87.59,87.59,0,0,1,.69,29.32H152.08a63.88,63.88,0,0,1-48.16,0H74.08a87.59,87.59,0,0,1,.69-29.32,87.89,87.89,0,0,1,106.46,0Z"/>
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm0-176a88,88,0,0,1,77.53,130.34,88.08,88.08,0,0,1-155.06,0A88,88,0,0,1,128,40Zm0,16a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z" opacity="0"/>
        <path d="M128,32a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,32Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,208Zm0-153.2a73.2,73.2,0,0,0-12.8,2.15,72.08,72.08,0,0,1,25.6,0A73.2,73.2,0,0,0,128,54.8ZM87.8,81.33A57.34,57.34,0,0,1,114.73,63a88.66,88.66,0,0,0-35.34,23.11ZM128,201.2a73.2,73.2,0,0,0,12.8-2.15,72.08,72.08,0,0,1-25.6,0A73.2,73.2,0,0,0,128,201.2Zm40.2-26.54a57.34,57.34,0,0,1-26.93,18.33,88.66,88.66,0,0,0,35.34-23.11ZM168.2,81.33a88.66,88.66,0,0,0-35.34-23.11,57.34,57.34,0,0,1,26.93,18.33ZM114.73,193a57.34,57.34,0,0,1-26.93-18.33,88.66,88.66,0,0,0,35.34,23.11Z"/>
        <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
        <line x1="36" y1="112" x2="220" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
        <line x1="36" y1="144" x2="220" y2="144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
        <ellipse cx="128" cy="128" rx="40" ry="93.42" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
      </svg>
    </a>`;

  // Determine the action URL (spixi deep link or file)
  const actionUrl = app.spixiUrl || (app.files && app.files.spixi) || '#';

  return `
    <article class="app-card">
      <div class="app-card__header">
        <img class="app-card__icon" src="${app.icon}" alt="${app.name}" onerror="this.src='assets/images/placeholder-app.png'">
        <span class="badge">${app.category}</span>
      </div>
      <div class="app-card__content">
        <div class="app-card__details">
          <div class="app-card__meta">
            <h3 class="app-card__title">${app.name}</h3>
            <p class="app-card__publisher">${app.publisher}</p>
          </div>
          <p class="app-card__description">${app.description}</p>
          ${app.version ? `<span class="app-card__version">v${app.version}</span>` : ''}
        </div>
      </div>
      <div class="app-card__footer">
        <a href="${actionUrl}" class="btn btn-sm btn-outlined">
          <span class="btn__label">Try in Spixi</span>
          <span class="btn__icon btn__icon--trailing">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
              <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"/>
            </svg>
          </span>
        </a>
        <div class="app-card__actions">
          ${webLink}
          ${githubLink}
        </div>
      </div>
    </article>
  `;
}

/**
 * Filter apps by category
 * @param {string} category - Category to filter by
 */
function filterByCategory(category) {
  activeCategory = category;
  displayedCount = 9; // Reset to initial count
  renderApps();
  updateCategoryButtons();
}

/**
 * Update category filter button states
 */
function updateCategoryButtons() {
  const buttons = document.querySelectorAll('.chip');
  buttons.forEach(btn => {
    if (btn.dataset.category === activeCategory) {
      btn.classList.remove('chip--default');
      btn.classList.add('chip--selected');
    } else {
      btn.classList.remove('chip--selected');
      btn.classList.add('chip--default');
    }
  });
}

/**
 * Handle search input
 * @param {string} query - Search query
 */
function handleSearch(query) {
  searchTerm = query;
  displayedCount = 9; // Reset to initial count
  renderApps();
}

/**
 * Load more apps
 */
function loadMore() {
  displayedCount += appsPerPage;
  renderApps();
}

/**
 * Update load more button visibility
 */
function updateLoadMoreVisibility() {
  if (!loadMoreBtn) return;

  const filteredApps = getFilteredApps();
  if (displayedCount >= filteredApps.length) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'inline-flex';
  }
}

/**
 * Get featured apps
 * @returns {Array} - Array of featured apps
 */
function getFeaturedApps() {
  return apps.filter(app => app.featured);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  fetchApps();

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });
  }

  // Category filter listeners
  if (categoryFilters) {
    categoryFilters.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (chip && chip.dataset.category) {
        filterByCategory(chip.dataset.category);
      }
    });
  }

  // Load more button listener
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMore);
  }

  // Modal functionality
  setupModal();
});

/**
 * Setup modal functionality
 */
function setupModal() {
  const modalOverlay = document.getElementById('modal-overlay');
  const appModal = document.getElementById('app-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const copyBtn = document.getElementById('copy-url-btn');

  if (!modalOverlay || !appModal || !closeBtn) return;

  // Close modal function
  function closeModal() {
    modalOverlay.classList.add('modal-overlay--closing');
    setTimeout(() => {
      modalOverlay.style.display = 'none';
      modalOverlay.classList.remove('modal-overlay--closing');
      document.body.style.overflow = '';
    }, 200);
  }

  // Close button click
  closeBtn.addEventListener('click', closeModal);

  // Close on overlay click (outside modal)
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.style.display !== 'none') {
      closeModal();
    }
  });

  // Copy URL functionality - make entire container clickable
  const urlContainer = document.querySelector('.modal__url-container');
  if (urlContainer) {
    urlContainer.addEventListener('click', async () => {
      const urlText = document.getElementById('modal-app-url').textContent;
      try {
        await navigator.clipboard.writeText(urlText);
        showToast('Copied to clipboard');
      } catch (err) {
        console.error('Failed to copy URL:', err);
        showToast('Failed to copy URL');
      }
    });
  }

  // Delegate click events for "Try in Spixi" buttons
  document.addEventListener('click', (e) => {
    const tryBtn = e.target.closest('.app-card__footer .btn');
    if (tryBtn && tryBtn.textContent.includes('Try in Spixi')) {
      e.preventDefault();

      // Get app data from the card
      const appCard = tryBtn.closest('.app-card');
      if (!appCard) return;

      const appData = {
        icon: appCard.querySelector('.app-card__icon')?.src || '',
        title: appCard.querySelector('.app-card__title')?.textContent || 'App Title',
        category: appCard.querySelector('.badge')?.textContent || 'Category',
        publisher: appCard.querySelector('.app-card__publisher')?.textContent || 'Publisher',
        description: appCard.querySelector('.app-card__description')?.textContent || 'No description available.',
        url: tryBtn.href || window.location.origin + '/apps/sample-app'
      };

      // Populate modal with app data
      openModal(appData);
    }
  });
}

/**
 * Open modal with app data
 * @param {Object} appData - App information
 */
function openModal(appData) {
  const modalOverlay = document.getElementById('modal-overlay');

  // Populate modal fields
  document.getElementById('modal-app-icon').src = appData.icon;
  document.getElementById('modal-app-title').textContent = appData.title;
  document.getElementById('modal-app-category').textContent = appData.category;
  document.getElementById('modal-app-publisher').textContent = appData.publisher;
  document.getElementById('modal-app-description').textContent = appData.description;
  document.getElementById('modal-app-url').textContent = appData.url;

  document.getElementById('modal-app-url').textContent = appData.url;

  // Generate QR Code
  const qrTarget = document.getElementById('modal-qr-target');
  if (qrTarget) {
    qrTarget.innerHTML = ''; // Clear previous QR code
    try {
      new QRCode(qrTarget, {
        text: appData.url,
        width: 160,
        height: 160,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    } catch (e) {
      console.warn('QRCode library not loaded or failed', e);
      qrTarget.innerHTML = '<p class="modal__qr-note">QR Code Unavailable</p>';
    }
  }

  // Show modal
  modalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('toast--show');

  // Hide toast after 2 seconds
  setTimeout(() => {
    toast.classList.remove('toast--show');
  }, 2000);
}
