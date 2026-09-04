export interface UserProfile {
  userId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: string;
}

export interface ChatbotModel {
  id: string;
  name: string;
  tagline: string;
  category: 'support' | 'sales' | 'ecommerce' | 'technical' | 'enterprise';
  description: string;
  baseModel: string;
  pricingMonthly: number;
  setupFee: number;
  latencyMs: number;
  supportedChannels: string[];
  features: string[];
  systemInstruction: string;
  samplePrompts: string[];
  popularityScore: number;
}

export interface DigitalService {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  deliverables: string[];
  startingPrice: number;
  turnaroundDays: string;
  techStack: string[];
  icon: string;
}

export interface ServiceInquiry {
  id: string;
  userId: string;
  serviceType: 'chatbot_model' | 'custom_website' | 'full_solution' | 'ai_consultation';
  projectTitle: string;
  description: string;
  budgetRange?: string;
  timeline?: string;
  status: 'submitted' | 'reviewing' | 'in_progress' | 'completed' | 'cancelled';
  aiProposal?: string;
  createdAt: string;
}

export interface SavedModel {
  id: string;
  userId: string;
  modelId: string;
  modelName: string;
  category?: string;
  priceMonthly?: number;
  savedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface ChatPersona {
  id: string;
  name: string;
  roleTitle: string;
  avatarBg: string;
  systemInstruction: string;
  initialMessage: string;
  quickPrompts: string[];
}
