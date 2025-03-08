
// Types for Speech Recognition
export interface SpeechRecognitionEvent extends Event {
  results: {
    item(index: number): {
      item(index: number): {
        transcript: string;
      };
    };
  };
}

export interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
}

export interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

// Get speech recognition API with browser compatibility
export const getSpeechRecognition = (): SpeechRecognitionConstructor | null => {
  return (window.SpeechRecognition || window.webkitSpeechRecognition) as SpeechRecognitionConstructor || null;
};

// Start voice recognition
export const startVoiceRecognition = (
  onTranscript: (text: string) => void,
  onError: () => void
): (() => void) => {
  const SpeechRecognitionAPI = getSpeechRecognition();
  
  if (!SpeechRecognitionAPI) {
    onError();
    return () => {};
  }
  
  const recognition = new SpeechRecognitionAPI();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results.item(0).item(0).transcript;
    onTranscript(transcript);
  };
  
  recognition.onerror = onError;
  recognition.start();
  
  // Return stop function
  return () => recognition.stop();
};
