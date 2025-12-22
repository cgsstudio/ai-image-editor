"use client";

import React, { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function CodeGeneratorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: input.trim() },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/code-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get response from AI");
      }

      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply as string },
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-xl overflow-hidden min-h-[75vh] flex flex-col">
        <header className="w-full py-6 px-8 flex items-center justify-between border-b border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500">
              Code Generator
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
              Chat with AI & generate content or code
            </h1>
          </div>
          <a
            href="/"
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to editor
          </a>
        </header>

        <div className="flex-1 flex flex-col px-6 pb-6 pt-4">
          <div className="flex-1 overflow-y-auto rounded-2xl bg-[#F5F5F7] p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-10">
                Start by asking for blog ideas, marketing copy, or a piece of
                code. The AI will respond here.
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 shadow-sm border border-gray-100"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="text-xs text-gray-400 animate-pulse">
                AI is thinking…
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {error && (
              <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                {error}
              </div>
            )}
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything, generate content, or request code…"
                className="flex-1 min-h-[52px] max-h-40 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="h-[52px] px-5 rounded-2xl bg-black text-white text-sm font-semibold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-900"
              >
                {isLoading ? "Sending…" : "Send"}
              </button>
            </div>
            <p className="text-[11px] text-gray-400">
              Tip: Ask for “Next.js API route with TypeScript”, “SEO‑optimized
              blog intro”, or “explain this piece of code”.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


