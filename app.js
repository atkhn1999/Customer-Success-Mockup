/* Global state and helpers */
const state = {
  missionGoals: [],
  valueRealized: [],
  objectives: [],
  pastObjectives: [],
  stakeholders: [],
  contacts: [
    { id: 1, name: 'Jane Doe', title: 'VP, Sales' },
    { id: 2, name: 'John Smith', title: 'Project Manager' },
    { id: 3, name: 'Samantha Ray', title: 'Director of Operations' },
    { id: 4, name: 'Mike Chen', title: 'Lead Engineer' }
  ],
};

const objectiveNameOptions = [
  'Reduce time spent per response',
  'Adoption',
  'Content library clean up',
  'Increase win rate',
  'Improve time to value',
];

const valueTypes = [
  'Time Savings',
  'Win Rate Increase',
  'Adoption Rate',
  'Cost Reduction',
  'Revenue Growth',
  'Productivity Gain',
];

const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));
const todayStr = () => new Date().toISOString().slice(0, 10);

function setLastUpdated() {
  const el = $('#lastUpdated');
  if (el) el.textContent = `Last updated: ${new Date().toLocaleString()}`;
}

function showToast(message) {
  const root = $('#toastRoot');
  const item = document.createElement('div');
  item.className = 'pointer-events-auto rounded-md bg-slate-900 text-white px-3 py-2 text-sm shadow-md';
  item.textContent = message;
  root.appendChild(item);
  setTimeout(() => {
    item.classList.add('opacity-0', 'transition');
    setTimeout(() => item.remove(), 200);
  }, 1800);
}

/* Modal helpers */
function openModal(innerHtml) {
  const root = $('#modalRoot');
  const content = $('#modalContent');
  content.innerHTML = innerHtml;
  root.classList.remove('hidden');
  root.classList.add('flex');
}
function closeModal() {
  const root = $('#modalRoot');
  const content = $('#modalContent');
  content.innerHTML = '';
  root.classList.add('hidden');
  root.classList.remove('flex');
}

/* Health logic based on target date */
function computeHealthIcon(targetDate) {
  if (!targetDate) return '🟢';
  const days = (new Date(targetDate) - new Date()) / 86400000;
  if (days < 30) return '🔴';
  if (days < 90) return '🟡';
  return '🟢';
}

