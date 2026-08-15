import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import AuthModal from "../components/AuthModal";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Head>
        <title>StrangerChat — Meet a stranger</title>
        <meta name="description" content="Beautiful demo front-end for a stranger chat app" />
      </Head>

      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white text-xl font-bold animate-float">SC</div>
              <div>
                <h1 className="text-3xl font-bold">StrangerChat</h1>
              </div>
            </div>

            <h2 className="text-4xl font-extrabold">Meet new people instantly — as a guest or with an account.</h2>

            <p className="text-slate-600">No long setup: choose Guest to jump into a chat, or create an email account for a persistent display name and settings.</p>

            <div className="flex gap-4 mt-4">
              <Link href="/chat">
                <a className="px-6 py-3 rounded-xl bg-primary text-white shadow hover:opacity-95">Continue as Guest</a>
              </Link>

              <button
                className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50"
                onClick={() => setAuthOpen(true)}
              >
                Sign up / Log in
              </button>
            </div>

            <div className="mt-6 text-sm text-slate-500">
              <strong>Demo note:</strong> this frontend uses client-side pairing (BroadcastChannel) to demo conversations in your browser tabs. For real strangers, connect to a realtime backend (instructions in README).
            </div>

            <div className="mt-4 text-sm">
              <div className="text-slate-700">
                Support:{" "}
                <a href="mailto:strangerchatsupport@atomicmail.io" className="text-primary underline">
                  strangerchatsupport@atomicmail.io
                </a>
              </div>

              <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 p-3 rounded">
                <strong>Warning:</strong> Sometimes a few things won't work on this website because it is a student's project.
              </div>

              <div className="mt-2 text-sm text-slate-500">
                <em>We operate from Netherlands</em>
              </div>

              <div className="mt-3 text-sm text-red-800 bg-red-50 border border-red-100 p-3 rounded">
                <strong>Notice:</strong> The platform has stopped chat services from 15 August, 2:00 PM CEST. Users are requested to migrate to any other platform.
              </div>
            </div>
          </section>

          <section className="rounded-2xl p-8 bg-gradient-to-br from-white/60 to-slate-50/60 border border-slate-100 shadow-sm">
            <div className="h-96 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">A</div>
                    <div>
                      <div className="font-semibold">Random Stranger</div>
                      <div className="text-xs text-slate-400">Just now</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">• anonymous</div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="msg them">Hi — want to chat?</div>
                  <div className="msg me">Sure — tell me a weird fact about you.</div>
                  <div className="msg them">I collect elevator music on old cassettes.</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex gap-2">
                  <input className="flex-1 rounded-xl border border-slate-200 px-4 py-2" placeholder="Try sending 'Hi'..." />
                  <button className="px-4 py-2 rounded-xl bg-accent text-white">Send</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
