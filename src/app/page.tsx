import { Chat } from "@/components/chat/chat";

export default function Home() {
  return (
    <main className="flex h-full items-center justify-center p-4 md:p-6 bg-background">
      <Chat />
    </main>
  );
}
