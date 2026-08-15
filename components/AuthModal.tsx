import { useEffect, useState } from "react";

type Props = { onClose: () => void };

export default function AuthModal({ onClose }: Props) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simple client-side "auth": store in localStorage. NOT secure — demo only.
    if (!email) return alert("Please provide email");
    const users = JSON.parse(localStorage.getItem("sc_users") || "{}");
    if (mode === "signup") {
      if (!name) return alert("Please provide a display name");
      if (!phone) return alert("Please provide a phone number");
      users[email] = { email, name, phone };
      localStorage.setItem("sc_users", JSON.stringify(users));
      localStorage.setItem("sc_user", JSON.stringify({ email, name, phone }));
      alert("Signed up! You are logged in for demo.");
      onClose();
    } else {
      if (!users[email]) return alert("No account found for this email (demo stores accounts locally).");
      // attach phone if available
      const u = users[email];
      localStorage.setItem("sc_user", JSON.stringify({ email: u.email, name: u.name, phone: u.phone }));
      alert("Logged in!");
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{mode === "signup" ? "Sign up" : "Log in"}</h3>
          <button className="text-slate-500" onClick={onClose}>Close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Display name" className="w-full rounded-lg border px-3 py-2" />
          )}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border px-3 py-2" />
          {mode === "signup" && (
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-lg border px-3 py-2" />
          )}

          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white">
              {mode === "signup" ? "Create account" : "Log in"}
            </button>
            <button type="button" className="px-4 py-2 rounded-lg border" onClick={() => setMode(mode === "signup" ? "login" : "signup")}>
              {mode === "signup" ? "Have an account? Log in" : "New? Create account"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
