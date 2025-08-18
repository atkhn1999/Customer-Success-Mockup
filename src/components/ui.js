// UI Components Module

import { icons, getIcon } from '../utils/icons.js';
import { formatDate, formatDateTime, getRelativeTime } from '../utils/dates.js';
import { stateManager } from '../utils/state.js';

/**
 * Create modal component
 * @param {string} title - Modal title
 * @param {string} content - Modal body content
 * @param {Object} options - Modal options
 * @returns {HTMLElement} Modal element
 */
export function createModal(title, content, options = {}) {
  const {
    onConfirm = null,
    onCancel = null,
    confirmText = 'Save',
    cancelText = 'Cancel',
    showFooter = true
  } = options;

  const modalHtml = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-panel">
        <div class="modal-header">
          <h2 class="modal-title">${title}</h2>
          <button class="btn btn-ghost btn-sm" onclick="closeModal()">
            ${getIcon('close')}
          </button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        ${showFooter ? `
          <div class="modal-footer">
            <button class="btn btn-secondary" id="modal-cancel">
              ${cancelText}
            </button>
            <button class="btn btn-primary" id="modal-confirm">
              ${confirmText}
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Create element
  const modalEl = document.createElement('div');
  modalEl.innerHTML = modalHtml;
  const modal = modalEl.firstElementChild;

  // Add event listeners
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  if (showFooter) {
    modal.querySelector('#modal-cancel').addEventListener('click', () => {
      if (onCancel) onCancel();
      closeModal();
    });

    modal.querySelector('#modal-confirm').addEventListener('click', () => {
      if (onConfirm) onConfirm();
      closeModal();
    });
  }

  // Add to document
  document.body.appendChild(modal);

  // Focus first input
  setTimeout(() => {
    const firstInput = modal.querySelector('input, textarea, select');
    if (firstInput) firstInput.focus();
  }, 100);

  return modal;
}

/**
 * Close current modal
 */
export function closeModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.remove();
  }
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 * @param {number} duration - Duration in milliseconds
 */
export function showNotification(message, type = 'info', duration = 3000) {
  const iconMap = {
    success: 'check',
    error: 'alert',
    info: 'info'
  };

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    ${getIcon(iconMap[type] || 'info')}
    <span>${message}</span>
    <button class="ml-auto" onclick="this.parentElement.remove()">
      ${getIcon('close', 'w-4 h-4')}
    </button>
  `;

  // Add to document
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);

  // Auto remove
  if (duration > 0) {
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

/**
 * Render header section
 * @param {Object} state - Application state
 * @returns {string} HTML string
 */
export function renderHeader(state) {
  return `
    <header class="bg-gradient-to-r from-responsive-teal to-responsive-teal-dark text-white py-8 px-6 shadow-lg">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-4xl font-extrabold mb-2 tracking-tight">Customer Success Plan</h1>
            <p class="text-2xl font-medium text-teal-50">${state.customerName}</p>
          </div>
          <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
            <p class="text-teal-50/90 text-sm font-light whitespace-nowrap">
              Last updated: <span id="last-updated-date">${state.lastUpdated}</span>
            </p>
            <div class="flex items-center gap-3">
              <button id="export-excel-btn" class="btn btn-secondary flex items-center gap-2" aria-label="Export to Excel">
                ${getIcon('excel')}
                <span>Export Excel</span>
              </button>
              <button id="export-pdf-btn" class="btn btn-primary flex items-center gap-2" aria-label="Export to PDF">
                ${getIcon('pdf')}
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `;
}

/**
 * Render section card
 * @param {Object} options - Section options
 * @returns {string} HTML string
 */
export function renderSection(options) {
  const {
    id,
    title,
    content,
    editable = false,
    editContent = '',
    className = ''
  } = options;

  return `
    <section id="${id}-section" class="card p-6 ${editable ? 'section-readonly' : ''} ${className}">
      ${editable ? `
        <div class="edit-overlay">
          <button class="btn btn-ghost btn-sm" data-edit="${id}" aria-label="Edit ${title}">
            ${getIcon('edit', 'w-4 h-4')}
          </button>
        </div>
      ` : ''}
      <h2 class="section-title mb-4">${title}</h2>
      <div id="${id}-display" class="${editable ? '' : 'hidden'}">
        ${content}
      </div>
      ${editable ? `
        <div id="${id}-edit" class="hidden">
          ${editContent}
          <div class="flex justify-end gap-2 mt-4">
            <button class="btn btn-secondary btn-sm" data-cancel="${id}">
              ${getIcon('cancel', 'w-4 h-4')}
              Cancel
            </button>
            <button class="btn btn-primary btn-sm" data-save="${id}">
              ${getIcon('save', 'w-4 h-4')}
              Save
            </button>
          </div>
        </div>
      ` : ''}
    </section>
  `;
}

/**
 * Render KPI card
 * @param {Object} kpi - KPI data
 * @param {number} objectiveId - Parent objective ID
 * @returns {string} HTML string
 */
export function renderKPICard(kpi, objectiveId) {
  const type = stateManager.getKPIType(kpi.typeKey);
  const delta = calculateDelta(kpi.currentValue, kpi.previousValue);
  const deltaNum = parseFloat(delta);
  const isPositive = type.higherIsBetter ? deltaNum >= 0 : deltaNum <= 0;
  const showDelta = kpi.comparePrevious && kpi.previousValue !== undefined;
  
  const periodLabel = {
    'Month': 'MoM',
    'Quarter': 'QoQ',
    'Year': 'YoY'
  }[kpi.period] || 'QoQ';
  
  return `
    <div class="kpi-card" data-kpi-id="${kpi.id}">
      <div class="flex justify-between items-start mb-2">
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-700">${type.label}</div>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex rounded-md border border-gray-300 overflow-hidden">
            <button class="px-2 py-1 text-xs font-medium ${kpi.period === 'Month' ? 'bg-responsive-teal text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}" 
                    onclick="updateKPIPeriod(${objectiveId}, ${kpi.id}, 'Month')">M</button>
            <button class="px-2 py-1 text-xs font-medium border-l border-gray-300 ${kpi.period === 'Quarter' ? 'bg-responsive-teal text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}" 
                    onclick="updateKPIPeriod(${objectiveId}, ${kpi.id}, 'Quarter')">Q</button>
            <button class="px-2 py-1 text-xs font-medium border-l border-gray-300 ${kpi.period === 'Year' ? 'bg-responsive-teal text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}" 
                    onclick="updateKPIPeriod(${objectiveId}, ${kpi.id}, 'Year')">Y</button>
          </div>
          <button class="text-gray-400 hover:text-gray-600" onclick="editKPI(${objectiveId}, ${kpi.id})" aria-label="Edit KPI">
            ${getIcon('edit', 'w-4 h-4')}
          </button>
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="kpi-value">${kpi.currentValue}</span>
        <span class="kpi-unit">${type.unit}</span>
        ${showDelta ? `
          <span class="kpi-delta ${isPositive ? 'positive' : 'negative'}">
            ${isPositive ? getIcon('arrowUp', 'w-4 h-4') : getIcon('arrowDown', 'w-4 h-4')}
            ${Math.abs(deltaNum)}% ${periodLabel}
          </span>
        ` : ''}
      </div>
      ${!kpi.comparePrevious ? `
        <button class="text-xs text-responsive-teal hover:text-responsive-teal-dark mt-1" 
                onclick="toggleKPIComparison(${objectiveId}, ${kpi.id})">
          Show comparison
        </button>
      ` : ''}
    </div>
  `;
}

/**
 * Render objective card
 * @param {Object} objective - Objective data
 * @param {boolean} isPast - Whether this is a past objective
 * @returns {string} HTML string
 */
export function renderObjectiveCard(objective, isPast = false) {
  const statusClass = {
    'In Progress': 'status-cyan',
    'Not Started': 'status-gray',
    'Completed': 'status-green',
    'At Risk': 'status-yellow'
  }[objective.status] || 'status-gray';
  
  return `
    <div class="card p-6 avoid-break" data-id="${objective.id}">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="font-semibold text-lg">${objective.name}</h3>
          <div class="flex items-center gap-3 mt-2">
            <span class="status-pill ${statusClass}">${objective.status}</span>
            <span class="text-sm text-gray-500">Target: ${formatDate(objective.targetDate)}</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm" onclick="editObjective(${objective.id}, ${isPast})">
            ${getIcon('edit', 'w-4 h-4')}
            Edit
          </button>
          ${!isPast ? `
            <button class="btn btn-primary btn-sm" onclick="showAddKPIModal(${objective.id})">
              ${getIcon('plus', 'w-4 h-4')}
              Add KPI
            </button>
          ` : `
            <button class="btn btn-danger btn-sm" onclick="removePastObjective(${objective.id})">
              ${getIcon('trash', 'w-4 h-4')}
              Remove
            </button>
          `}
        </div>
      </div>
      
      <p class="text-sm text-gray-600 mb-4">${objective.description}</p>
      
      ${objective.kpis && objective.kpis.length > 0 ? `
        <div class="space-y-3 mb-4">
          <h4 class="font-semibold text-sm text-gray-700">Key Performance Indicators</h4>
          ${objective.kpis.map(kpi => renderKPICard(kpi, objective.id)).join('')}
        </div>
      ` : ''}
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span class="font-medium text-gray-600">Challenges:</span>
          <p class="text-gray-700 mt-1">${objective.challenges || 'None identified'}</p>
        </div>
        <div>
          <span class="font-medium text-gray-600">Next Steps:</span>
          <p class="text-gray-700 mt-1">${objective.nextSteps || 'To be determined'}</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render health status pills
 * @param {string} currentHealth - Current health status
 * @returns {string} HTML string
 */
export function renderHealthPills(currentHealth) {
  const options = [
    { value: 'green', label: 'Healthy', class: 'health-pill-green' },
    { value: 'yellow', label: 'At Risk', class: 'health-pill-yellow' },
    { value: 'red', label: 'Critical', class: 'health-pill-red' }
  ];

  return `
    <div class="health-pills" role="radiogroup" aria-label="Overall health status">
      ${options.map(option => `
        <div class="health-pill ${option.class}">
          <input type="radio" 
                 id="health-${option.value}" 
                 name="planHealth" 
                 value="${option.value}"
                 ${currentHealth === option.value ? 'checked' : ''}
                 onchange="updateHealth('${option.value}')"
                 aria-label="${option.label}">
          <label for="health-${option.value}">${option.label}</label>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render stakeholder card
 * @param {Object} stakeholder - Stakeholder data
 * @returns {string} HTML string
 */
export function renderStakeholderCard(stakeholder) {
  return `
    <div class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
      <div>
        <p class="font-semibold text-sm">${stakeholder.name}</p>
        <p class="text-xs text-gray-600">${stakeholder.title}</p>
        <p class="text-xs text-gray-500">${stakeholder.email}</p>
      </div>
      <button class="text-gray-400 hover:text-red-600 text-xl" 
              onclick="removeStakeholder(${stakeholder.id})"
              aria-label="Remove stakeholder">
        ${getIcon('close')}
      </button>
    </div>
  `;
}

/**
 * Calculate percentage delta
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {string} Percentage change
 */
function calculateDelta(current, previous) {
  if (!previous || previous === 0) return '0';
  return ((current - previous) / Math.abs(previous) * 100).toFixed(1);
}

/**
 * Auto-resize textarea
 * @param {HTMLTextAreaElement} textarea - Textarea element
 */
export function autoResizeTextarea(textarea) {
  if (!textarea) return;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight + 2}px`;
}

/**
 * Apply auto-resize to all textareas
 * @param {HTMLElement} root - Root element
 */
export function applyAutoResize(root = document) {
  const textareas = root.querySelectorAll('textarea');
  textareas.forEach(autoResizeTextarea);
}