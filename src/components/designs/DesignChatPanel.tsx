import React, { useState } from 'react';
import { MessageSquare, Send, X, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  sender: string;
  role: 'designer' | 'factory';
  message: string;
  timestamp: Date;
}

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'DSN-001': [
    { id: '1', sender: 'Priya Sharma', role: 'designer', message: 'Summer Breeze collection samples are ready for review. Please check the fabric quality.', timestamp: new Date('2024-02-10T10:30:00') },
    { id: '2', sender: 'Factory Team', role: 'factory', message: 'Received. We\'ll inspect and revert by EOD. Any specific concerns on stitching?', timestamp: new Date('2024-02-10T11:15:00') },
    { id: '3', sender: 'Priya Sharma', role: 'designer', message: 'Yes — double-check the elastic waistband tension. Last batch was too loose.', timestamp: new Date('2024-02-10T11:45:00') },
    { id: '4', sender: 'Factory Team', role: 'factory', message: 'Noted. We\'ve adjusted the tension specs. Samples approved ✅', timestamp: new Date('2024-02-10T16:00:00') },
  ],
  'DSN-002': [
    { id: '1', sender: 'Priya Sharma', role: 'designer', message: 'Arctic Shield thermal design submitted. Waiting for fabric sourcing confirmation.', timestamp: new Date('2024-02-12T09:00:00') },
    { id: '2', sender: 'Factory Team', role: 'factory', message: 'Merino wool blend is on backorder. ETA 5 days. Want to proceed with alternative?', timestamp: new Date('2024-02-12T14:00:00') },
  ],
  'DSN-004': [
    { id: '1', sender: 'Priya Sharma', role: 'designer', message: 'Eco Comfort range — using recycled cotton blend. Draft patterns attached.', timestamp: new Date('2024-02-15T08:30:00') },
  ],
};

interface DesignChatPanelProps {
  designId: string;
  designName: string;
  onClose: () => void;
}

const DesignChatPanel: React.FC<DesignChatPanelProps> = ({ designId, designName, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES[designId] || []);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: user?.name || 'You',
      role: user?.role === 'designer' ? 'designer' : 'factory',
      message: newMessage.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="flex flex-col h-full border-l border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Design Chat</h3>
            <p className="text-[10px] text-muted-foreground font-mono">{designId} · {designName}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-10">
              <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-xs text-muted-foreground">No messages yet. Start the conversation.</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isOwn = msg.role === (user?.role === 'designer' ? 'designer' : 'factory');
            const showDate = i === 0 || formatDate(msg.timestamp) !== formatDate(messages[i - 1].timestamp);
            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div className="flex justify-center">
                    <span className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                      {formatDate(msg.timestamp)}
                    </span>
                  </div>
                )}
                <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className={`text-[10px] font-bold ${msg.role === 'factory' ? 'bg-primary/20 text-primary' : 'bg-accent text-accent-foreground'}`}>
                      {msg.sender.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
                    <p className={`text-[10px] mb-0.5 ${isOwn ? 'text-right' : ''} text-muted-foreground`}>
                      {msg.sender}
                    </p>
                    <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      isOwn
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-secondary text-secondary-foreground rounded-tl-sm'
                    }`}>
                      {msg.message}
                    </div>
                    <p className={`text-[9px] mt-0.5 ${isOwn ? 'text-right' : ''} text-muted-foreground/60`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground">
            <Paperclip className="w-3.5 h-3.5" />
          </Button>
          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="h-8 text-xs bg-secondary/50 border-border/50"
          />
          <Button size="icon" className="h-8 w-8 shrink-0" onClick={handleSend} disabled={!newMessage.trim()}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesignChatPanel;
