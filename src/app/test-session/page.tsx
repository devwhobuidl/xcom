import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TestSessionPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="p-8 font-mono">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      <pre className="bg-zinc-900 p-4 rounded border border-white/10 overflow-auto">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
