"use client";

import React, { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import Image from "next/image";
import Logo from "../assest/images/logo-2.svg";

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

  const handleCopyAll = async () => {
    if (messages.length === 0) return;
    
    try {
      const fullChat = messages
        .map((m) => {
          const role = m.role === "user" ? "You" : "AI Assistant";
          return `${role}:\n${m.content}\n`;
        })
        .join("\n---\n\n");
      
      await navigator.clipboard.writeText(fullChat);
      setCopyError(null);
    } catch (err: any) {
      console.error("Copy failed", err);
      setCopyError("Copy failed. Try again.");
    }
  };

  return (
    <main className={`min-h-screen flex transition-colors duration-200 ${
      isDark ? "bg-[#000000]" : "bg-white"
    }`}>
      {/* Left Sidebar */}
      <aside className={`w-64 flex-shrink-0 flex flex-col border-r transition-colors duration-200 sticky top-0 h-screen ${
        isDark ? "bg-[#171717] border-gray-800" : "bg-gray-50 border-gray-200"
      }`}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image
                src={Logo}
                alt="Chameleo Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className={`font-semibold text-sm transition-colors duration-200 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Chameleo AI Assistant
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Full Width */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Chat Area Header */}

                  
        <header className={`sticky top-0 z-30 w-full py-4 px-6 border-b flex items-center justify-between transition-colors duration-200 ${
          isDark ? "bg-[#171717] border-gray-800" : "bg-white border-gray-200"
        }`}>
          <h1 className={`text-lg font-semibold transition-colors duration-200 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            Chat with AI & Generate Content or Code
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
              isDark 
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </header>

        {/* Messages Area - Scrollable */}
        <div className={`flex-1 overflow-y-auto px-6 py-8 pb-32 transition-colors duration-200 ${
          isDark ? "bg-[#0f0f0f]" : "bg-white"
        }`}>
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  Where should we begin?
                </h2>
                <p className={`text-sm transition-colors duration-200 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}>
                  Start by asking for blog ideas, marketing copy, or a piece of code.
                </p>
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`relative max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap transition-colors duration-200 ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : isDark
                      ? "bg-[#2a2a2a] text-gray-100 shadow-sm border border-gray-700"
                      : "bg-gray-100 text-gray-900 shadow-sm border border-gray-200"
                  }`}
                >
                  {m.role === "assistant" && (
                    <button
                      onClick={() => handleCopy(m.content)}
                      className={`absolute top-2 right-2 text-xs transition-colors duration-200 ${
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
              <div className={`text-sm animate-pulse transition-colors duration-200 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                AI is thinking…
              </div>
            )}

            {/* Copy All Button - Shows when chat is complete */}
            {messages.length > 0 && !isLoading && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleCopyAll}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  title="Copy entire chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Chat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Fixed to Bottom */}
        <div className={`fixed bottom-0 left-64 right-0 border-t transition-colors duration-200 z-10 ${
          isDark ? "bg-[#171717] border-gray-800" : "bg-white border-gray-200"
        }`}>
          <div className="max-w-4xl mx-auto px-6 py-4 space-y-3">
            {error && (
              <div className={`text-xs rounded-lg px-3 py-2 transition-colors duration-200 ${
                isDark
                  ? "text-red-400 bg-red-900/30 border border-red-800"
                  : "text-red-500 bg-red-50 border border-red-100"
              }`}>
                {error}
              </div>
            )}
            {copyError && (
              <div className={`text-xs rounded-lg px-3 py-2 transition-colors duration-200 ${
                isDark
                  ? "text-red-400 bg-red-900/30 border border-red-800"
                  : "text-red-500 bg-red-50 border border-red-100"
              }`}>
                {copyError}
              </div>
            )}
            <div className="flex items-center gap-2">
   

              {/* Input Box */}
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything"
                  className={`w-full min-h-[52px] max-h-40 rounded-2xl border px-4 py-3 pr-32 text-sm outline-none resize-none transition-colors duration-200 ${
                    isDark
                      ? "border-gray-700 bg-[#1a1a1a] text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                
           
              </div>

              {/* Far Right Sound Wave Button */}
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-white text-white hover:bg-gray-900"
                    : "bg-black text-white hover:bg-gray-900"
                }`}
                title="Send"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <IoSend color={isDark ? "black" : "white"} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
