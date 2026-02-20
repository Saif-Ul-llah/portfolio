"use client";

import { useState, FormEvent } from "react";
import { Github, Mail, Linkedin, Send, MapPin, ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        const data = await res.json();
        alert("Failed to send: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative grid-pattern">
      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-accent-cyan text-sm font-medium tracking-widest uppercase mb-4 block">
              Get in Touch
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Let&apos;s Work <span className="gradient-text">Together</span>
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Have a project in mind? Let&apos;s discuss how I can help
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left - Info */}
          <ScrollReveal direction="left" className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Contact Info</h3>
                <div className="space-y-4">
                  <a
                    href="mailto:saifhammad411@gmail.com"
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:bg-accent-purple/20 transition-colors">
                      <Mail size={18} />
                    </div>
                    <span className="text-sm">saifhammad411@gmail.com</span>
                  </a>
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <span className="text-sm">Pakistan</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Socials</h3>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/Saif-Ul-llah/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
                  >
                    <Github size={20} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/saif-hammad-952a94219"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href="mailto:saifhammad411@gmail.com"
                    className="w-11 h-11 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
                  >
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right - Form */}
          <ScrollReveal direction="right" className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
              {isSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                  Message sent successfully! I&apos;ll get back to you soon.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm input-glow transition-all placeholder:text-gray-600"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm input-glow transition-all placeholder:text-gray-600"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm input-glow transition-all placeholder:text-gray-600"
                  placeholder="Project discussion"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm input-glow transition-all resize-none placeholder:text-gray-600"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-glow w-full px-8 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-medium inline-flex items-center justify-center gap-2 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </ScrollReveal>
        </div>

        {/* Footer */}
        <div className="section-divider mt-20 mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Saif-Ul-llah. All rights reserved.</p>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#home")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            Back to top <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
