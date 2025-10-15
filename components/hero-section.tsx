"use client";

export function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          I Make End-to-End <span className="gradient-text">Mobile and Backend Applications</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Hi! I&apos;m Muhammad Ashar, a Software Engineer who loves solving complex problems.
        </p>
      </div>
    </section>
  );
}