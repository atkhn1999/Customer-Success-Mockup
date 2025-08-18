// Excel export and import module

import * as XLSX from 'xlsx';
import { formatDate } from '../utils/dates.js';
import { stateManager, KPI_TYPES } from '../utils/state.js';

/**
 * Export success plan data to Excel
 * @param {Object} state - Current application state
 */
export function exportToExcel(state) {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Add Overview sheet
  const overviewData = createOverviewSheet(state);
  const wsOverview = XLSX.utils.json_to_sheet(overviewData, {
    header: ['Field', 'Value'],
    skipHeader: false
  });
  
  // Set column widths
  wsOverview['!cols'] = [
    { wch: 25 }, // Field column
    { wch: 80 }  // Value column
  ];
  
  XLSX.utils.book_append_sheet(wb, wsOverview, 'Overview');
  
  // Add Objectives sheet
  const objectivesData = createObjectivesSheet(state);
  const wsObjectives = XLSX.utils.json_to_sheet(objectivesData);
  
  wsObjectives['!cols'] = [
    { wch: 10 },  // ID
    { wch: 30 },  // Name
    { wch: 50 },  // Description
    { wch: 15 },  // Target Date
    { wch: 15 },  // Status
    { wch: 40 },  // Challenges
    { wch: 40 },  // Next Steps
    { wch: 30 }   // KPIs
  ];
  
  XLSX.utils.book_append_sheet(wb, wsObjectives, 'Objectives');
  
  // Add Stakeholders sheet
  const stakeholdersData = createStakeholdersSheet(state);
  const wsStakeholders = XLSX.utils.json_to_sheet(stakeholdersData);
  
  wsStakeholders['!cols'] = [
    { wch: 25 },  // Name
    { wch: 30 },  // Title
    { wch: 35 },  // Email
    { wch: 40 }   // Notes
  ];
  
  XLSX.utils.book_append_sheet(wb, wsStakeholders, 'Stakeholders');
  
  // Add Value Realized sheet
  const valueData = createValueRealizedSheet(state);
  const wsValue = XLSX.utils.json_to_sheet(valueData);
  
  wsValue['!cols'] = [
    { wch: 20 },  // Type
    { wch: 60 },  // Description
    { wch: 15 },  // Date
    { wch: 40 }   // Link
  ];
  
  XLSX.utils.book_append_sheet(wb, wsValue, 'Value Realized');
  
  // Generate filename
  const filename = `success-plan-${state.customerName.toLowerCase().replace(/\s+/g, '-')}-${formatDate(new Date()).toLowerCase().replace(/\s+/g, '-')}.xlsx`;
  
  // Write file
  XLSX.writeFile(wb, filename);
}

/**
 * Import data from Excel file
 * @param {File} file - Excel file to import
 * @returns {Promise<Object>} Imported data
 */
