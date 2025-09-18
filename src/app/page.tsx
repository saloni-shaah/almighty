import { Chat } from "@/components/chat/chat";

export default function Home() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://storage.googleapis.com/aai-web-samples/app-prototyper/bg.jpg)",
      }}
    >
      <main className="flex h-full w-full items-center justify-center p-4 md:p-6">
        <Chat />
      </main>
    </div>
  );
}
