// ============ State ============
const state = {
  currentStep: 1,
  selectedCategory: null,
  selectedTemplate: null,
  currentImageBase64: null,
  currentHistoryId: null,
  activeCardSide: 'front',
  cardOrientation: 'horizontal', // 'horizontal' or 'vertical'
  front: { imageBase64: null, historyId: null },
  back: { imageBase64: null, historyId: null },
  sessionHistory: []
};

// ============ Categories ============
const categorias = [
  "Abogado","Actuario","Acupuntura","Agencia de Viajes","Agencia de publicidad",
  "Agricultura","Agricultura y Pecuaria","Agronomo","Aislamientos","Alquiler de coches",
  "Alquiler de tiendas","Analisis Clinicas","Anestesiologo","Animacion","Animador Sociocultural",
  "Animales","Antropologo","Aromaterapia","Arqueologo","Arquitectura","Artes grafica",
  "Artesania","Aseguradora","Asistencia Tecnica","Asistente Social","Asociacion",
  "Asociaciones sin animo de lucro","Astronomia","Audiologia","Auditoria","Autocad y Modelismo",
  "Autoescuela","Automotor","Autores","Autonomos","Ayudante","Ayuerveda","Banca","Bares",
  "Belleza y Bienestar","Biologia","Bisuteria","Blog","Bodas y Bautizos","Botanico","Boutique",
  "Bricolaje","Buen Fin","Cafeteria","Carniceria","Carpinteria","Carpintero",
  "Carpintero de aluminio","Cartografo","Casa, Obras y Jardin","Catering",
  "Certificacion Energetica","Ciencias","Cine","Cirujanos","Clases Particulares",
  "Clases particulares de Ingles","Cocinero","Comercial","Comercio","Comercio tradicional",
  "Comunidad","Concesionario","Conductor","Confiteria","Conservacion y Restauracion",
  "Construccion Civil","Consultora de beleza","Consultoria","Contabilidad","Cosmetica",
  "Costurera","Cromoterapia","Cuidadores de mascotas","Cultura y Eventos","DJ","Decoracion",
  "Demografia","Dentista","Depilacion","Dermatologo","Desarrollo de Webs","Desatascador",
  "Desinfeccion","Dietista","Diseno","Diseno de interiores","Diseno de web","Diseno grafico",
  "Diseno y Tecnologia","Economista","Editor","Educacion","Educador Social","Electricista",
  "Empresa de Eventos","Empresas de Comercio Electronico","Endocrino","Enfermeros",
  "Entrenador Personal","Enologo","Especialidades","Estadistica","Estetica","Estilista",
  "Estudio de mercado","Eventos","Farmacias","Farmacologo","Fiesta","Fiesta de Cumpleanos",
  "Filologo","Filosofo","Finanzas","Fiscalidad","Fisioterapia","Fitoterapia","Flores de Bach",
  "Florista","Fontanero","Formador","Fotografo","Freelancer","Fruteria","Funeraria","Fisico",
  "Galeria de arte","Gastroenterologo","Genetistas","Geofisico","Geografo","Geologo","Gestion",
  "Gestion de Redes Sociales","Gimnasio","Ginecologo","Grandes Empresas","Graficos",
  "Guia Turistico","Heladeria","Hematologo","Historiador","Homeopata","Hotel","Ilustracion",
  "Imprenta","Impresion","Industria Textil","Industria de Moldes","Industria","Infectologos",
  "Informatica","Ingenieria","Ingeniero","Ingeniero Civil","Ingeniero Electronico","Inmobiliaria",
  "Instalaciones","Intalador de Gas","Interprete","Iridologia","Jardinero","Joyeria","Ladrillero",
  "Lavanderia","Libreria","Limpia chimeneas","Limpiezas","Linguista","Logopeda","Magnetoterapia",
  "Manicura y Pedicura","Manutencion","Maquillador","Marketing","Marketing Digital","Masajistas",
  "Masoterapia","Matematico","Mecanicos","Media","Medicina","Medicinas Alternativas","Merceria",
  "Metalurgia y mecanica","Meteorologo","Moda","Modelos","Mudanzas","Muebles","Musicoterapia",
  "Moviles","Musicos","Negocios","Neurologo","Ninera","Notarios","Nutricionista","Obras",
  "Oceanografo","Oculista","Odontologo","Ofertas para Navidad","Oftalmologo","Oncologo","Online",
  "Optometrista","Orfebre","Otros","Paisajista","Panaderia","Papeleria","Parasitologo","Parrilla",
  "Pastelerias","Patologos","Pavimentos","Pecuario","Pediatras","Pedrero","Peluqueria","Pensiones",
  "Perfumerias","Periodista","Periodico","Pescaderia","Pintura","Pintura Artistica","Piscinas",
  "Planchado","Profesionales","Profesor Particular","Profesor Universitario","Profesor de Baile",
  "Profesor de Educacion Fisica","Profesor de Musica","Profesores","Profesores de Deporte",
  "Programacion y software","Propietario","Psicologo","Psiquiatra","Publicidad","Pagina Web",
  "Quimico","Radio","Radiologo","Refrigeracion","Relaciones Publicas","Relojero","Remodelacion",
  "Reparacion de Ordenadores","Reparacion de aparatos electricos","Residencia para Personas Mayores",
  "Restauracion y Hosteleria","Restaurante","Reventa","Revisores Oficiales de Cuentas","Revista",
  "SPA","Salud","Salon de Belleza","Seguridad","Serreria","Servicio Domestico","Servicios",
  "Sexologo","Sociologo","Solicitadores","Supermercado","Taller Mecanico","Tartas y Dulces",
  "Tasador de Inmuebles","Taxista","Teatro","Telecomunicaciones","Television","Terapeuta",
  "Terapia Holistica","Terrenos y Fincas","Tienda","Tienda Infantil","Tienda de Animales",
  "Tienda de Ropa","Tienda de Te","Toldos","Topografo","Traductor","Transportes",
  "Tecnico Oficial de Cuentas","Urologo","Vendedores","Veterinario","Vidriero","Yesista","Yoga",
  "Zapateria","Zapatero","Zoologia"
];

