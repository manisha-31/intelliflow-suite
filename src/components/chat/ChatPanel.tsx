import React, { useState, useRef, useEffect } from 'react';
import { useMessages, useSendMessage } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';

interface ChatPanelProps {
  collectionId: string;
  collectionName: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ collectionId, collectionName }) => {
  const { profile } = useAuth();
  const { data: messages = [], isLoading } = useMessages(collectionId);
  const sendMut = useSendMessage();
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !profile) return;
    await sendMut.mutateAsync({ content: text.trim(), collectionId, senderId: profile.id });
    setText('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-sm font-heading text-foreground">{collectionName} Chat</p>
        <p className="text-xs text-muted-foreground font-body">Real-time team messaging</p>
      </div>
      <ScrollArea className="flex-1 px-4 py-3">
        {isLoading && <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}
        {messages.length === 0 && !isLoading && <p className="text-xs text-muted-foreground text-center py-8">No messages yet. Start the conversation!</p>}
        <div className="space-y-3">
          {messages.map((m: any) => {
            const isMe = m.sender_id === profile?.id;
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-lg px-3 py-2 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  {!isMe && <p className="text-[10px] font-semibold mb-0.5">{m.profiles?.full_name || 'Unknown'}</p>}
                  <p className="text-xs font-body">{m.content}</p>
                  <p className={`text-[9px] mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{new Date(m.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      <div className="px-4 py-3 border-t border-border flex gap-2">
        <Input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..." className="text-sm" onKeyDown={e => e.key === 'Enter' && handleSend()} />
        <Button size="icon" onClick={handleSend} disabled={sendMut.isPending || !text.trim()}><Send className="w-4 h-4" /></Button>
      </div>
    </div>
  );
};

export default ChatPanel;
