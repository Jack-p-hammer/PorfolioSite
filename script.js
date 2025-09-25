const state = {
  projects: [],
  filteredProjects: [],
  activeProject: null,
  currentSlideIndex: 0,
  searchTerm: '',
  activeFilter: 'all'
};

function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

async function loadProjects() {
  try {
    const res = await fetch('data/projects.json?v=' + Date.now());
    if (!res.ok) throw new Error('Failed to load projects.json');
    const json = await res.json();
    if (!Array.isArray(json)) throw new Error('projects.json must be an array');
    state.projects = json;
    state.filteredProjects = [...state.projects];
    renderProjects();
    setupFilterButtons();
  } catch (err) {
    console.error(err);
    const grid = document.getElementById('projects-grid');
    if (grid) grid.innerHTML = '<p style="color:#f88">Failed to load projects.</p>';
  }
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = '';

  state.filteredProjects.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', project.title);

    const img = document.createElement('img');
    img.className = 'project-thumb';
    const images = Array.isArray(project.images) ? project.images : [project.image || 'assets/placeholder.svg'];
    img.src = images[0];
    img.alt = project.title + ' image';

    const body = document.createElement('div');
    body.className = 'project-body';

    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title;

    const desc = document.createElement('p');
    desc.className = 'project-desc';
    desc.textContent = project.shortDescription || '';

    const tags = document.createElement('ul');
    tags.className = 'tag-list';
    (project.keywords || []).forEach(k => {
      const li = document.createElement('li');
      li.className = 'tag';
      li.textContent = k;
      tags.appendChild(li);
    });

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(tags);

    card.appendChild(img);
    card.appendChild(body);

    const open = () => openModal(project);
    card.addEventListener('click', open);
    card.addEventListener('keypress', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });

    grid.appendChild(card);
  });
}

function openModal(project) {
  state.activeProject = project;
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  modal.querySelector('#modal-title').textContent = project.title;
  modal.querySelector('#modal-description').textContent = project.longDescription || project.shortDescription || '';

  const slideshowContainer = modal.querySelector('#modal-slideshow');
  const images = Array.isArray(project.images) ? project.images : [project.image || 'assets/placeholder.svg'];
  
  // Clear existing slideshow
  slideshowContainer.innerHTML = '';
  
  // Add images to slideshow
  images.forEach((imageSrc, index) => {
    const img = document.createElement('img');
    img.className = 'slideshow-image';
    if (index === 0) img.classList.add('active');
    img.src = imageSrc;
    img.alt = project.title + ' image ' + (index + 1);
    slideshowContainer.appendChild(img);
  });

  // Add navigation if multiple images
  if (images.length > 1) {
    // Add arrows
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slideshow-arrows slideshow-arrow-left';
    prevBtn.innerHTML = '‹';
    prevBtn.setAttribute('aria-label', 'Previous image');
    prevBtn.addEventListener('click', () => changeSlide(-1));
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'slideshow-arrows slideshow-arrow-right';
    nextBtn.innerHTML = '›';
    nextBtn.setAttribute('aria-label', 'Next image');
    nextBtn.addEventListener('click', () => changeSlide(1));
    
    slideshowContainer.appendChild(prevBtn);
    slideshowContainer.appendChild(nextBtn);
    
    // Add dots
    const nav = document.createElement('div');
    nav.className = 'slideshow-nav';
    images.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = 'slideshow-dot';
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      nav.appendChild(dot);
    });
    slideshowContainer.appendChild(nav);
    
    state.currentSlideIndex = 0;
  }

  const kw = modal.querySelector('#modal-keywords');
  kw.innerHTML = '';
  (project.keywords || []).forEach(k => {
    const li = document.createElement('li');
    li.className = 'tag';
    li.textContent = k;
    kw.appendChild(li);
  });

  const links = modal.querySelector('#modal-links');
  links.innerHTML = '';
  (project.links || []).forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = link.label;
    links.appendChild(a);
  });

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function changeSlide(direction) {
  const slideshowContainer = document.querySelector('#modal-slideshow');
  if (!slideshowContainer) return;
  
  const images = slideshowContainer.querySelectorAll('.slideshow-image');
  const dots = slideshowContainer.querySelectorAll('.slideshow-dot');
  
  if (images.length === 0) return;
  
  state.currentSlideIndex += direction;
  
  if (state.currentSlideIndex >= images.length) {
    state.currentSlideIndex = 0;
  } else if (state.currentSlideIndex < 0) {
    state.currentSlideIndex = images.length - 1;
  }
  
  // Update active image and dot
  images.forEach((img, index) => {
    img.classList.toggle('active', index === state.currentSlideIndex);
  });
  
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === state.currentSlideIndex);
  });
}

function goToSlide(index) {
  const slideshowContainer = document.querySelector('#modal-slideshow');
  if (!slideshowContainer) return;
  
  const images = slideshowContainer.querySelectorAll('.slideshow-image');
  const dots = slideshowContainer.querySelectorAll('.slideshow-dot');
  
  if (index >= 0 && index < images.length) {
    state.currentSlideIndex = index;
    
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
}

function setupFilterButtons() {
  const filterContainer = document.getElementById('filter-buttons');
  if (!filterContainer) return;
  
  // Get all unique keywords from projects
  const allKeywords = new Set();
  state.projects.forEach(project => {
    (project.keywords || []).forEach(keyword => allKeywords.add(keyword));
  });
  
  // Create filter buttons for each keyword
  allKeywords.forEach(keyword => {
    const button = document.createElement('button');
    button.className = 'filter-btn';
    button.textContent = keyword;
    button.setAttribute('data-filter', keyword);
    button.addEventListener('click', () => setFilter(keyword));
    filterContainer.appendChild(button);
  });
}

function setFilter(filter) {
  state.activeFilter = filter;
  
  // Update button states
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
  });
  
  filterProjects();
}

function filterProjects() {
  let filtered = [...state.projects];
  
  // Apply keyword filter
  if (state.activeFilter !== 'all') {
    filtered = filtered.filter(project => 
      (project.keywords || []).includes(state.activeFilter)
    );
  }
  
  // Apply search filter
  if (state.searchTerm.trim()) {
    const searchLower = state.searchTerm.toLowerCase();
    filtered = filtered.filter(project => 
      project.title.toLowerCase().includes(searchLower) ||
      (project.shortDescription || '').toLowerCase().includes(searchLower) ||
      (project.longDescription || '').toLowerCase().includes(searchLower) ||
      (project.keywords || []).some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  }
  
  state.filteredProjects = filtered;
  renderProjects();
}

function closeModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  state.activeProject = null;
}

function initModalBehavior() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  modal.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.getAttribute && target.getAttribute('data-close') === 'modal') {
      closeModal();
    }
  });
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function init() {
  setYear();
  initNavToggle();
  initModalBehavior();
  loadProjects();
}

document.addEventListener('DOMContentLoaded', init);
