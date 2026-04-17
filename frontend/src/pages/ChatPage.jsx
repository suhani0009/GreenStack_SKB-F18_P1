import { useState } from "react";

import Panel from "../components/ui/Panel";

const suggestionRules = [
  { keywords: ["scope 3", "supplier"], reply: "Prioritize suppliers with risk scores above 75 and request their latest activity or spend data for better Scope 3 coverage." },
  { keywords: ["electricity", "scope 2"], reply: "A renewable electricity strategy mainly reduces Scope 2 emissions. Use the scenario page to model renewable percentage changes." },
  { keywords: ["report", "audit"], reply: "Generate a date-filtered report, export the Excel file for reviewers, and use the PDF export for leadership-ready summaries." },
];

const quickPrompts = [
  "How should I reduce Scope 2 emissions?",
  "Which suppliers need ESG outreach?",
  "What should I include in an ESG report?",
];

function getAssistantReply(message) {
  const normalized = message.toLowerCase();
  const matchedRule = suggestionRules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));

  return (
    matchedRule?.reply ||
    "Try asking about Scope 1, 2, or 3 reductions, supplier outreach, reporting prep, or how to interpret emissions trends."
  );
}

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Ask me about ESG workflows, supplier follow-up, reporting, or climate scenarios.",
    },
  ]);
  const [draft, setDraft] = useState("");

  const sendMessage = (content) => {
    const text = content.trim();
    if (!text) {
      return;
    }

    setMessages((current) => [
      ...current,
      { role: "user", content: text },
      { role: "assistant", content: getAssistantReply(text) },
    ]);
    setDraft("");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Chat</p>
        <h1 className="mt-2 text-3xl font-semibold">ESG assistant</h1>
        <p className="mt-2 text-sm text-slate-500">A lightweight rule-based assistant for common sustainability workflow questions.</p>
      </div>

      <Panel title="Assistant" subtitle="Rule-based guidance for reporting and reduction planning">
        <div className="space-y-4">
          <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-3xl bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                  message.role === "assistant" ? "bg-white text-slate-700" : "ml-auto bg-moss text-white"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button key={prompt} className="btn-secondary" onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="flex flex-col gap-3 md:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(draft);
            }}
          >
            <input
              className="field flex-1"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about reporting, suppliers, or decarbonization strategy"
            />
            <button className="btn-primary md:w-40" type="submit">
              Send
            </button>
          </form>
        </div>
      </Panel>
    </div>
  );
}

export default ChatPage;
