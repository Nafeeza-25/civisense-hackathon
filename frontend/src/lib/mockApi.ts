// Mock API for development - simulates backend responses
import type { 
  ComplaintFormData, 
  ComplaintSubmissionResult, 
  Complaint, 
  DashboardStats,
  ComplaintStatus,
  AuthResponse,
  UrgencyLevel 
} from './types';

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock complaints database
let mockComplaints: Complaint[] = [
  {
    id: 'CIV-2024-001',
    description: 'தண்ணீர் வரவில்லை மூன்று நாட்களாக - No water supply for 3 days in our area',
    category: 'Water Supply',
    priority: 'high',
    scheme: 'Jal Jeevan Mission',
    area: 'Anna Nagar',
    status: 'New',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    contact: { name: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@email.com' },
    vulnerability: { seniorCitizen: false, lowIncome: true, disability: false }
  },
  {
    id: 'CIV-2024-002',
    description: 'Road potholes causing accidents near school zone',
    category: 'Road Maintenance',
    priority: 'high',
    scheme: 'Pradhan Mantri Gram Sadak Yojana',
    area: 'T. Nagar',
    status: 'Verified',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    contact: { name: 'Priya Sharma', phone: '9876543211', email: 'priya@email.com' },
    vulnerability: { seniorCitizen: false, lowIncome: false, disability: false }
  },
  {
    id: 'CIV-2024-003',
    description: 'மருத்துவமனையில் மருந்துகள் இல்லை - PHC lacks essential medicines',
    category: 'Healthcare',
    priority: 'medium',
    scheme: 'Ayushman Bharat',
    area: 'Mylapore',
    status: 'Scheme Linked',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    contact: { name: 'Lakshmi Devi', phone: '9876543212', email: 'lakshmi@email.com' },
    vulnerability: { seniorCitizen: true, lowIncome: true, disability: false }
  },
  {
    id: 'CIV-2024-004',
    description: 'Streetlights not working in residential area for a week',
    category: 'Electricity',
    priority: 'medium',
    scheme: 'IPDS',
    area: 'Adyar',
    status: 'Assigned',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    contact: { name: 'Mohammed Ali', phone: '9876543213', email: 'ali@email.com' },
    vulnerability: { seniorCitizen: false, lowIncome: false, disability: true }
  },
  {
    id: 'CIV-2024-005',
    description: 'குப்பை அகற்றப்படவில்லை - Garbage not collected for 5 days',
    category: 'Sanitation',
    priority: 'high',
    scheme: 'Swachh Bharat Mission',
    area: 'Velachery',
    status: 'New',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    contact: { name: 'Sunitha Rajan', phone: '9876543214', email: 'sunitha@email.com' },
    vulnerability: { seniorCitizen: false, lowIncome: true, disability: false }
  },
  {
    id: 'CIV-2024-006',
    description: 'Need assistance for housing under PMAY scheme',
    category: 'Housing',
    priority: 'low',
    scheme: 'Pradhan Mantri Awas Yojana',
    area: 'Chromepet',
    status: 'Resolved',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    contact: { name: 'Venkat Rao', phone: '9876543215', email: 'venkat@email.com' },
    vulnerability: { seniorCitizen: true, lowIncome: true, disability: false }
  },
];

// Category mapping based on service type
const categoryMap: Record<string, string> = {
  water: 'Water Supply',
  road: 'Road Maintenance',
  health: 'Healthcare',
  housing: 'Housing',
  welfare: 'Social Welfare',
  electricity: 'Electricity',
  sanitation: 'Sanitation',
  other: 'General'
};

// Scheme mapping based on category
const schemeMap: Record<string, { name: string; explanation: string }> = {
  'Water Supply': {
    name: 'Jal Jeevan Mission',
    explanation: 'This complaint qualifies for attention under the Jal Jeevan Mission which ensures tap water supply to rural and urban households.'
  },
  'Road Maintenance': {
    name: 'Pradhan Mantri Gram Sadak Yojana',
    explanation: 'Road infrastructure issues are addressed under PMGSY which provides connectivity to unconnected habitations.'
  },
  'Healthcare': {
    name: 'Ayushman Bharat',
    explanation: 'Healthcare access issues can be linked to Ayushman Bharat for improved health coverage and access to quality healthcare.'
  },
  'Housing': {
    name: 'Pradhan Mantri Awas Yojana',
    explanation: 'Housing assistance is provided under PMAY which aims to provide affordable housing to all.'
  },
  'Social Welfare': {
    name: 'National Social Assistance Programme',
    explanation: 'Welfare concerns are addressed through NSAP which provides financial assistance to the elderly, widows, and disabled.'
  },
  'Electricity': {
    name: 'Integrated Power Development Scheme',
    explanation: 'Electricity issues are managed under IPDS which strengthens power distribution infrastructure.'
  },
  'Sanitation': {
    name: 'Swachh Bharat Mission',
    explanation: 'Sanitation and cleanliness issues are addressed under Swachh Bharat Mission for a clean India.'
  },
  'General': {
    name: 'District Collector Office',
    explanation: 'Your complaint will be reviewed by the District Collector Office for appropriate action and scheme linkage.'
  }
};

// Generate unique reference ID
const generateReferenceId = () => {
  const year = new Date().getFullYear();
  const num = String(mockComplaints.length + 1).padStart(3, '0');
  return `CIV-${year}-${num}`;
};

// Calculate priority score based on urgency and vulnerability
const calculatePriorityScore = (
  urgency: UrgencyLevel, 
  vulnerability: { seniorCitizen: boolean; lowIncome: boolean; disability: boolean }
): number => {
  let score = urgency === 'high' ? 70 : urgency === 'medium' ? 50 : 30;
  
  if (vulnerability.seniorCitizen) score += 10;
  if (vulnerability.lowIncome) score += 10;
  if (vulnerability.disability) score += 10;
  
  return Math.min(score, 100);
};

// Mock API functions
export const mockApi = {
  // Submit a new complaint
  submitComplaint: async (data: ComplaintFormData): Promise<ComplaintSubmissionResult> => {
    await delay(1500); // Simulate network delay
    
    const category = categoryMap[data.serviceType];
    const scheme = schemeMap[category];
    const priorityScore = calculatePriorityScore(data.urgency, data.vulnerability);
    const referenceId = generateReferenceId();
    
    // Simulate AI confidence (75-98%)
    const confidence = 75 + Math.random() * 23;
    
    // Add to mock database
    const newComplaint: Complaint = {
      id: referenceId,
      description: data.description,
      category,
      priority: data.urgency,
      scheme: scheme.name,
      area: data.area,
      status: 'New',
      timestamp: new Date().toISOString(),
      contact: {
        name: data.name,
        phone: data.phone,
        email: data.email
      },
      vulnerability: data.vulnerability
    };
    
    mockComplaints = [newComplaint, ...mockComplaints];
    
    return {
      referenceId,
      category,
      confidence: Math.round(confidence * 10) / 10,
      priorityScore,
      suggestedScheme: scheme.name,
      schemeExplanation: scheme.explanation,
      urgencyExplanation: data.urgency === 'high' 
        ? 'Your complaint has been marked as HIGH priority due to the urgency level indicated.'
        : data.urgency === 'medium'
        ? 'Your complaint has been marked as MEDIUM priority and will be addressed within standard timelines.'
        : 'Your complaint has been marked as LOW priority but will still be addressed systematically.',
      nextSteps: [
        'Your complaint has been registered and assigned a reference number',
        'An officer will review and verify your complaint within 24 hours',
        'You will receive SMS updates on your registered phone number',
        'Expected resolution time: 3-7 working days based on priority'
      ]
    };
  },

  // Get all complaints for dashboard
  getComplaints: async (): Promise<{ complaints: Complaint[]; stats: DashboardStats }> => {
    await delay(500);
    
    const total = mockComplaints.length;
    const resolved = mockComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
    const pending = total - resolved;
    const highPriority = mockComplaints.filter(c => c.priority === 'high' && c.status !== 'Resolved' && c.status !== 'Closed').length;
    
    return {
      complaints: [...mockComplaints],
      stats: { total, pending, resolved, highPriority }
    };
  },

  // Update complaint status
  updateStatus: async (id: string, status: ComplaintStatus): Promise<boolean> => {
    await delay(300);
    
    const index = mockComplaints.findIndex(c => c.id === id);
    if (index !== -1) {
      mockComplaints[index] = { ...mockComplaints[index], status };
      return true;
    }
    return false;
  },

  // Officer login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await delay(800);
    
    // Mock credentials - in production, this would validate against a real auth service
    if (email === 'officer@civisense.gov.in' && password === 'demo123') {
      return {
        success: true,
        message: 'Login successful',
        token: 'mock-jwt-token-' + Date.now()
      };
    }
    
    return {
      success: false,
      message: 'Invalid email or password'
    };
  }
};
