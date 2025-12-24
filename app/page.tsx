"use client";

import React, { useState, useEffect } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      // Check system preference
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem("theme", isDark ? "dark" : "light");
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

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

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyError(null);
    } catch (err: any) {
      console.error("Copy failed", err);
      setCopyError("Copy failed. Try again.");
    }
  };

  return (
    <main className={`min-h-screen flex items-center justify-center p-4 lg:p-8 transition-colors duration-200 ${
      isDark ? "bg-[#000000]" : "bg-gray-50"
    }`}>
      <div className={`w-full max-w-5xl rounded-[2.5rem] shadow-xl overflow-hidden min-h-[75vh] flex flex-col transition-colors duration-200 ${
        isDark ? "bg-[#262626]" : "bg-white"
      }`}>
        <header className={`w-full py-6 px-8 flex items-center justify-between border-b transition-colors duration-200 ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <div className="flex flex-col">
            <span className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-200 ${
              isDark ? "text-[#fff]" : "text-gray-600"
            }`}>
              Chameleo Code Generator
            </span>
            <h1 className={`text-xl md:text-2xl font-bold mt-1 transition-colors duration-200 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Chat with AI & generate content or code
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 ${
              isDark 
                ? "bg-gray-700 hover:bg-gray-600 text-yellow-400" 
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </header>

        <div className="flex-1 flex flex-col px-6 pb-6 pt-4">
          <div className={`flex-1 overflow-y-auto rounded-2xl p-4 space-y-4 transition-colors duration-200 ${
            isDark ? "bg-[#1a1a1a]" : "bg-[#F5F5F7]"
          }`}>
            {messages.length === 0 && (
              <div className={`text-center text-sm mt-10 transition-colors duration-200 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}>
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
                  className={`relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap transition-colors duration-200 ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : isDark
                      ? "bg-[#2a2a2a] text-gray-100 shadow-sm border border-gray-700"
                      : "bg-white text-gray-900 shadow-sm border border-gray-100"
                  }`}
                >
                  {m.role === "assistant" && (
                    <button
                      onClick={() => handleCopy(m.content)}
                      className={`absolute top-0 right-2 text-xs transition-colors duration-200 ${
                        isDark 
                          ? "text-gray-400 hover:text-gray-200" 
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                      title="Copy"
                    >
                      ⧉
                    </button>
                  )}
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`text-xs animate-pulse transition-colors duration-200 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                AI is thinking…
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {error && (
              <div className={`text-xs rounded-xl px-3 py-2 transition-colors duration-200 ${
                isDark
                  ? "text-red-400 bg-red-900/30 border border-red-800"
                  : "text-red-500 bg-red-50 border border-red-100"
              }`}>
                {error}
              </div>
            )}
            {copyError && (
              <div className={`text-xs rounded-xl px-3 py-2 transition-colors duration-200 ${
                isDark
                  ? "text-red-400 bg-red-900/30 border border-red-800"
                  : "text-red-500 bg-red-50 border border-red-100"
              }`}>
                {copyError}
              </div>
            )}
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything, generate content, or request code…"
                className={`flex-1 min-h-[52px] max-h-40 rounded-2xl border px-4 py-3 text-sm outline-none resize-y transition-colors duration-200 ${
                  isDark
                    ? "border-gray-700 bg-[#1a1a1a] text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50"
                    : "border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`h-[52px] px-5 rounded-2xl text-sm font-semibold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 ${
                  isDark
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {isLoading ? "Sending…" : "Send"}
              </button>
            </div>
            <p className={`text-[11px] transition-colors duration-200 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}>
              Tip: Ask for &quot;Next.js API route with TypeScript&quot;, &quot;SEO‑optimized
              blog intro&quot;, or &quot;explain this piece of code&quot;.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
