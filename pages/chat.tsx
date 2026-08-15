import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ChatWindow from "../components/ChatWindow";

type User = { id: string; name: string | null; email?: string | null };

function getLocalUser(): User {
  const raw = localStorage.getItem("sc_user");
  if (raw) {
    try { const u = JSON.parse(raw); return { id: u.email || "guest:" + Math.random().toString(36).slice(2,9), name: u.name || u.email || "Guest" }; } catch {}
  }
  const guest = { id: "guest:" + Math.random().toString(36).slice(2,9), name: "Guest" };
  localStorage.setItem("sc_user", JSON.stringify(guest));
  return guest;
}

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"idle" | "waiting" | "connected" | "bot">("idle");
  const [pairedId, setPairedId] = useState<string | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    setUser(getLocalUser());
    // ensure localUser persisted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const bc = new BroadcastChannel("stranger-chat-demo");
    bcRef.current = bc;
    bc.onmessage = (ev) => {
      const m = ev.data;
      if (!m || m.type !== "match_request") return;
      // if we are waiting and someone else requests, pair
      if (status === "waiting" && m.from !== user?.id && !pairedId) {
        // send accept
        bc.postMessage({ type: "match_accept", from: user?.id, to: m.from });
        setPairedId(m.from);
        setStatus("connected");
      }
      if (m.type === "match_accept" && m.to === user?.id) {
        setPairedId(m.from);
        setStatus("connected");
      }
    };
    return () => bc.close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user?.id, pairedId]);

  function startMatching() {
    if (!user) return;
    setStatus("waiting");
    // broadcast request
    bcRef.current?.postMessage({ type: "match_request", from: user.id, ts: Date.now() });
    // fallback to bot after 6s
    setTimeout(() => {
      if (status === "waiting") {
        setStatus("bot");
        setPairedId("bot");
      }
    }, 6000);
  }

  function endChat() {
    setStatus("idle");
    setPairedId(null);
  }

  return (
    <>
      <Head>
        <title>Chat — StrangerChat</title>
      </Head>

      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-white/60">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <a className="font-bold text-lg text-primary">StrangerChat</a>
              </Link>
              <div className="text-sm text-slate-500">Connect with a random stranger — demo</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">{user?.name || "Guest"}</div>
              <button className="px-3 py-1 rounded-lg border" onClick={() => {
                localStorage.removeItem("sc_user");
                setUser(getLocalUser());
              }}>Reset identity</button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-6xl mx-auto w-full p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <aside className="md:col-span-1 rounded-2xl bg-white p-4 border">
              <div className="text-sm text-slate-500">You are</div>
              <div className="mt-2 text-lg font-medium">{user?.name}</div>

              <div className="mt-6">
                {status === "idle" && <button onClick={startMatching} className="w-full px-4 py-3 bg-primary text-white rounded-xl">Find a stranger</button>}
                {status === "waiting" && <div>
                  <div className="mb-3">Searching for a match…</div>
                  <button onClick={() => { setStatus("idle"); }} className="w-full px-4 py-2 rounded-xl border">Cancel</button>
                </div>}
                {status === "connected" && <div>
                  <div className="mb-3">Connected with <span className="font-medium">{pairedId}</span></div>
                  <button onClick={endChat} className="w-full px-4 py-2 rounded-xl bg-red-500 text-white">End chat</button>
                </div>}
                {status === "bot" && <div>
                  <div className="mb-3">Paired with Bot (demo)</div>
                  <button onClick={endChat} className="w-full px-4 py-2 rounded-xl bg-red-500 text-white">End chat</button>
                </div>}
              </div>

            </aside>

            <section className="md:col-span-2">
              <div className="rounded-2xl bg-white border p-4 h-[60vh] flex flex-col">
                <ChatWindow user={user} partnerId={pairedId} pairingStatus={status} />
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
