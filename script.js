const state = {
  projects: [],
  activeProject: null
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
    renderProjects();
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

  state.projects.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', project.title);

    const img = document.createElement('img');
    img.className = 'project-thumb';
    img.src = project.image || 'assets/placeholder.svg';
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

  const img = modal.querySelector('#modal-image');
  img.src = project.image || 'assets/placeholder.svg';
  img.alt = project.title + ' image';

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
