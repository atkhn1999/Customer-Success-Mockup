// PDF export module with enhanced formatting

import html2pdf from 'html2pdf.js';
import { formatDate } from '../utils/dates.js';

/**
 * Generate PDF from the success plan
 * @param {Object} state - Current application state
 * @returns {Promise<void>}
 */
export async function exportToPDF(state) {
  // Create a clone of the document for PDF generation
  const element = createPDFContent(state);
  
  // Configure PDF options
  const options = {
    filename: `success-plan-${state.customerName.toLowerCase().replace(/\s+/g, '-')}-${formatDate(new Date()).toLowerCase().replace(/\s+/g, '-')}.pdf`,
    margin: [0.75, 0.75, 0.75, 0.75], // inches
    image: { 
      type: 'jpeg', 
      quality: 0.98 
    },
    html2canvas: { 
      scale: 2, // Higher scale for better quality
      useCORS: true,
      letterRendering: true,
      logging: false,
      onclone: (doc) => {
        // Apply print styles to cloned document
        const style = doc.createElement('style');
        style.textContent = getPrintStyles();
        doc.head.appendChild(style);
      }
    },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', 
      orientation: 'portrait',
      compress: true 
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break-before',
      after: '.page-break-after',
      avoid: ['.avoid-break', '.card', '.kpi-card']
    }
  };

  try {
    // Generate PDF
    await html2pdf().set(options).from(element).save();
    
    // Clean up
    element.remove();
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
}

/**
 * Create PDF content with proper formatting
 * @param {Object} state - Application state
 * @returns {HTMLElement} PDF content element
 */
function createPDFContent(state) {
  const container = document.createElement('div');
  container.className = 'pdf-export-content';
  container.style.cssText = `
    width: 7.5in;
    margin: 0 auto;
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #111827;
    background: white;
  `;

  container.innerHTML = `
    <!-- Header -->
    <div class="pdf-header" style="background: #14b8a6; color: white; padding: 1.5rem; margin: -0.75in -0.75in 1.5rem; border-radius: 0;">
      <h1 style="font-size: 28pt; font-weight: 800; margin: 0 0 0.5rem 0;">Customer Success Plan</h1>
      <div style="font-size: 18pt; font-weight: 500; margin-bottom: 0.5rem;">${state.customerName}</div>
      <div style="font-size: 10pt; opacity: 0.9;">Last updated: ${state.lastUpdated}</div>
    </div>

    <!-- Mission Summary -->
    <section class="avoid-break" style="margin-bottom: 2rem;">
      <h2 style="font-size: 18pt; font-weight: 700; color: #111827; margin-bottom: 1rem;">Mission Summary</h2>
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 1rem; border-radius: 0.5rem;">
        <p style="margin: 0;">${state.missionSummary || 'No mission summary defined.'}</p>
      </div>
    </section>

    <!-- Mission Goals -->
    <section class="avoid-break" style="margin-bottom: 2rem;">
      <h2 style="font-size: 18pt; font-weight: 700; color: #111827; margin-bottom: 1rem;">Mission Goals</h2>
      ${renderMissionGoalsPDF(state.missionGoals)}
    </section>

    <!-- Current Objectives -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 18pt; font-weight: 700; color: #111827; margin-bottom: 1rem;">Current Objectives</h2>
      ${renderObjectivesPDF(state.objectives)}
    </section>

    <!-- Value Realized -->
    <section class="avoid-break" style="margin-bottom: 2rem;">
      <h2 style="font-size: 18pt; font-weight: 700; color: #111827; margin-bottom: 1rem;">Value Realized</h2>
      ${renderValueRealizedPDF(state.valueRealized)}
    </section>

    <!-- Overall Health -->
    <section class="avoid-break" style="margin-bottom: 2rem;">
      <h2 style="font-size: 18pt; font-weight: 700; color: #111827; margin-bottom: 1rem;">Overall Health Status</h2>
      ${renderHealthStatusPDF(state.planHealth)}
    </section>

    <!-- Key Stakeholders -->
    <section class="avoid-break" style="margin-bottom: 2rem;">
      <h2 style="font-size: 18pt; font-weight: 700; color: #111827; margin-bottom: 1rem;">Key Stakeholders</h2>
      ${renderStakeholdersPDF(state.stakeholders)}
    </section>

    <!-- Products -->
    <section class="avoid-break" style="margin-bottom: 2rem;">
      <h2 style="font-size: 18pt; font-weight: 700; color: #111827; margin-bottom: 1rem;">Products in Use</h2>
      ${renderProductsPDF(state.products)}
    </section>

    <!-- Past Objectives -->
    ${state.pastObjectives.length > 0 ? `
      <section class="page-break-before" style="margin-bottom: 2rem;">
        <h2 style="font-size: 18pt; font-weight: 700; color: #111827; margin-bottom: 1rem;">Past Objectives Achieved</h2>
        ${renderObjectivesPDF(state.pastObjectives, true)}
      </section>
    ` : ''}
  `;

  // Append to body temporarily (required for html2pdf)
  document.body.appendChild(container);
  
  return container;
}

