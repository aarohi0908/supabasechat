import { useEffect, useRef, useState } from "react";

type Props = {
  user: { id: string; name: string | null } | null;
  partnerId: string | null;
  pairingStatus: "idle" | "waiting" | "connected" | "bot";
};

type Msg = { id: string; from: string; text: string; ts: number };

export default function ChatWindow({ user, partnerId, pairingStatus }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const bc = new BroadcastChannel("stranger-chat-demo");
    bcRef.current = bc;
    bc.onmessage = (ev) => {
      const m = ev.data;
      if (!m) return;
      if (m.type === "chat" && m.to === (user?.id || null) ) {
        setMsgs(prev => [...prev, { id: Math.random().toString(36), from: m.from, text: m.text, ts: Date.now() }]);
      }
    };
    return () => bc.close();
  }, [user?.id]);

  useEffect(() => {
    // if paired with bot, seed a friendly opener
    if (partnerId === "bot") {
      setMsgs([{ id: "seed", from: "bot", text: "Hey there! I'm ChatBot — tell me a quirky fact about you.", ts: Date.now() }]);
    }
  }, [partnerId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [msgs]);

  function send() {
    if (!text.trim() || !user) return;
    const m: Msg = { id: Math.random().toString(36), from: user.id, text: text.trim(), ts: Date.now() };
    setMsgs(prev => [...prev, m]);
    setText("");

    // broadcast chat message
    if (partnerId && partnerId !== "bot") {
      bcRef.current?.postMessage({ type: "chat", from: user.id, to: partnerId, text: m.text });
    } else {
      // bot echo behavior: respond after a short delay
      setTimeout(() => {
        const reply = botReply(m.text);
        setMsgs(prev => [...prev, { id: Math.random().toString(36), from: "bot", text: reply, ts: Date.now() }]);
      }, 900 + Math.random() * 600);
    }
  }

  function botReply(input: string) {
    const lower = input.toLowerCase();
    if (lower.includes("hi") || lower.includes("hello")) return "Hello! What's the most surprising thing you've done?";
    if (lower.includes("travel") || lower.includes("trip")) return "Traveling is great — where's one place you want to go?";
    if (lower.includes("music")) return "Nice taste! I love discovering obscure tunes too.";
    if (lower.length < 10) return "Tell me a bit more — I'm curious!";
    return "That's fascinating — tell me why that's interesting to you.";
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto p-4 space-y-4" ref={scrollRef}>
        {msgs.length === 0 && (
          <div className="text-center text-slate-400 mt-12">No messages yet. Start the conversation 👋</div>
        )}

        {msgs.map(m => {
          const me = m.from === user?.id;
          return (
            <div key={m.id} className={`flex ${me ? "justify-end" : "justify-start"}`}>
              <div className={`msg ${me ? "me" : "them"}`}>
                {m.text}
                <div className="text-[10px] opacity-60 mt-1 text-right">{new Date(m.ts).toLocaleTimeString()}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            className="flex-1 rounded-xl border px-4 py-2"
            placeholder={pairingStatus === "connected" || pairingStatus === "bot" ? "Say something..." : "Find a match first"}
            disabled={!(pairingStatus === "connected" || pairingStatus === "bot")}
          />
          <button
            onClick={send}
            disabled={!(pairingStatus === "connected" || pairingStatus === "bot")}
            className="px-4 py-2 rounded-xl bg-primary text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>

        <div className="mt-2 text-xs text-slate-400">
          {pairingStatus === "waiting" && "Searching…"}
          {pairingStatus === "idle" && "Click 'Find a stranger' to start"}
        </div>
      </div>
    </div>
  );
}
