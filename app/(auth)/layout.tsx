import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen w-full flex bg-[#121620] antialiased selection:bg-purple-600 selection:text-white">
      <div className="h-full w-full grid grid-cols-1 md:grid-cols-2">

        {/* LEFT PANEL: VISUAL HERO */}
        <div className="relative hidden md:block h-full w-full bg-[#0a0c10]">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-transparent z-10 pointer-events-none" />
          <Image
            src="/images/garden.jpg"
            alt="Music Headphones"
            fill
            priority
            sizes="(max-width: 768px) 0vw, 50vw"
            className="object-cover brightness-[0.75] contrast-[1.05]"
          />
        </div>

        {/* RIGHT PANEL: INTERACTIVE CONTENT ZONE */}
        <div className="h-full w-full overflow-y-auto">
          {children}
        </div>

      </div>
    </section>
  );
}