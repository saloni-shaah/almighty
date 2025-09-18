"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { getClaudeResponse } from "@/app/actions";
import {
  ChatMessage,
  ChatMessageLoading,
  type Message,
} from "@/components/chat/chat-message";

const formSchema = z.object({
  message: z.string().min(1, { message: "Message cannot be empty." }),
});

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleClear = () => {
    setMessages([]);
    setContext("");
    toast({
      title: "Conversation cleared",
      description: "You can start a new conversation now.",
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const userMessage: Message = { role: "user", content: values.message };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    const response = await getClaudeResponse({
      message: values.message,
      context: context,
    });

    setIsLoading(false);

    if (response.success) {
      const assistantMessage: Message = {
        role: "assistant",
        content: response.success.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setContext(response.success.updatedContext);
    } else {
      setMessages((prev) => prev.slice(0, prev.length - 1));
      toast({
        variant: "destructive",
        title: "Error",
        description:
          response.failure || "There was a problem communicating with the AI.",
      });
    }
  }

  return (
    <Card className="w-full max-w-3xl h-full flex flex-col shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-xl md:text-2xl">
            Almighty Chat
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Clear conversation"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-6 p-4 md:p-6">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground pt-16 flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-foreground">
                    Start a conversation
                  </p>
                  <p className="text-sm">
                    Ask me anything, or tell me about your day!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => <ChatMessage key={index} {...msg} />)
            )}
            {isLoading && <ChatMessageLoading />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t bg-background/95">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full items-center space-x-2"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Type a message..."
                      autoComplete="off"
                      disabled={isLoading}
                      className="text-base"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              size="icon"
              aria-label="Send message"
              className="bg-accent hover:bg-accent/90 shrink-0 transition-all active:scale-95"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