const styleIcons = {
  'Moderno': '&#9670;', 'Clasico': '&#9733;', 'Minimalista': '&#9724;',
  'Elegante': '&#10022;', 'Corporativo': '&#9635;', 'Creativo': '&#10038;',
  'Premium': '&#9830;', 'Profesional': '&#9632;', 'Limpio': '&#9675;',
  'Audaz': '&#9654;', 'Geometrico': '&#9651;', 'Gradiente': '&#9683;'
};

// ============ Init ============
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
});

// ============ Categories ============
function renderCategories(filter = '') {
  const grid = document.getElementById('categoriesGrid');
  const filtered = filter
    ? categorias.filter(c => c.toLowerCase().includes(filter.toLowerCase()))
    : categorias;

  grid.innerHTML = filtered.map(cat => `
    <div class="category-card ${state.selectedCategory === cat ? 'selected' : ''}"
         onclick="selectCategory('${cat.replace(/'/g, "\\'")}')">
      ${cat}
    </div>
  `).join('');
}

function filterCategories() {
  const val = document.getElementById('categorySearch').value;
  renderCategories(val);
}

function selectCategory(cat) {
  state.selectedCategory = cat;
  renderCategories(document.getElementById('categorySearch').value);
  document.getElementById('btnStep1Next').disabled = false;
  loadTemplates(cat);
}

// ============ Templates ============
let currentTemplatePage = 1;
let totalTemplatePages = 1;
let isLoadingMore = false;