/* Mission Goals */
function renderMissionGoals() {
  const list = $('#goalsList');
  list.innerHTML = '';
  state.missionGoals.forEach((goal) => {
    const card = document.createElement('div');
    card.className = 'rounded-lg border border-slate-200 p-4 shadow-sm bg-white';
    card.dataset.id = String(goal.id);
    card.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <input data-role="goal-title" class="w-full rounded-md border border-slate-300 bg-white p-2 text-sm font-semibold shadow-sm" value="${goal.title || ''}" placeholder="Goal title" />
        <button data-role="remove-goal" class="text-slate-500 hover:text-red-600">&times;</button>
      </div>
      <textarea data-role="goal-desc" class="mt-2 w-full rounded-md border border-slate-300 bg-slate-100 p-3 text-sm shadow-sm resize" rows="3" placeholder="Describe this goal...">${goal.description || ''}</textarea>
      <div data-role="custom-fields" class="mt-3 space-y-2">
        ${(goal.customFields || [])
          .map(
            (f) => `
          <div class="flex items-center gap-2" data-field-id="${f.id}">
            <input data-role="cf-label" class="w-40 rounded-md border border-slate-300 bg-white p-2 text-xs font-semibold shadow-sm" value="${f.label || ''}" placeholder="Label" />
            <input data-role="cf-value" class="flex-1 rounded-md border border-slate-300 bg-white p-2 text-xs shadow-sm" value="${f.value || ''}" placeholder="Value or URL" />
            <button data-role="remove-cf" class="text-slate-400 hover:text-red-600" title="Remove">🗑️</button>
          </div>
        `,
          )
          .join('')}
      </div>
      <button data-role="add-cf" class="mt-2 text-cyan-700 font-semibold">+ Add Custom Field</button>
    `;
    list.appendChild(card);
  });
}

/* Value Realized */
function renderValueRealized() {
  const list = $('#valueRealizedList');
  list.innerHTML = '';
  state.valueRealized.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'rounded-lg border border-slate-200 p-4 shadow-sm bg-white';
    card.dataset.id = String(item.id);
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <select data-role="value-type" class="rounded-md border border-slate-300 bg-white p-2 text-sm font-semibold shadow-sm">
          ${valueTypes.map((t) => `<option ${t === item.type ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
        <button data-role="remove-value" class="text-slate-500 hover:text-red-600">&times;</button>
      </div>
      <div class="mt-3">
        <label class="mb-1 block text-xs font-medium">Description</label>
        <div data-role="desc-preview" class="cursor-pointer rounded-md border border-slate-300 bg-slate-100 p-3 text-sm shadow-sm">${
          item.description ? item.description.slice(0, 140) + (item.description.length > 140 ? '…' : '') : 'Click to add description'
        }</div>
      </div>
      <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs font-medium">Date Realized</label>
          <input data-role="value-date" type="date" class="w-full rounded-md border border-slate-300 bg-white p-2 text-sm shadow-sm" value="${item.date || ''}" />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium">Reference Link</label>
          <div class="relative">
            <span class="pointer-events-none absolute inset-y-0 left-2 flex items-center text-slate-400"><i class="ph ph-link-simple"></i></span>
            <input data-role="value-link" type="text" class="w-full rounded-md border border-slate-300 bg-white p-2 pl-8 text-sm shadow-sm" placeholder="https://" value="${item.link || ''}" />
          </div>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

/* Objectives */
function objectiveCardHtml(o, isPast = false) {
  const health = computeHealthIcon(o.targetDate);
  return `
    <div class="rounded-lg border border-slate-200 p-4 shadow-sm bg-white" data-id="${o.id}">
      <div class="flex items-start justify-between gap-2">
        <div>
          <div class="text-xl font-semibold">${health} ${o.name}</div>
          <div class="mt-1 flex items-center gap-2 text-sm">
            <select data-role="status" class="rounded-md border border-slate-300 bg-white p-1 text-xs shadow-sm">
              ${['Not Started', 'In Progress', 'At Risk', 'Completed']
                .map((s) => `<option ${o.status === s ? 'selected' : ''}>${s}</option>`) 
                .join('')}
            </select>
            <input data-role="date" type="date" class="rounded-md border border-slate-300 bg-white p-1 text-sm shadow-sm" value="${o.targetDate || ''}" />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button data-role="view" class="rounded-md bg-slate-100 px-2 py-1 text-sm hover:bg-slate-200">View Details</button>
          <button data-role="edit" class="rounded-md bg-cyan-600 px-2 py-1 text-sm text-white hover:bg-cyan-700">Edit</button>
        </div>
      </div>
      <div class="mt-3 text-sm text-slate-700">
        <div class="font-medium">Objective Goal</div>
        <div class="rounded-md border border-slate-200 bg-slate-50 p-3">${o.goal ? o.goal : '<span class="text-slate-400">No goal set</span>'}</div>
      </div>
    </div>
  `;
}

function renderObjectives() {
  const cur = $('#currentObjectivesList');
  const past = $('#pastObjectivesList');
  cur.innerHTML = '';
  past.innerHTML = '';
  state.objectives.forEach((o) => {
    const wrap = document.createElement('div');
    wrap.innerHTML = objectiveCardHtml(o);
    cur.appendChild(wrap.firstElementChild);
  });
  state.pastObjectives.forEach((o) => {
    const wrap = document.createElement('div');
    wrap.innerHTML = objectiveCardHtml(o, true);
    past.appendChild(wrap.firstElementChild);
  });
}

/* Stakeholders */
function renderStakeholders() {
  const select = $('#stakeholderSelect');
  const list = $('#stakeholdersList');
  // Build select
  const existingIds = new Set(state.stakeholders.map((s) => s.id));
  select.innerHTML = `
    <option value="">Select a contact...</option>
    ${state.contacts
      .filter((c) => !existingIds.has(c.id))
      .map((c) => `<option value="${c.id}">${c.name} — ${c.title}</option>`) 
      .join('')}
    <option value="new">Add New Stakeholder...</option>
  `;
  // Build cards
  list.innerHTML = '';
  state.stakeholders.forEach((s) => {
    const card = document.createElement('div');
    card.className = 'flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3';
    card.dataset.id = String(s.id);
    card.innerHTML = `
      <div>
        <div class="font-semibold">${s.name}</div>
        <div class="text-sm text-slate-600">${s.title}</div>
      </div>
      <button data-role="remove-stakeholder" class="text-slate-500 hover:text-red-600">&times;</button>
    `;
    list.appendChild(card);
  });
}

/* Filters - Suggested KPIs */
const productToKpis = {
  AI: ['Unedited AI responses', '% answers with AI', 'Avg response time with AI', 'Deflection rate'],
  Analytics: ['Dashboard adoption', 'Weekly active users', 'Reports created per user'],
  Messaging: ['Median reply time', 'CSAT on responses', 'Open rate'],
  Automation: ['Workflows executed', 'Hours saved', 'Error reduction %'],
};
function wireFilters() {
  const products = $('#filterProducts');
  const wrap = $('#suggestedKpis');
  const list = $('#suggestedKpisList');
  products.addEventListener('change', () => {
    const val = products.value;
    const kpis = productToKpis[val] || [];
    if (!kpis.length) {
      wrap.classList.add('hidden');
      list.innerHTML = '';
    } else {
      wrap.classList.remove('hidden');
      list.innerHTML = kpis.map((k) => `<li>${k}</li>`).join('');
    }
  });
}

/* Objective Modals */
function openAddObjectiveModal() {
  const options = objectiveNameOptions
    .map((o) => `<option value="${o}">${o}</option>`)
    .join('');
  openModal(`
    <div class="border-b border-slate-200 px-5 py-4">
      <div class="text-lg font-semibold">Add Objective</div>
    </div>
    <div class="p-5 space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium">Objective Name</label>
        <select id="addObjNameSelect" class="w-full rounded-md border border-slate-300 bg-white p-2 text-sm shadow-sm">
          <option value="">Select a name</option>
          ${options}
          <option value="__custom">Create a new objective...</option>
        </select>
        <input id="addObjNameCustom" type="text" class="mt-2 hidden w-full rounded-md border border-slate-300 bg-white p-2 text-sm shadow-sm" placeholder="Custom objective name" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Target Date</label>
        <input id="addObjDate" type="date" class="w-full rounded-md border border-slate-300 bg-white p-2 text-sm shadow-sm" value="${todayStr()}" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Objective Goal</label>
        <textarea id="addObjGoal" class="w-full rounded-md border border-slate-300 bg-slate-100 p-3 text-sm shadow-sm resize" rows="4" placeholder="Describe the objective goal..."></textarea>
      </div>
    </div>
    <div class="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
      <button id="modalCancel" class="rounded-md bg-slate-100 px-3 py-2 text-sm">Cancel</button>
      <button id="modalSave" class="rounded-md bg-cyan-600 px-3 py-2 text-sm text-white">Add Objective</button>
    </div>
  `);
  const sel = $('#addObjNameSelect');
  const custom = $('#addObjNameCustom');
  sel.addEventListener('change', () => {
    if (sel.value === '__custom') custom.classList.remove('hidden');
    else custom.classList.add('hidden');
  });
  $('#modalCancel').addEventListener('click', closeModal);
  $('#modalSave').addEventListener('click', () => {
    const name = sel.value === '__custom' ? custom.value.trim() : sel.value;
    const date = $('#addObjDate').value;
    const goal = $('#addObjGoal').value.trim();
    if (!name) return showToast('Please choose a name');
    const id = Date.now() + Math.random();
    state.objectives.unshift({ id, name, targetDate: date, goal, status: 'Not Started' });
    renderObjectives();
    closeModal();
  });
}

function openViewObjectiveModal(obj) {
  openModal(`
    <div class="border-b border-slate-200 px-5 py-4">
      <div class="text-lg font-semibold">Objective Details</div>
    </div>
    <div class="p-5 space-y-4 text-sm">
      <div><span class="font-medium">Name:</span> ${obj.name}</div>
      <div><span class="font-medium">Target Date:</span> ${obj.targetDate || '—'}</div>
      <div>
        <div class="font-medium">Goal</div>
        <div class="rounded-md border border-slate-200 bg-slate-50 p-3">${obj.goal || '—'}</div>
      </div>
      <div>
        <div class="font-medium">Challenges</div>
        <div class="rounded-md border border-slate-200 bg-slate-50 p-3">${obj.challenges || '—'}</div>
      </div>
      <div>
        <div class="font-medium">Next Steps</div>
        <div class="rounded-md border border-slate-200 bg-slate-50 p-3">${obj.nextSteps || '—'}</div>
      </div>
    </div>
    <div class="flex justify-end border-t border-slate-200 px-5 py-4">
      <button id="modalClose" class="rounded-md bg-cyan-600 px-3 py-2 text-sm text-white">Close</button>
    </div>
  `);
  $('#modalClose').addEventListener('click', closeModal);
}

function openEditObjectiveModal(obj) {
  openModal(`
    <div class="border-b border-slate-200 px-5 py-4">
      <div class="text-lg font-semibold">Edit Objective</div>
    </div>
    <div class="p-5 space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium">Objective Name</label>
        <input id="editName" type="text" class="w-full rounded-md border border-slate-300 bg-white p-2 text-sm shadow-sm" value="${obj.name}" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Target Date</label>
        <input id="editDate" type="date" class="w-full rounded-md border border-slate-300 bg-white p-2 text-sm shadow-sm" value="${obj.targetDate || ''}" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Objective Goal</label>
        <textarea id="editGoal" class="w-full rounded-md border border-slate-300 bg-slate-100 p-3 text-sm shadow-sm resize" rows="4">${obj.goal || ''}</textarea>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Challenges</label>
        <textarea id="editChallenges" class="w-full rounded-md border border-slate-300 bg-slate-100 p-3 text-sm shadow-sm resize" rows="3">${obj.challenges || ''}</textarea>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Next Steps</label>
        <textarea id="editNextSteps" class="w-full rounded-md border border-slate-300 bg-slate-100 p-3 text-sm shadow-sm resize" rows="3">${obj.nextSteps || ''}</textarea>
      </div>
    </div>
    <div class="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
      <button id="modalCancel" class="rounded-md bg-slate-100 px-3 py-2 text-sm">Cancel</button>
      <button id="modalSave" class="rounded-md bg-cyan-600 px-3 py-2 text-sm text-white">Save</button>
    </div>
  `);
  $('#modalCancel').addEventListener('click', closeModal);
  $('#modalSave').addEventListener('click', () => {
    obj.name = $('#editName').value.trim() || obj.name;
    obj.targetDate = $('#editDate').value;
    obj.goal = $('#editGoal').value;
    obj.challenges = $('#editChallenges').value;
    obj.nextSteps = $('#editNextSteps').value;
    // Move if completed
    if (obj.status === 'Completed') moveObjectiveToPast(obj.id);
    renderObjectives();
    closeModal();
  });
}

function moveObjectiveToPast(id) {
  const idx = state.objectives.findIndex((o) => o.id === id);
  if (idx === -1) return;
  const [obj] = state.objectives.splice(idx, 1);
  state.pastObjectives.unshift(obj);
}

/* Value description modal */
function openEditValueDescription(item) {
  openModal(`
    <div class="border-b border-slate-200 px-5 py-4">
      <div class="text-lg font-semibold">Edit Description</div>
    </div>
    <div class="p-5">
      <textarea id="valDesc" class="w-full rounded-md border border-slate-300 bg-slate-100 p-3 text-sm shadow-sm resize" rows="8">${item.description || ''}</textarea>
    </div>
    <div class="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
      <button id="modalCancel" class="rounded-md bg-slate-100 px-3 py-2 text-sm">Cancel</button>
      <button id="modalSave" class="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white">Save</button>
    </div>
  `);
  $('#modalCancel').addEventListener('click', closeModal);
  $('#modalSave').addEventListener('click', () => {
    item.description = $('#valDesc').value;
    renderValueRealized();
    closeModal();
  });
}

function openAddStakeholderModal() {
  openModal(`
    <div class="border-b border-slate-200 px-5 py-4">
      <div class="text-lg font-semibold">Add New Stakeholder</div>
    </div>
    <div class="p-5 space-y-3">
      <div>
        <label class="mb-1 block text-sm font-medium">Name</label>
        <input id="newStakeName" type="text" class="w-full rounded-md border border-slate-300 bg-white p-2 text-sm shadow-sm" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Title</label>
        <input id="newStakeTitle" type="text" class="w-full rounded-md border border-slate-300 bg-white p-2 text-sm shadow-sm" />
      </div>
    </div>
    <div class="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
      <button id="modalCancel" class="rounded-md bg-slate-100 px-3 py-2 text-sm">Cancel</button>
      <button id="modalSave" class="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white">Add</button>
    </div>
  `);
  $('#modalCancel').addEventListener('click', closeModal);
  $('#modalSave').addEventListener('click', () => {
    const name = $('#newStakeName').value.trim();
    const title = $('#newStakeTitle').value.trim();
    if (!name || !title) return showToast('Please fill name and title');
    const id = Date.now() + Math.random();
    state.stakeholders.push({ id, name, title });
    renderStakeholders();
    closeModal();
  });
}

/* PDF Export */
async function generatePdf() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');

  const canvas = await html2canvas(document.body, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const pageCanvas = document.createElement('canvas');
  const ctx = pageCanvas.getContext('2d');
  const pagePixelWidth = canvas.width;
  const pagePixelHeight = Math.floor((pageHeight - 20) * (canvas.width / (pageWidth - 20)));
  pageCanvas.width = pagePixelWidth;
  pageCanvas.height = pagePixelHeight;

  let rendered = 0;
  let pageIndex = 0;
  while (rendered < canvas.height) {
    ctx.clearRect(0, 0, pagePixelWidth, pagePixelHeight);
    ctx.drawImage(
      canvas,
      0,
      rendered,
      pagePixelWidth,
      Math.min(pagePixelHeight, canvas.height - rendered),
      0,
      0,
      pagePixelWidth,
      Math.min(pagePixelHeight, canvas.height - rendered)
    );
    const pageImgData = pageCanvas.toDataURL('image/png');
    if (pageIndex > 0) pdf.addPage();
    pdf.addImage(pageImgData, 'PNG', 10, 10, pageWidth - 20, (pageWidth - 20) * (pageCanvas.height / pageCanvas.width));
    rendered += pagePixelHeight;
    pageIndex += 1;
  }

  pdf.save('customer-success-plan.pdf');
}

/* Wire events */
function wireEvents() {
  // Add Goal
  $('#addGoalBtn').addEventListener('click', () => {
    state.missionGoals.push({ id: Date.now() + Math.random(), title: 'New Goal', description: '', customFields: [] });
    renderMissionGoals();
  });

  // Goals list delegations
  $('#goalsList').addEventListener('click', (e) => {
    const card = e.target.closest('[data-id]');
    if (!card) return;
    const id = Number(card.dataset.id);
    const goal = state.missionGoals.find((g) => g.id === id);
    if (!goal) return;

    if (e.target.matches('[data-role="remove-goal"]')) {
      state.missionGoals = state.missionGoals.filter((g) => g.id !== id);
      renderMissionGoals();
    }
    if (e.target.matches('[data-role="add-cf"]')) {
      goal.customFields.push({ id: Date.now() + Math.random(), label: 'Label', value: '' });
      renderMissionGoals();
    }
    if (e.target.matches('[data-role="remove-cf"]')) {
      const fieldWrap = e.target.closest('[data-field-id]');
      const fid = Number(fieldWrap.dataset.fieldId);
      goal.customFields = goal.customFields.filter((f) => f.id !== fid);
      renderMissionGoals();
    }
  });
  $('#goalsList').addEventListener('input', (e) => {
    const card = e.target.closest('[data-id]');
    if (!card) return;
    const id = Number(card.dataset.id);
    const goal = state.missionGoals.find((g) => g.id === id);
    if (!goal) return;

    if (e.target.matches('[data-role="goal-title"]')) goal.title = e.target.value;
    if (e.target.matches('[data-role="goal-desc"]')) goal.description = e.target.value;
    if (e.target.matches('[data-role="cf-label"], [data-role="cf-value"]')) {
      const fieldWrap = e.target.closest('[data-field-id]');
      const fid = Number(fieldWrap.dataset.fieldId);
      const field = goal.customFields.find((f) => f.id === fid);
      if (!field) return;
      if (e.target.dataset.role === 'cf-label') field.label = e.target.value;
      if (e.target.dataset.role === 'cf-value') field.value = e.target.value;
    }
  });

  // Value realized
  $('#addValueBtn').addEventListener('click', () => {
    state.valueRealized.push({ id: Date.now() + Math.random(), type: valueTypes[0], description: '', date: '', link: '' });
    renderValueRealized();
  });
  $('#valueRealizedList').addEventListener('click', (e) => {
    const card = e.target.closest('[data-id]');
    if (card && e.target.matches('[data-role="remove-value"]')) {
      const id = Number(card.dataset.id);
      state.valueRealized = state.valueRealized.filter((v) => v.id !== id);
      renderValueRealized();
    }
    if (card && e.target.matches('[data-role="desc-preview"]')) {
      const id = Number(card.dataset.id);
      const item = state.valueRealized.find((v) => v.id === id);
      if (item) openEditValueDescription(item);
    }
  });
  $('#valueRealizedList').addEventListener('input', (e) => {
    const card = e.target.closest('[data-id]');
    if (!card) return;
    const id = Number(card.dataset.id);
    const item = state.valueRealized.find((v) => v.id === id);
    if (!item) return;
    if (e.target.matches('[data-role="value-date"]')) item.date = e.target.value;
    if (e.target.matches('[data-role="value-link"]')) item.link = e.target.value;
    if (e.target.matches('[data-role="value-type"]')) item.type = e.target.value;
  });

  // Objectives
  $('#addObjectiveBtn').addEventListener('click', openAddObjectiveModal);
  $('#currentObjectivesList').addEventListener('change', (e) => {
    const card = e.target.closest('[data-id]');
    if (!card) return;
    const id = Number(card.dataset.id);
    const obj = state.objectives.find((o) => o.id === id);
    if (!obj) return;
    if (e.target.matches('[data-role="status"]')) {
      obj.status = e.target.value;
      if (obj.status === 'Completed') {
        // animate then move
        const el = card;
        el.classList.add('ring-2', 'ring-emerald-400');
        setTimeout(() => {
          moveObjectiveToPast(id);
          renderObjectives();
        }, 180);
      } else {
        renderObjectives();
      }
    }
    if (e.target.matches('[data-role="date"]')) {
      obj.targetDate = e.target.value;
      renderObjectives();
    }
  });
  $('#currentObjectivesList').addEventListener('click', (e) => {
    const card = e.target.closest('[data-id]');
    if (!card) return;
    const id = Number(card.dataset.id);
    const obj = state.objectives.find((o) => o.id === id) || state.pastObjectives.find((o) => o.id === id);
    if (!obj) return;
    if (e.target.matches('[data-role="view"]')) openViewObjectiveModal(obj);
    if (e.target.matches('[data-role="edit"]')) openEditObjectiveModal(obj);
  });
  $('#pastObjectivesList').addEventListener('click', (e) => {
    const card = e.target.closest('[data-id]');
    if (!card) return;
    const id = Number(card.dataset.id);
    const obj = state.pastObjectives.find((o) => o.id === id);
    if (!obj) return;
    if (e.target.matches('[data-role="view"]')) openViewObjectiveModal(obj);
    if (e.target.matches('[data-role="edit"]')) openEditObjectiveModal(obj);
  });

  // Stakeholders
  renderStakeholders();
  // Open modal immediately when selecting "Add New Stakeholder..."
  $('#stakeholderSelect').addEventListener('change', (e) => {
    if (e.target.value === 'new') {
      openAddStakeholderModal();
      // reset select so user can pick again easily
      e.target.value = '';
    }
  });
  $('#addStakeholderBtn').addEventListener('click', () => {
    const sel = $('#stakeholderSelect');
    const val = sel.value;
    if (val === 'new') {
      openAddStakeholderModal();
    } else if (val) {
      const id = Number(val);
      const pick = state.contacts.find((c) => c.id === id);
      if (pick && !state.stakeholders.find((s) => s.id === id)) {
        state.stakeholders.push(pick);
        renderStakeholders();
        sel.value = '';
      }
    }
  });
  $('#stakeholdersList').addEventListener('click', (e) => {
    const card = e.target.closest('[data-id]');
    if (card && e.target.matches('[data-role="remove-stakeholder"]')) {
      const id = Number(card.dataset.id);
      state.stakeholders = state.stakeholders.filter((s) => s.id !== id);
      renderStakeholders();
    }
  });

  // PDF
  $('#generatePdfBtn').addEventListener('click', generatePdf);
}

function seedInitialData() {
  state.missionGoals = [
    {
      id: Date.now(),
      title: 'Time Savings',
      description: 'Reduce manual effort by 20% via automation and standardized responses.',
      customFields: [
        { id: Date.now() + 1, label: 'Doc', value: 'https://example.com/playbook' },
      ],
    },
  ];
  state.valueRealized = [
    { id: Date.now() + 2, type: 'Time Savings', description: 'Saved ~5 hours/week per agent in Q3.', date: todayStr(), link: '' },
  ];
  state.objectives = [
    { id: Date.now() + 3, name: 'Reduce time spent per response', targetDate: todayStr(), status: 'In Progress', goal: 'Cut average handle time by 30%.' },
  ];
  state.pastObjectives = [];
  state.stakeholders = [state.contacts[0]];
}

function init() {
  setLastUpdated();
  seedInitialData();
  renderMissionGoals();
  renderValueRealized();
  renderObjectives();
  renderStakeholders();
  wireFilters();
  wireEvents();
}

window.addEventListener('DOMContentLoaded', init);