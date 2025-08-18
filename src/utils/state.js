// State management module

import { getCurrentTimestamp } from './dates.js';

// KPI type definitions
export const KPI_TYPES = {
  content_utilization: { 
    key: 'content_utilization', 
    label: 'Content Utilization', 
    unit: '%', 
    higherIsBetter: true 
  },
  answer_with_ai: { 
    key: 'answer_with_ai', 
    label: 'Answers with AI', 
    unit: '%', 
    higherIsBetter: true 
  },
  time_per_response: { 
    key: 'time_per_response', 
    label: 'Time per Response', 
    unit: 's', 
    higherIsBetter: false 
  },
  sales_cycle_reduction: { 
    key: 'sales_cycle_reduction', 
    label: 'Sales Cycle Reduction', 
    unit: 'days', 
    higherIsBetter: false 
  },
  content_accuracy: { 
    key: 'content_accuracy', 
    label: 'Content Accuracy', 
    unit: '%', 
    higherIsBetter: true 
  },
  user_satisfaction: { 
    key: 'user_satisfaction', 
    label: 'User Satisfaction', 
    unit: '/5', 
    higherIsBetter: true 
  },
  adoption_rate: { 
    key: 'adoption_rate', 
    label: 'Adoption Rate', 
    unit: '%', 
    higherIsBetter: true 
  },
  response_quality: { 
    key: 'response_quality', 
    label: 'Response Quality', 
    unit: '/10', 
    higherIsBetter: true 
  },
  revenue_impact: { 
    key: 'revenue_impact', 
    label: 'Revenue Impact', 
    unit: '$k', 
    higherIsBetter: true 
  }
};

// Product to KPIs mapping
export const PRODUCT_KPIS = {
  'Responsive AI': [
    KPI_TYPES.answer_with_ai,
    KPI_TYPES.time_per_response,
    KPI_TYPES.response_quality,
    KPI_TYPES.user_satisfaction
  ],
  'Content Management': [
    KPI_TYPES.content_utilization,
    KPI_TYPES.content_accuracy,
    KPI_TYPES.adoption_rate
  ],
  'Sales Enablement': [
    KPI_TYPES.sales_cycle_reduction,
    KPI_TYPES.revenue_impact,
    KPI_TYPES.answer_with_ai
  ],
  'Analytics Suite': [
    KPI_TYPES.content_utilization,
    KPI_TYPES.user_satisfaction,
    KPI_TYPES.adoption_rate
  ]
};

// Available products
export const AVAILABLE_PRODUCTS = [
  'Responsive AI',
  'Content Management',
  'Sales Enablement',
  'Analytics Suite'
];