async function loadTemplates(category, page = 1, append = false) {
  const grid = document.getElementById('templatesGrid');

  if (!append) {
    currentTemplatePage = 1;
    state.templates = [];
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem 0;color:var(--text-tertiary);">
        <div class="spinner-ring" style="margin:0 auto 1rem;width:32px;height:32px;"></div>
        <p style="font-size:0.85rem;">Buscando disenos para <strong style="color:var(--text)">${category}</strong>...</p>
      </div>`;
  }

  try {
    const res = await fetch(`/api/freepik/search?query=${encodeURIComponent(category)}&page=${page}`);
    const data = await res.json();
    const newTemplates = data.data || [];

    if (append) {
      state.templates = [...state.templates, ...newTemplates];
    } else {
      state.templates = newTemplates;
    }

    currentTemplatePage = page;
    totalTemplatePages = data.meta?.pagination?.pages || 1;

    renderTemplates(state.templates);
  } catch (err) {
    console.error(err);
    if (!append) {
      grid.innerHTML = '<p style="color:var(--danger);text-align:center;padding:2rem;">Error al cargar disenos</p>';
    }
  }
}

async function loadMoreTemplates() {
  if (isLoadingMore || currentTemplatePage >= totalTemplatePages) return;
  isLoadingMore = true;

  const btn = document.getElementById('btnLoadMore');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner-ring" style="width:18px;height:18px;"></div> Cargando...';
  }

  await loadTemplates(state.selectedCategory, currentTemplatePage + 1, true);

  isLoadingMore = false;
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/></svg> Cargar mas plantillas`;
  }
}