export async function importFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const importedData = {
          customerName: null,
          missionSummary: null,
          missionGoals: [],
          objectives: [],
          pastObjectives: [],
          valueRealized: [],
          stakeholders: [],
          products: [],
          planHealth: 'green'
        };
        
        // Process Overview sheet
        if (workbook.Sheets['Overview']) {
          const overviewData = XLSX.utils.sheet_to_json(workbook.Sheets['Overview'], { header: 1 });
          processOverviewData(overviewData, importedData);
        }
        
        // Process Objectives sheet
        if (workbook.Sheets['Objectives']) {
          const objectivesData = XLSX.utils.sheet_to_json(workbook.Sheets['Objectives']);
          processObjectivesData(objectivesData, importedData);
        }
        
        // Process Stakeholders sheet
        if (workbook.Sheets['Stakeholders']) {
          const stakeholdersData = XLSX.utils.sheet_to_json(workbook.Sheets['Stakeholders']);
          processStakeholdersData(stakeholdersData, importedData);
        }
        
        // Process Value Realized sheet
        if (workbook.Sheets['Value Realized']) {
          const valueData = XLSX.utils.sheet_to_json(workbook.Sheets['Value Realized']);
          processValueRealizedData(valueData, importedData);
        }
        
        resolve(importedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Sheet creation functions
function createOverviewSheet(state) {
  return [
    { Field: 'Customer Name', Value: state.customerName },
    { Field: 'Last Updated', Value: state.lastUpdated },
    { Field: 'Overall Health', Value: state.planHealth },
    { Field: 'Mission Summary', Value: state.missionSummary },
    { Field: 'Products in Use', Value: state.products.join(', ') },
    { Field: 'Active Objectives', Value: state.objectives.length },
    { Field: 'Completed Objectives', Value: state.pastObjectives.length },
    { Field: 'Value Items Realized', Value: state.valueRealized.length },
    { Field: 'Key Stakeholders', Value: state.stakeholders.length },
    { Field: '', Value: '' }, // Empty row
    { Field: 'Mission Goals', Value: '' },
    ...state.missionGoals.map((goal, index) => ({
      Field: `Goal ${index + 1}`,
      Value: `${goal.title}: ${goal.description}`
    }))
  ];
}

function createObjectivesSheet(state) {
  const allObjectives = [
    ...state.objectives.map(obj => ({ ...obj, isPast: false })),
    ...state.pastObjectives.map(obj => ({ ...obj, isPast: true }))
  ];
  
  return allObjectives.map(obj => ({
    ID: obj.id,
    Name: obj.name,
    Description: obj.description,
    'Target Date': formatDate(obj.targetDate),
    Status: obj.status,
    Challenges: obj.challenges || '',
    'Next Steps': obj.nextSteps || '',
    KPIs: obj.kpis && obj.kpis.length > 0 
      ? obj.kpis.map(kpi => {
          const type = KPI_TYPES[kpi.typeKey] || { label: 'Unknown', unit: '' };
          return `${type.label}: ${kpi.currentValue}${type.unit}`;
        }).join('; ')
      : '',
    Type: obj.isPast ? 'Past' : 'Current'
  }));
}

function createStakeholdersSheet(state) {
  return state.stakeholders.map(s => ({
    Name: s.name,
    Title: s.title,
    Email: s.email,
    Notes: s.notes || ''
  }));
}

function createValueRealizedSheet(state) {
  return state.valueRealized.map(item => ({
    Type: item.type,
    Description: item.description,
    Date: formatDate(item.date),
    Link: item.link || ''
  }));
}

// Import processing functions
function processOverviewData(data, importedData) {
  for (const row of data) {
    if (row.length >= 2) {
      const field = row[0];
      const value = row[1];
      
      switch (field) {
        case 'Customer Name':
          importedData.customerName = value;
          break;
        case 'Overall Health':
          if (['green', 'yellow', 'red'].includes(value)) {
            importedData.planHealth = value;
          }
          break;
        case 'Mission Summary':
          importedData.missionSummary = value;
          break;
        case 'Products in Use':
          importedData.products = value.split(',').map(p => p.trim()).filter(Boolean);
          break;
        default:
          // Check for mission goals
          if (field && field.startsWith('Goal ') && value) {
            const parts = value.split(':');
            if (parts.length >= 2) {
              importedData.missionGoals.push({
                id: Date.now() + Math.random(),
                title: parts[0].trim(),
                description: parts.slice(1).join(':').trim(),
                customFields: []
              });
            }
          }
      }
    }
  }
}

function processObjectivesData(data, importedData) {
  for (const row of data) {
    const objective = {
      id: row.ID || Date.now() + Math.random(),
      name: row.Name || '',
      description: row.Description || '',
      targetDate: parseExcelDate(row['Target Date']),
      status: row.Status || 'Not Started',
      challenges: row.Challenges || '',
      nextSteps: row['Next Steps'] || '',
      kpis: []
    };
    
    // Parse KPIs if present
    if (row.KPIs) {
      const kpiStrings = row.KPIs.split(';');
      for (const kpiStr of kpiStrings) {
        const match = kpiStr.match(/(.+):\s*(\d+(?:\.\d+)?)/);
        if (match) {
          const label = match[1].trim();
          const value = parseFloat(match[2]);
          
          // Find matching KPI type
          const kpiType = Object.values(KPI_TYPES).find(t => t.label === label);
          if (kpiType) {
            objective.kpis.push({
              id: Date.now() + Math.random(),
              typeKey: kpiType.key,
              currentValue: value,
              period: 'Quarter',
              comparePrevious: false
            });
          }
        }
      }
    }
    
    // Add to appropriate array
    if (row.Type === 'Past') {
      importedData.pastObjectives.push(objective);
    } else {
      importedData.objectives.push(objective);
    }
  }
}

function processStakeholdersData(data, importedData) {
  for (const row of data) {
    if (row.Name) {
      importedData.stakeholders.push({
        id: Date.now() + Math.random(),
        name: row.Name,
        title: row.Title || '',
        email: row.Email || '',
        notes: row.Notes || ''
      });
    }
  }
}

function processValueRealizedData(data, importedData) {
  for (const row of data) {
    if (row.Type && row.Description) {
      importedData.valueRealized.push({
        id: Date.now() + Math.random(),
        type: row.Type,
        description: row.Description,
        date: parseExcelDate(row.Date),
        link: row.Link || ''
      });
    }
  }
}

// Helper functions
function parseExcelDate(dateStr) {
  if (!dateStr) return '';
  
  // Try parsing as date
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return formatDateForInput(date);
  }
  
  // Try parsing common formats
  const formats = [
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // MM/DD/YYYY
    /(\d{4})-(\d{1,2})-(\d{1,2})/,   // YYYY-MM-DD
    /(\w+)\s+(\d{1,2}),\s+(\d{4})/   // MMM D, YYYY
  ];
  
  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      // Convert to ISO format
      return formatDateForInput(new Date(dateStr));
    }
  }
  
  return '';
}

function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Handle import with customer name change detection
 * @param {Object} importedData - Data imported from Excel
 * @param {Object} currentState - Current application state
 * @returns {Object} Merged state
 */
export function mergeImportedData(importedData, currentState) {
  // Check if customer name changed
  const customerChanged = importedData.customerName && 
    importedData.customerName !== currentState.customerName;
  
  if (customerChanged) {
    // Clear all data and use imported data
    return {
      ...importedData,
      lastUpdated: new Date().toISOString()
    };
  }
  
  // Merge with existing data
  return {
    ...currentState,
    ...importedData,
    lastUpdated: new Date().toISOString()
  };
}