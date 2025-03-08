
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Mic, MicOff } from 'lucide-react';
import { startVoiceRecognition } from '../../utils/speechRecognition';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input);
    setInput('');
  };
  
  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      
      const stopRecognition = startVoiceRecognition(
        // On transcript
        (transcript: string) => {
          setInput(transcript);
          setIsRecording(false);
        },
        // On error
        () => {
          toast({
            title: "Voice Recognition Error",
            description: "Could not recognize your voice. Please try again or type your message.",
          });
          setIsRecording(false);
        }
      );
      
      // If no speech recognition API available
      if (!stopRecognition) {
        toast({
          variant: "destructive",
          title: "Not Supported",
          description: "Voice recognition is not supported in your browser.",
        });
        setIsRecording(false);
      }
    } else {
      setIsRecording(false);
      // Speech recognition is stopped in the returned function
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-end space-x-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-h-[60px] max-h-[120px] resize-none"
          disabled={isLoading || isRecording}
        />
        <div className="flex flex-col gap-2">
          <Button 
            type="button" 
            size="icon" 
            variant="outline"
            disabled={isLoading}
            onClick={toggleVoiceRecording}
            className={isRecording ? "bg-red-100 dark:bg-red-900" : ""}
          >
            {isRecording ? (
              <MicOff className="h-5 w-5 text-red-500" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