function renderTemplates(templates) {
  const grid = document.getElementById('templatesGrid');
  const checkSVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  const zoomSVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;

  const cardsHTML = templates.map((t, i) => {
    const isSelected = state.selectedTemplate && state.selectedTemplate.id === t.id;
    let previewHTML;

    if (t.isSample || !t.preview) {
      const color = t.color || '#1a365d';
      const accentColor = lightenColor(color, 40);
      const icon = styleIcons[t.style] || '&#9670;';
      previewHTML = `
        <div class="sample-design" style="background: linear-gradient(135deg, ${color} 0%, ${darkenColor(color, 20)} 100%);">
          <div class="design-accent"></div>
          <div class="design-line" style="background: ${accentColor};"></div>
          <span class="design-icon">${icon}</span>
          <span class="design-title">${t.style || 'Profesional'}</span>
          <span class="design-subtitle">${state.selectedCategory || ''}</span>
        </div>`;
    } else {
      const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(t.preview)}`;
      previewHTML = `<img src="${proxiedUrl}" alt="${t.title}" loading="lazy">`;
    }

    return `
      <div class="template-card ${isSelected ? 'selected' : ''}"
           onclick="selectTemplate(${i})">
        <div class="template-check">${checkSVG}</div>
        <div class="template-preview">
          ${previewHTML}
          <div class="template-zoom" onclick="event.stopPropagation();openLightbox(${i})" title="Ver en grande">${zoomSVG}</div>
        </div>
        <div class="template-info">
          <h4>${t.title || 'Diseno ' + (i + 1)}</h4>
          <p>${t.style || 'Tarjeta de presentacion'}</p>
        </div>
      </div>`;
  }).join('');

  // Add "Load more" button if there are more pages
  const loadMoreHTML = currentTemplatePage < totalTemplatePages
    ? `<div style="grid-column:1/-1;text-align:center;padding:1.5rem 0;">
        <button class="btn btn-secondary btn-lg" id="btnLoadMore" onclick="loadMoreTemplates()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/></svg>
          Cargar mas plantillas
        </button>
        <p style="font-size:0.7rem;color:var(--text-tertiary);margin-top:0.5rem;">Pagina ${currentTemplatePage} de ${totalTemplatePages}</p>
      </div>`
    : '';

  grid.innerHTML = cardsHTML + loadMoreHTML;
}

function selectTemplate(index) {
  state.selectedTemplate = state.templates[index];
  renderTemplates(state.templates);
  document.getElementById('btnStep2Next').disabled = false;
  updateSidebarPreview();
  detectTemplateOrientation(state.selectedTemplate);
}

// Auto-detect if template is vertical or horizontal
function detectTemplateOrientation(template) {
  if (!template || template.isSample || !template.preview) {
    state.cardOrientation = 'horizontal';
    return;
  }
  const img = new Image();
  img.onload = () => {
    state.cardOrientation = img.naturalHeight > img.naturalWidth ? 'vertical' : 'horizontal';
    console.log('Detected orientation:', state.cardOrientation, `(${img.naturalWidth}x${img.naturalHeight})`);
  };
  img.onerror = () => { state.cardOrientation = 'horizontal'; };
  img.src = `/api/proxy-image?url=${encodeURIComponent(template.preview)}`;
}

// Toggle orientation in step 4
function toggleOrientation() {
  state.cardOrientation = state.cardOrientation === 'horizontal' ? 'vertical' : 'horizontal';
  updateOrientationUI();
  showToast(`Orientacion cambiada a ${state.cardOrientation === 'horizontal' ? 'horizontal' : 'vertical'}`, 'info');
}

function updateOrientationUI() {
  const isVertical = state.cardOrientation === 'vertical';
  // Update toggle button
  const btn = document.getElementById('btnToggleOrientation');
  if (btn) {
    btn.querySelector('.orientation-label').textContent = isVertical ? 'Vertical' : 'Horizontal';
  }
  // Update preview frames
  ['cardPreviewFront', 'cardPreviewBack'].forEach(id => {
    const frame = document.getElementById(id);
    if (frame) {
      frame.classList.toggle('vertical', isVertical);
    }
  });
  // Update dimension badges
  document.querySelectorAll('.dim-badge').forEach(badge => {
    badge.textContent = isVertical ? '5 x 9 cm' : '9 x 5 cm';
  });
}

// ============ Lightbox ============
let lightboxIndex = 0;

function openLightbox(index) {
  lightboxIndex = index;
  renderLightbox();
  document.getElementById('templateLightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('templateLightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function lightboxPrev() {
  if (!state.templates || state.templates.length === 0) return;
  lightboxIndex = (lightboxIndex - 1 + state.templates.length) % state.templates.length;
  renderLightbox();
}

function lightboxNext() {
  if (!state.templates || state.templates.length === 0) return;
  lightboxIndex = (lightboxIndex + 1) % state.templates.length;
  renderLightbox();
}

function lightboxSelect() {
  selectTemplate(lightboxIndex);
  closeLightbox();
  showToast('Plantilla seleccionada', 'success');
}

function renderLightbox() {
  const t = state.templates[lightboxIndex];
  if (!t) return;

  const content = document.getElementById('lightboxContent');
  const title = document.getElementById('lightboxTitle');

  title.textContent = t.title || 'Diseno ' + (lightboxIndex + 1);

  if (t.isSample || !t.preview) {
    const color = t.color || '#1a365d';
    const accentColor = lightenColor(color, 40);
    const icon = styleIcons[t.style] || '&#9670;';
    content.innerHTML = `
      <div class="sample-design-large" style="background: linear-gradient(135deg, ${color} 0%, ${darkenColor(color, 20)} 100%);">
        <span style="font-size:3rem;opacity:0.8;margin-bottom:0.75rem;">${icon}</span>
        <span style="font-size:1.2rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;">${t.style || 'Profesional'}</span>
        <span style="font-size:0.85rem;opacity:0.6;margin-top:0.375rem;">${state.selectedCategory || ''}</span>
      </div>`;
  } else {
    const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(t.preview)}`;
    content.innerHTML = `<img src="${proxiedUrl}" alt="${t.title}">`;
  }

  // Update select button state
  const btn = document.getElementById('lightboxSelectBtn');
  const isSelected = state.selectedTemplate && state.selectedTemplate.id === t.id;
  btn.textContent = isSelected ? 'Seleccionada' : 'Seleccionar esta plantilla';
  btn.style.opacity = isSelected ? '0.6' : '1';
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('templateLightbox');
  if (!lb || !lb.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev();
  if (e.key === 'ArrowRight') lightboxNext();
  if (e.key === 'Enter') lightboxSelect();
});

function updateSidebarPreview() {
  const frame = document.getElementById('sidebarPreview');
  const infoCategoria = document.getElementById('infoCategoria');

  if (infoCategoria && state.selectedCategory) {
    infoCategoria.textContent = state.selectedCategory;
  }

  if (!state.selectedTemplate || !frame) return;

  const t = state.selectedTemplate;
  if (t.isSample || !t.preview) {
    const color = t.color || '#1a365d';
    const icon = styleIcons[t.style] || '&#9670;';
    frame.innerHTML = `
      <div class="sample-design" style="background: linear-gradient(135deg, ${color} 0%, ${darkenColor(color, 20)} 100%);width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <span style="font-size:1.5rem;opacity:0.8;">${icon}</span>
        <span style="font-size:0.7rem;font-weight:600;margin-top:0.25rem;">${t.style}</span>
      </div>`;
  } else {
    const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(t.preview)}`;
    frame.innerHTML = `<img src="${proxiedUrl}" style="width:100%;height:100%;object-fit:cover;">`;
  }
}

// ============ File Uploads ============
function handleFilePreview(input, containerId) {
  const container = document.getElementById(containerId);
  const uploadArea = input.closest('.file-upload-area');

  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      container.innerHTML = `
        <div class="file-preview-wrapper">
          <img class="file-preview-img" src="${e.target.result}" alt="Preview">
          <div class="file-remove-btn" onclick="event.stopPropagation();removeFile('${input.id}', '${containerId}')">X</div>
        </div>`;
      uploadArea.classList.add('has-file');
    };
    reader.readAsDataURL(file);
  }
}

function removeFile(inputId, containerId) {
  const input = document.getElementById(inputId);
  const container = document.getElementById(containerId);
  const uploadArea = input.closest('.file-upload-area');

  input.value = '';
  uploadArea.classList.remove('has-file');

  const isLogo = inputId === 'logoFile';
  container.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${isLogo ? '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>' : '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'}</svg>
    <span>${isLogo ? 'Sube tu logotipo' : 'Sube una foto'}</span>
    <span class="file-upload-hint">${isLogo ? 'PNG o SVG transparente recomendado' : 'Foto de perfil, producto, etc.'}</span>`;
}

// ============ Custom Colors Toggle ============
function toggleCustomColors() {
  const checked = document.getElementById('useCustomColors').checked;
  document.getElementById('colorPickersRow').style.display = checked ? 'flex' : 'none';
}

// Update hex display when colors change
document.addEventListener('DOMContentLoaded', () => {
  const cp = document.getElementById('colorPrimario');
  const cs = document.getElementById('colorSecundario');
  if (cp) cp.addEventListener('input', () => {
    const hex = document.getElementById('colorPrimarioHex');
    if (hex) hex.textContent = cp.value;
  });
  if (cs) cs.addEventListener('input', () => {
    const hex = document.getElementById('colorSecundarioHex');
    if (hex) hex.textContent = cs.value;
  });
});

// Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============ Step Navigation ============
function goToStep(step) {
  if (step > 1 && !state.selectedCategory) {
    showToast('Selecciona una categoria primero', 'error');
    return;
  }
  if (step > 2 && !state.selectedTemplate) {
    showToast('Selecciona un diseno primero', 'error');
    return;
  }

  state.currentStep = step;

  // Update sections
  document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`step-${step}`).classList.add('active');

  // Update step items
  document.querySelectorAll('.step-item').forEach(item => {
    const s = parseInt(item.dataset.step);
    item.classList.remove('active', 'completed');
    if (s === step) item.classList.add('active');
    else if (s < step) item.classList.add('completed');
  });

  // Update connectors
  updateConnectors(step);

  // Update sidebar when going to step 3
  if (step === 3) {
    updateSidebarPreview();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateConnectors(currentStep) {
  for (let i = 1; i <= 3; i++) {
    const conn = document.getElementById(`conn-${i}-${i + 1}`);
    if (!conn) continue;
    const after = conn.querySelector('::after') || conn;
    if (i < currentStep) {
      conn.style.background = 'var(--accent-strong)';
    } else {
      conn.style.background = 'var(--border-strong)';
    }
  }
}

// ============ Build FormData helper ============
function buildFormData(side = 'front', extraFields = {}) {
  const formData = new FormData();
  formData.append('nombre', document.getElementById('nombre').value);
  formData.append('cargo', document.getElementById('cargo').value);
  formData.append('empresa', document.getElementById('empresa').value);
  formData.append('telefono', document.getElementById('telefono').value);
  formData.append('email', document.getElementById('email').value);
  formData.append('direccion', document.getElementById('direccion').value);
  formData.append('web', document.getElementById('web').value);
  formData.append('categoria', state.selectedCategory);
  formData.append('cardSide', side);
  formData.append('cardOrientation', state.cardOrientation);

  // Custom colors - only send if toggle is ON
  const useCustom = document.getElementById('useCustomColors').checked;
  formData.append('useCustomColors', useCustom ? '1' : '0');
  if (useCustom) {
    formData.append('colorPrimario', document.getElementById('colorPrimario').value);
    formData.append('colorSecundario', document.getElementById('colorSecundario').value);
  }

  // Logo file
  const logoFile = document.getElementById('logoFile');
  if (logoFile && logoFile.files[0]) {
    formData.append('logoImage', logoFile.files[0]);
  }

  // Photo file
  const photoFile = document.getElementById('photoFile');
  if (photoFile && photoFile.files[0]) {
    formData.append('photoImage', photoFile.files[0]);
  }

  if (state.selectedTemplate) {
    formData.append('templateStyle', state.selectedTemplate.style || '');
    formData.append('templateColor', state.selectedTemplate.color || '');
    if (state.selectedTemplate.preview) {
      formData.append('templatePreviewUrl', state.selectedTemplate.preview);
    }
    formData.append('templateIsSample', state.selectedTemplate.isSample ? '1' : '0');
  }

  for (const [k, v] of Object.entries(extraFields)) {
    formData.append(k, v);
  }
  return formData;
}

// ============ Generate Card (Front) ============
async function generateCard(event) {
  event.preventDefault();
  showLoading(true, 'Generando el frente de tu tarjeta...');

  const formData = buildFormData('front');

  try {
    const res = await fetch('/api/generate-card', { method: 'POST', body: formData });
    const data = await res.json();

    if (data.success) {
      state.front.imageBase64 = data.imageBase64;
      state.front.historyId = data.historyId;
      state.currentImageBase64 = data.imageBase64;
      state.currentHistoryId = data.historyId;
      state.activeCardSide = 'front';

      // Reset back side
      state.back.imageBase64 = null;
      state.back.historyId = null;

      state.sessionHistory.push({
        id: data.historyId,
        imageUrl: data.imageUrl,
        imageBase64: data.imageBase64,
        label: 'Frente - Original',
        side: 'front',
        timestamp: new Date().toISOString()
      });

      displayCardSide('front', data.imageBase64);
      resetBackPanel();
      updateSessionHistory();
      switchCardTab('front');
      goToStep(4);
      updateOrientationUI();
      showToast('Frente de tarjeta generado', 'success');
    } else {
      showToast(data.error || 'Error al generar la tarjeta', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Error de conexion con el servidor', 'error');
  } finally {
    showLoading(false);
  }
}

// ============ Generate Back Side ============
async function generateBackSide() {
  showLoading(true, 'Generando el reverso de tu tarjeta...');

  const extraFields = {};
  // Send front image as reference for consistent style
  if (state.front.imageBase64) {
    extraFields.currentImageBase64 = state.front.imageBase64;
  }

  const formData = buildFormData('back', extraFields);

  try {
    const res = await fetch('/api/generate-card', { method: 'POST', body: formData });
    const data = await res.json();

    if (data.success) {
      state.back.imageBase64 = data.imageBase64;
      state.back.historyId = data.historyId;
      state.currentImageBase64 = data.imageBase64;
      state.currentHistoryId = data.historyId;

      state.sessionHistory.push({
        id: data.historyId,
        imageUrl: data.imageUrl,
        imageBase64: data.imageBase64,
        label: 'Reverso - Original',
        side: 'back',
        timestamp: new Date().toISOString()
      });

      displayCardSide('back', data.imageBase64);
      document.getElementById('btnGenerateBack').style.display = 'none';
      document.getElementById('btnDownloadBack').style.display = '';
      document.getElementById('btnDownloadBoth').style.display = '';
      updateSessionHistory();
      showToast('Reverso de tarjeta generado', 'success');
    } else {
      showToast(data.error || 'Error al generar el reverso', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Error de conexion', 'error');
  } finally {
    showLoading(false);
  }
}

// ============ Edit Card ============
async function editCard() {
  const instructions = document.getElementById('editInstructions').value.trim();
  if (!instructions) {
    showToast('Escribe las instrucciones de edicion', 'error');
    return;
  }

  const side = state.activeCardSide;
  const currentImage = state[side].imageBase64;
  if (!currentImage) {
    showToast(`No hay ${side === 'front' ? 'frente' : 'reverso'} para editar`, 'error');
    return;
  }

  showLoading(true, `Editando ${side === 'front' ? 'frente' : 'reverso'}...`);

  const formData = buildFormData(side, {
    editInstructions: instructions,
    currentImageBase64: currentImage,
    parentId: state[side].historyId || ''
  });

  try {
    const res = await fetch('/api/generate-card', { method: 'POST', body: formData });
    const data = await res.json();

    if (data.success) {
      state[side].imageBase64 = data.imageBase64;
      state[side].historyId = data.historyId;
      state.currentImageBase64 = data.imageBase64;
      state.currentHistoryId = data.historyId;

      state.sessionHistory.push({
        id: data.historyId,
        imageUrl: data.imageUrl,
        imageBase64: data.imageBase64,
        label: `${side === 'front' ? 'Frente' : 'Reverso'}: ${instructions.substring(0, 40)}${instructions.length > 40 ? '...' : ''}`,
        side: side,
        timestamp: new Date().toISOString()
      });

      displayCardSide(side, data.imageBase64);
      updateSessionHistory();
      document.getElementById('editInstructions').value = '';
      showToast('Cambios aplicados', 'success');
    } else {
      showToast(data.error || 'Error al editar', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Error de conexion', 'error');
  } finally {
    showLoading(false);
  }
}

function setEditText(text) {
  document.getElementById('editInstructions').value = text;
}

// ============ Card Side Tabs ============
function switchCardTab(side) {
  state.activeCardSide = side;

  document.getElementById('tabFront').classList.toggle('active', side === 'front');
  document.getElementById('tabBack').classList.toggle('active', side === 'back');
  document.getElementById('frontPanel').style.display = side === 'front' ? '' : 'none';
  document.getElementById('backPanel').style.display = side === 'back' ? '' : 'none';

  // Update current image for editing
  if (state[side].imageBase64) {
    state.currentImageBase64 = state[side].imageBase64;
    state.currentHistoryId = state[side].historyId;
  }
}

function resetBackPanel() {
  document.getElementById('cardPreviewBack').innerHTML = `
    <p class="placeholder-card">
      <span class="placeholder-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      </span>
      Genera el reverso con el boton de abajo
    </p>`;
  document.getElementById('btnGenerateBack').style.display = '';
  document.getElementById('btnDownloadBack').style.display = 'none';
  document.getElementById('btnDownloadBoth').style.display = 'none';
}

// ============ Display ============
function displayCardSide(side, base64) {
  const frameId = side === 'front' ? 'cardPreviewFront' : 'cardPreviewBack';
  const frame = document.getElementById(frameId);
  if (frame) {
    frame.innerHTML = `<img src="${base64}" alt="Tarjeta ${side === 'front' ? 'frente' : 'reverso'}">`;
  }
}

function updateSessionHistory() {
  const list = document.getElementById('historyList');
  if (state.sessionHistory.length === 0) {
    list.innerHTML = `
      <div class="history-empty">
        <div class="empty-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        Aun no hay versiones
      </div>`;
    return;
  }

  list.innerHTML = state.sessionHistory.slice().reverse().map(h => {
    const sideBadge = h.side === 'back' ? '<span style="color:var(--warning);font-size:0.6rem;font-weight:600;">REV</span>' : '<span style="color:var(--success);font-size:0.6rem;font-weight:600;">FRE</span>';
    return `
    <div class="history-item" onclick="restoreFromSession('${h.id}')">
      <div class="history-thumb">
        <img src="${h.imageBase64 || h.imageUrl}" alt="Version">
      </div>
      <div class="history-info">
        <div class="time">${sideBadge} ${formatTime(h.timestamp)}</div>
        <div class="label">${h.label}</div>
      </div>
    </div>`;
  }).join('');
}

function restoreFromSession(id) {
  const entry = state.sessionHistory.find(h => h.id === id);
  if (entry) {
    const side = entry.side || 'front';
    state[side].imageBase64 = entry.imageBase64;
    state[side].historyId = entry.id;
    state.currentImageBase64 = entry.imageBase64;
    state.currentHistoryId = entry.id;
    displayCardSide(side, entry.imageBase64);
    switchCardTab(side);
    if (side === 'back') {
      document.getElementById('btnGenerateBack').style.display = 'none';
      document.getElementById('btnDownloadBack').style.display = '';
      document.getElementById('btnDownloadBoth').style.display = state.front.imageBase64 ? '' : 'none';
    }
    showToast('Version restaurada', 'info');
  }
}

// ============ History Modal ============
async function showHistoryModal() {
  const modal = document.getElementById('historyModal');
  const list = document.getElementById('fullHistoryList');
  modal.classList.add('active');

  try {
    const res = await fetch('/api/history');
    const history = await res.json();

    if (history.length === 0) {
      list.innerHTML = `
        <div class="history-empty" style="padding:3rem;">
          <div class="empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          No hay historial aun
        </div>`;
      return;
    }

    list.innerHTML = history.map(h => `
      <div class="history-item" style="margin-bottom:0.5rem;">
        <div class="history-thumb">
          <img src="${h.imagePath}" alt="Tarjeta">
        </div>
        <div class="history-info">
          <div class="time">${formatTime(h.timestamp)}</div>
          <div class="label">${h.datos?.nombre || 'Sin nombre'} - ${h.datos?.categoria || ''}</div>
          ${h.editInstructions ? `<div class="time" style="color:var(--accent);">Edicion: ${h.editInstructions.substring(0, 40)}...</div>` : ''}
        </div>
        <button class="btn btn-danger-ghost btn-icon" onclick="event.stopPropagation();deleteHistory('${h.id}')" title="Eliminar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<p style="color:var(--danger);text-align:center;padding:2rem;">Error al cargar historial</p>';
  }
}

function closeHistoryModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('historyModal').classList.remove('active');
}

async function deleteHistory(id) {
  try {
    await fetch(`/api/history/${id}`, { method: 'DELETE' });
    showHistoryModal();
    showToast('Eliminado del historial', 'info');
  } catch (err) {
    showToast('Error al eliminar', 'error');
  }
}

// ============ Download ============
function downloadCard(which = 'front') {
  const cat = state.selectedCategory || 'presentacion';
  const ts = Date.now();

  if (which === 'both') {
    if (state.front.imageBase64) downloadSingle(state.front.imageBase64, `tarjeta_${cat}_frente_${ts}.png`);
    setTimeout(() => {
      if (state.back.imageBase64) downloadSingle(state.back.imageBase64, `tarjeta_${cat}_reverso_${ts}.png`);
    }, 500);
    showToast('Descargando ambas caras', 'success');
    return;
  }

  const img = state[which]?.imageBase64;
  if (!img) {
    showToast(`No hay ${which === 'front' ? 'frente' : 'reverso'} para descargar`, 'error');
    return;
  }
  const suffix = which === 'front' ? 'frente' : 'reverso';
  downloadSingle(img, `tarjeta_${cat}_${suffix}_${ts}.png`);
  showToast('Descarga iniciada', 'success');
}

function downloadSingle(base64, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = base64;
  link.click();
}

// ============ Utilities ============
function showLoading(show, text) {
  const overlay = document.getElementById('loadingOverlay');
  if (text) {
    overlay.querySelector('.loading-text').textContent = text;
  } else {
    overlay.querySelector('.loading-text').textContent = 'Generando tu tarjeta con IA...';
  }
  overlay.classList.toggle('active', show);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons = {
    success: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `${icons[type] || ''}${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px) scale(0.95)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(2.55 * percent));
  const b = Math.min(255, (num & 0x0000FF) + Math.round(2.55 * percent));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function darkenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
  const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(2.55 * percent));
  const b = Math.max(0, (num & 0x0000FF) - Math.round(2.55 * percent));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}