// Initial state
const initialState = {
  customerName: 'TechCorp Solutions',
  lastUpdated: getCurrentTimestamp(),
  missionSummary: `Transform the sales enablement process by implementing Responsive's AI-powered platform to reduce content discovery time by 75%, increase sales productivity by 40%, and improve win rates through intelligent content recommendations and real-time analytics.`,
  missionGoals: [
    { 
      id: 1, 
      title: 'Content Excellence Initiative', 
      description: 'Achieve 95% content accuracy and reduce obsolete content to less than 5% through AI-powered content management and automated review workflows.',
      customFields: [
        {id: 1, label: 'Success Dashboard', value: 'https://analytics.responsive.io/techcorp/content'},
        {id: 2, label: 'Key Metric', value: '89% current accuracy → 95% target'},
        {id: 3, label: 'Timeline', value: 'Q2 2025 completion'}
      ]
    },
    { 
      id: 2, 
      title: 'AI Adoption & Training', 
      description: 'Achieve 80% active user adoption of AI features within sales teams through comprehensive training programs, champion networks, and continuous improvement based on usage analytics.',
      customFields: [
        {id: 4, label: 'Training Portal', value: 'https://learn.responsive.io/techcorp'},
        {id: 5, label: 'Current Adoption', value: '52% active users'},
        {id: 6, label: 'Next Milestone', value: 'Champion training - Feb 15'}
      ]
    },
    { 
      id: 3, 
      title: 'Revenue Impact Measurement', 
      description: 'Demonstrate 15% improvement in win rates and $5M+ revenue attribution to Responsive platform usage through comprehensive tracking and quarterly business reviews.',
      customFields: [
        {id: 7, label: 'ROI Calculator', value: 'https://responsive.io/roi/techcorp'},
        {id: 8, label: 'Current Impact', value: '$2.1M attributed revenue'},
        {id: 9, label: 'Win Rate Delta', value: '+12% vs control group'}
      ]
    }
  ],
  objectives: [
    {
      id: 1,
      name: 'Q1 Platform Expansion',
      description: 'Complete rollout to EMEA and APAC sales teams (500+ users) with localized content and regional champion network.',
      targetDate: '2025-03-31',
      status: 'In Progress',
      challenges: 'GDPR compliance for EMEA requires additional security review. APAC content translation timeline is tight.',
      nextSteps: 'Complete security assessment by Feb 10. Begin pilot with UK team Feb 15. Finalize APAC content translation by Feb 28.',
      kpis: [
        { 
          id: 101, 
          typeKey: 'adoption_rate', 
          currentValue: 52, 
          previousValue: 15,
          period: 'Quarter',
          comparePrevious: true
        },
        { 
          id: 102, 
          typeKey: 'user_satisfaction', 
          currentValue: 4.2, 
          previousValue: 3.8,
          period: 'Month',
          comparePrevious: true
        }
      ]
    },
    {
      id: 2,
      name: 'AI Response Quality Optimization',
      description: 'Improve AI response accuracy to 95%+ through model fine-tuning, feedback loops, and content curation.',
      targetDate: '2025-04-30',
      status: 'In Progress',
      challenges: 'Need more domain-specific training data. Some legacy content causing confusion in responses.',
      nextSteps: 'Implement feedback widget by Feb 5. Schedule monthly model retraining. Audit and tag legacy content.',
      kpis: [
        { 
          id: 201, 
          typeKey: 'answer_with_ai', 
          currentValue: 34, 
          previousValue: 8,
          period: 'Quarter',
          comparePrevious: true
        },
        { 
          id: 202, 
          typeKey: 'time_per_response', 
          currentValue: 12, 
          previousValue: 45,
          period: 'Month',
          comparePrevious: true
        }
      ]
    }
  ],
  pastObjectives: [
    {
      id: 100,
      name: 'Platform Onboarding & Initial Setup',
      targetDate: '2024-12-31',
      status: 'Completed',
      description: 'Successfully onboarded TechCorp to Responsive platform with SSO integration, initial content migration, and pilot team training.',
      challenges: 'Initial API rate limits required optimization. SSO integration needed custom SAML configuration.',
      nextSteps: 'Monitor system performance. Gather user feedback for Phase 2 rollout.',
      kpis: [
        { 
          id: 1001, 
          typeKey: 'content_utilization', 
          currentValue: 78, 
          previousValue: 0,
          period: 'Quarter',
          comparePrevious: true
        }
      ]
    }
  ],
  valueRealized: [
    { 
      id: 1, 
      type: 'Time Savings', 
      description: 'Sales team saves average 6 hours/week per rep through instant content discovery and AI-powered responses. Validated through time tracking study of 50 pilot users.',
      date: '2025-01-15', 
      link: 'https://responsive.io/impact/techcorp/time-savings' 
    },
    {
      id: 2,
      type: 'Win Rate Increase',
      description: 'Teams using AI-recommended content show 12% higher win rates compared to control group, resulting in $2.1M additional revenue in Q1.',
      date: '2025-01-22',
      link: 'https://responsive.io/impact/techcorp/win-rate'
    },
    {
      id: 3,
      type: 'Cost Reduction',
      description: 'Reduced content creation costs by 35% through reuse of high-performing materials and AI-assisted content generation.',
      date: '2025-01-10',
      link: 'https://responsive.io/impact/techcorp/cost-savings'
    }
  ],
  planHealth: 'green',
  stakeholders: [
    { id: 1, name: 'Sarah Chen', title: 'VP of Sales', email: 'sarah.chen@techcorp.com' },
    { id: 2, name: 'Michael Rodriguez', title: 'Sales Enablement Director', email: 'michael.rodriguez@techcorp.com' },
    { id: 3, name: 'Jennifer Park', title: 'CRO', email: 'jennifer.park@techcorp.com' }
  ],
  products: ['Responsive AI', 'Content Management', 'Analytics Suite']
};

