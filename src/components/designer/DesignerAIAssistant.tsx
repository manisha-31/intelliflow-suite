import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Send, Loader2, Sparkles, Lightbulb, Palette } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Msg = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/designer-ai-assistant`;

const QUICK_PROMPTS = [
  { icon: Lightbulb, label: 'Design ideas for summer collection', prompt: 'Give me 5 creative design ideas for a summer innerwear collection targeting young women aged 18-30.' },
  { icon: Palette, label: 'Color palette suggestions', prompt: 'Suggest trending color palettes for intimate apparel for the upcoming season with hex codes and mood descriptions.' },
  { icon: Sparkles, label: 'Improve my design', prompt: 'How can I improve a basic cotton bra design to make it more premium and appealing? Consider materials, patterns, and finishing.' },
];

const DesignerAIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    const userMsg: Msg = { role: 'user', content: msg };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput('');
    setLoading(true);

    let assistantSoFar = '';
    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: allMsgs }),
      });
      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf('\n')) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) {
              assistantSoFar += c;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            }
          } catch { buf = line + '\n' + buf; break; }
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' }]);
    } finally { setLoading(false); }
  };

  return (
    <Card className="h-[420px] flex flex-col">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-heading flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" /> Design AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 px-4 py-2">
          {messages.length === 0 && (
            <div className="space-y-2 py-4">
              <p className="text-xs text-muted-foreground text-center mb-3">Get AI-powered design ideas and quality suggestions</p>
              {QUICK_PROMPTS.map((qp) => (
                <button key={qp.label} onClick={() => send(qp.prompt)} className="w-full text-left p-2.5 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <qp.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-body text-foreground">{qp.label}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs font-body ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  {m.role === 'assistant' ? <div className="prose prose-sm max-w-none"><ReactMarkdown>{m.content}</ReactMarkdown></div> : m.content}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start"><div className="bg-muted rounded-lg px-3 py-2"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div></div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
        <div className="px-4 py-3 border-t border-border flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about design ideas, trends, colors..." className="text-xs" onKeyDown={e => e.key === 'Enter' && send()} />
          <Button size="icon" className="shrink-0 h-9 w-9" onClick={() => send()} disabled={loading || !input.trim()}><Send className="w-3.5 h-3.5" /></Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignerAIAssistant;
