
import { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from 'lucide-react';
import { ChatMessage } from './types';
import { SongSuggestions } from './SongSuggestions';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  isLoading: boolean;
  onPlaySong: (song: any) => void;
}

export function ChatMessages({ messages, isTyping, isLoading, onPlaySong }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="flex flex-col gap-3 py-4">
        {messages.map(msg => (
          <div key={msg.id} className="flex flex-col gap-2">
            <div className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
              {msg.text}
            </div>
            
            {msg.songSuggestions && msg.songSuggestions.length > 0 && (
              <SongSuggestions 
                songs={msg.songSuggestions} 
                onPlay={onPlaySong} 
              />
            )}
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble chat-bubble-bot flex gap-1">
            <span className="animate-pulse">•</span>
            <span className="animate-pulse delay-100">•</span>
            <span className="animate-pulse delay-200">•</span>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center my-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}