// State management class
class StateManager {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const saved = localStorage.getItem('successPlanState');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with initial state to ensure all properties exist
        return { ...initialState, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
    return { ...initialState };
  }

  saveState() {
    try {
      this.state.lastUpdated = getCurrentTimestamp();
      localStorage.setItem('successPlanState', JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  getState() {
    return this.state;
  }

  updateState(updates) {
    this.state = { ...this.state, ...updates };
    this.saveState();
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Helper methods
  getAvailableKPITypes() {
    const types = [];
    this.state.products.forEach(product => {
      if (PRODUCT_KPIS[product]) {
        types.push(...PRODUCT_KPIS[product]);
      }
    });
    // Remove duplicates
    return Array.from(new Map(types.map(t => [t.key, t])).values());
  }

  getKPIType(typeKey) {
    return KPI_TYPES[typeKey] || { label: 'Unknown KPI', unit: '', higherIsBetter: true };
  }

  addObjective(objective) {
    const newObjective = {
      id: Date.now(),
      kpis: [],
      ...objective
    };
    this.updateState({
      objectives: [...this.state.objectives, newObjective]
    });
    return newObjective;
  }

  updateObjective(id, updates) {
    this.updateState({
      objectives: this.state.objectives.map(obj =>
        obj.id === id ? { ...obj, ...updates } : obj
      )
    });
  }

  removeObjective(id) {
    this.updateState({
      objectives: this.state.objectives.filter(obj => obj.id !== id)
    });
  }

  addKPI(objectiveId, kpi) {
    const newKPI = {
      id: Date.now(),
      comparePrevious: true,
      period: 'Quarter',
      ...kpi
    };
    
    this.updateState({
      objectives: this.state.objectives.map(obj =>
        obj.id === objectiveId
          ? { ...obj, kpis: [...(obj.kpis || []), newKPI] }
          : obj
      )
    });
    return newKPI;
  }

  updateKPI(objectiveId, kpiId, updates) {
    this.updateState({
      objectives: this.state.objectives.map(obj =>
        obj.id === objectiveId
          ? {
              ...obj,
              kpis: obj.kpis.map(kpi =>
                kpi.id === kpiId ? { ...kpi, ...updates } : kpi
              )
            }
          : obj
      )
    });
  }

  removeKPI(objectiveId, kpiId) {
    this.updateState({
      objectives: this.state.objectives.map(obj =>
        obj.id === objectiveId
          ? { ...obj, kpis: obj.kpis.filter(kpi => kpi.id !== kpiId) }
          : obj
      )
    });
  }

  addStakeholder(stakeholder) {
    const newStakeholder = {
      id: Date.now(),
      ...stakeholder
    };
    this.updateState({
      stakeholders: [...this.state.stakeholders, newStakeholder]
    });
    return newStakeholder;
  }

  removeStakeholder(id) {
    this.updateState({
      stakeholders: this.state.stakeholders.filter(s => s.id !== id)
    });
  }

  reset() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      this.state = { ...initialState };
      this.saveState();
      this.notifyListeners();
    }
  }
}

// Export singleton instance
export const stateManager = new StateManager();