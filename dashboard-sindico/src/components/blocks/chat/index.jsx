'use client'
import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { Send, User, Bot, Circle } from "lucide-react"; // Adicionei Bot e Circle para o status

export default function Chat({
  initialMessages = [],
  currentUserId = "me",
  onSend,
  placeholder = "Escreva uma mensagem...",
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newMessage = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: "Você",
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setText("");

    try {
      setSending(true);
      if (onSend) await onSend(newMessage);
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <Card className="flex flex-col h-[700px] w-full border shadow-2xl rounded-xl overflow-hidden bg-white dark:bg-gray-900">
      
      <CardHeader className="border-b bg-background p-4 flex flex-row items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-11 w-11 border-2 border-primary/50">
            <AvatarImage src="/placeholder-admin.jpg" alt="Admin" />
            <AvatarFallback className="bg-primary text-white font-bold">AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-xl font-bold text-foreground">Equipe Administrativa</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
                <Circle className="h-2 w-2 mr-2 fill-green-500 text-green-500 animate-pulse" />
                Online
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent ref={listRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-800">
        {messages.length === 0 && (
          <p className="text-center text-base text-muted-foreground pt-10">
             Bem-vindo! Sua comunicação com a equipe é importante.
          </p>
        )}

        {messages.map((m) => {
          const mine = m.userId === currentUserId;
          const bubbleClasses = mine
            ? "bg-primary text-primary-foreground rounded-l-xl rounded-tr-xl shadow-md"
            : "bg-white dark:bg-gray-700 text-foreground rounded-r-xl rounded-tl-xl shadow-sm border border-border/50";
          
          const icon = mine ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-gray-500" />;

          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] p-4 text-base flex flex-col transition-all duration-150 ${bubbleClasses}`}
              >
                {!mine && <p className="text-xs font-semibold mb-1 text-primary dark:text-primary-light">Administrador</p>}
                
                <p className="whitespace-pre-wrap leading-relaxed break-words">{m.text}</p>
                
                <span className={`text-[11px] mt-2 self-end ${mine ? "text-primary-foreground/80" : "text-muted-foreground/80"}`}>
                    {formatTime(m.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>

      <div className="border-t p-4 bg-white dark:bg-gray-900">
        <div className="flex gap-3 items-end">
          <Textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="resize-none min-h-[44px] max-h-[120px] p-3 border-2 rounded-xl focus-visible:ring-primary text-base"
          />

          <Button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className="h-11 w-11 p-0 flex items-center justify-center rounded-xl shadow-lg transition-all duration-200"
            title={sending ? "Enviando..." : "Enviar Mensagem"}
          >
            {sending 
              ? <Circle className="h-5 w-5 animate-spin" /> 
              : <Send className="h-5 w-5" />
            }
          </Button>
        </div>
      </div>
    </Card>
  );
}