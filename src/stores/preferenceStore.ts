
import { create } from 'zustand';
import { PropertyType } from '../types/property';

export interface PropertyPreferences {
  budget: {
    min: number;
    max: number;
  };
  locations: string[];
  propertyType: PropertyType | 'All';
  bedrooms?: number;
  bathrooms?: number;
  amenities: string[];
  isPetFriendly?: boolean;
  hasParking?: boolean;
  hasPool?: boolean;
  hasGarden?: boolean;
}

interface PreferenceState {
  preferences: PropertyPreferences;
  chatStep: number;
  conversationHistory: {
    role: 'user' | 'assistant';
    content: string;
  }[];
  setPreference: <K extends keyof PropertyPreferences>(
    key: K,
    value: PropertyPreferences[K]
  ) => void;
  nextStep: () => void;
  resetStep: () => void;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  resetConversation: () => void;
}

const initialPreferences: PropertyPreferences = {
  budget: {
    min: 0,
    max: 1000000,
  },
  locations: [],
  propertyType: 'All',
  amenities: [],
};

export const usePreferenceStore = create<PreferenceState>((set) => ({
  preferences: initialPreferences,
  chatStep: 0,
  conversationHistory: [
    {
      role: 'assistant',
      content: "Hi! I'm your Property Assistant. What type of home are you looking for?",
    },
  ],
  setPreference: (key, value) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        [key]: value,
      },
    })),
  nextStep: () => set((state) => ({ chatStep: state.chatStep + 1 })),
  resetStep: () => set({ chatStep: 0 }),
  addMessage: (role, content) =>
    set((state) => ({
      conversationHistory: [...state.conversationHistory, { role, content }],
    })),
  resetConversation: () =>
    set({
      conversationHistory: [
        {
          role: 'assistant',
          content: "Hi! I'm your Property Assistant. What type of home are you looking for?",
        },
      ],
      chatStep: 0,
      preferences: initialPreferences,
    }),
}));