/**
 * Get print-specific styles
 * @returns {string} CSS styles for print
 */
function getPrintStyles() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    .number-badge {
      width: 32px !important;
      height: 32px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: #14b8a6 !important;
      color: white !important;
      border-radius: 50% !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      line-height: 1 !important;
      flex-shrink: 0 !important;
    }
    
    .avoid-break {
      page-break-inside: avoid !important;
    }
    
    .page-break-before {
      page-break-before: always !important;
    }
    
    .page-break-after {
      page-break-after: always !important;
    }
  `;
}

// Render functions for different sections
function renderMissionGoalsPDF(goals) {
  if (!goals || goals.length === 0) {
    return '<p style="color: #6b7280;">No mission goals defined.</p>';
  }

  return goals.map((goal, index) => `
    <div class="avoid-break" style="background: white; border: 1px solid #e5e7eb; padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem;">
      <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
        <span class="number-badge">${index + 1}</span>
        <div style="flex: 1;">
          <h3 style="font-size: 14pt; font-weight: 600; margin: 0 0 0.5rem 0;">${goal.title}</h3>
          <p style="color: #4b5563; margin: 0 0 0.75rem 0;">${goal.description}</p>
          ${goal.customFields && goal.customFields.length > 0 ? `
            <div style="background: #f9fafb; padding: 0.75rem; border-radius: 0.25rem;">
              ${goal.customFields.map(field => `
                <div style="font-size: 10pt; margin-bottom: 0.25rem;">
                  <strong>${field.label}:</strong> ${field.value}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function renderObjectivesPDF(objectives, isPast = false) {
  if (!objectives || objectives.length === 0) {
    return '<p style="color: #6b7280;">No objectives defined.</p>';
  }

  return objectives.map(obj => `
    <div class="avoid-break" style="background: white; border: 1px solid #e5e7eb; padding: 1.5rem; margin-bottom: 1rem; border-radius: 0.5rem;">
      <div style="margin-bottom: 1rem;">
        <h3 style="font-size: 14pt; font-weight: 600; margin: 0 0 0.5rem 0;">${obj.name}</h3>
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
          ${renderStatusBadgePDF(obj.status)}
          <span style="font-size: 10pt; color: #6b7280;">Target: ${formatDate(obj.targetDate)}</span>
        </div>
        <p style="color: #4b5563; margin: 0 0 1rem 0;">${obj.description}</p>
      </div>
      
      ${obj.kpis && obj.kpis.length > 0 ? `
        <div style="margin-bottom: 1rem;">
          <h4 style="font-size: 11pt; font-weight: 600; color: #374151; margin: 0 0 0.75rem 0;">Key Performance Indicators</h4>
          ${renderKPIsPDF(obj.kpis)}
        </div>
      ` : ''}
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 10pt;">
        <div>
          <strong style="color: #4b5563;">Challenges:</strong>
          <p style="margin: 0.25rem 0 0 0; color: #6b7280;">${obj.challenges || 'None identified'}</p>
        </div>
        <div>
          <strong style="color: #4b5563;">Next Steps:</strong>
          <p style="margin: 0.25rem 0 0 0; color: #6b7280;">${obj.nextSteps || 'To be determined'}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function renderKPIsPDF(kpis) {
  return kpis.map(kpi => {
    const delta = calculateDelta(kpi.currentValue, kpi.previousValue);
    const isPositive = delta >= 0;
    
    return `
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 0.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-size: 10pt; font-weight: 500; color: #374151;">${getKPILabel(kpi.typeKey)}</div>
            <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-top: 0.25rem;">
              <span style="font-size: 20pt; font-weight: 700; color: #111827;">${kpi.currentValue}</span>
              <span style="font-size: 12pt; color: #6b7280;">${getKPIUnit(kpi.typeKey)}</span>
              ${kpi.comparePrevious && kpi.previousValue !== undefined ? `
                <span style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.5rem; font-size: 9pt; font-weight: 600; background: ${isPositive ? '#d1fae5' : '#fee2e2'}; color: ${isPositive ? '#065f46' : '#991b1b'}; border-radius: 0.25rem;">
                  ${isPositive ? '↑' : '↓'} ${Math.abs(delta)}%
                </span>
              ` : ''}
            </div>
          </div>
          <div style="font-size: 9pt; color: #6b7280;">${kpi.period || 'Quarter'}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderValueRealizedPDF(items) {
  if (!items || items.length === 0) {
    return '<p style="color: #6b7280;">No value realized items yet.</p>';
  }

  return items.map(item => `
    <div class="avoid-break" style="background: white; border: 1px solid #e5e7eb; padding: 1rem; margin-bottom: 0.75rem; border-radius: 0.5rem;">
      <h4 style="font-size: 12pt; font-weight: 600; color: #059669; margin: 0 0 0.5rem 0;">${item.type}</h4>
      <p style="color: #374151; margin: 0 0 0.5rem 0; font-size: 10pt;">${item.description}</p>
      <div style="font-size: 9pt; color: #6b7280;">
        Realized: ${formatDate(item.date)}
        ${item.link ? ` • <span style="color: #14b8a6;">${item.link}</span>` : ''}
      </div>
    </div>
  `).join('');
}

function renderHealthStatusPDF(health) {
  const colors = {
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444'
  };
  
  const labels = {
    green: 'Healthy',
    yellow: 'At Risk',
    red: 'Critical'
  };

  return `
    <div style="display: flex; gap: 1rem;">
      ${Object.keys(colors).map(key => `
        <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border: 2px solid ${health === key ? colors[key] : '#e5e7eb'}; background: ${health === key ? colors[key] : 'white'}; color: ${health === key ? 'white' : '#6b7280'}; border-radius: 0.5rem; font-weight: 600;">
          ${labels[key]}
        </div>
      `).join('')}
    </div>
  `;
}

function renderStakeholdersPDF(stakeholders) {
  if (!stakeholders || stakeholders.length === 0) {
    return '<p style="color: #6b7280;">No stakeholders defined.</p>';
  }

  return `
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
      ${stakeholders.map(s => `
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 0.75rem; border-radius: 0.5rem;">
          <div style="font-weight: 600; font-size: 11pt;">${s.name}</div>
          <div style="font-size: 10pt; color: #4b5563;">${s.title}</div>
          <div style="font-size: 9pt; color: #6b7280;">${s.email}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderProductsPDF(products) {
  if (!products || products.length === 0) {
    return '<p style="color: #6b7280;">No products selected.</p>';
  }

  return `
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
      ${products.map(product => `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="width: 8px; height: 8px; background: #14b8a6; border-radius: 50%; flex-shrink: 0;"></span>
          <span style="font-size: 11pt;">${product}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderStatusBadgePDF(status) {
  const colors = {
    'In Progress': '#06b6d4',
    'Not Started': '#6b7280',
    'Completed': '#10b981',
    'At Risk': '#f59e0b'
  };
  
  return `<span style="display: inline-block; padding: 0.25rem 0.75rem; background: ${colors[status] || '#6b7280'}; color: white; font-size: 9pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em; border-radius: 0.25rem;">${status}</span>`;
}

// Helper functions
function calculateDelta(current, previous) {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / Math.abs(previous) * 100).toFixed(1);
}

function getKPILabel(typeKey) {
  const labels = {
    content_utilization: 'Content Utilization',
    answer_with_ai: 'Answers with AI',
    time_per_response: 'Time per Response',
    sales_cycle_reduction: 'Sales Cycle Reduction',
    content_accuracy: 'Content Accuracy',
    user_satisfaction: 'User Satisfaction',
    adoption_rate: 'Adoption Rate',
    response_quality: 'Response Quality',
    revenue_impact: 'Revenue Impact'
  };
  return labels[typeKey] || 'Unknown KPI';
}

function getKPIUnit(typeKey) {
  const units = {
    content_utilization: '%',
    answer_with_ai: '%',
    time_per_response: 's',
    sales_cycle_reduction: 'days',
    content_accuracy: '%',
    user_satisfaction: '/5',
    adoption_rate: '%',
    response_quality: '/10',
    revenue_impact: '$k'
  };
  return units[typeKey] || '';
}