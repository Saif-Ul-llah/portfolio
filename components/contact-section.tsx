"use client";

import { useState, FormEvent } from "react";
import { Github, Mail, Linkedin } from "lucide-react";

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
    <section id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <p className="text-gray-400 mb-8">
          Reach out so we can today and let&apos;s discuss how I can help you achieve your goals.
        </p>

        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity mb-12">
          Let&apos;s get in touch
        </button>
      </div>

      <footer className="flex justify-center gap-6 py-12 border-t border-gray-800">
        <a
          href="https://github.com/Saif-Ul-llah/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-purple-900/50 transition-colors"
        >
          <Github size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/saif-hammad-952a94219"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-purple-900/50 transition-colors"
        >
          <Linkedin size={20} />
        </a>
        <a
          href="mailto:saifhammad411@gmail.com"
          className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-purple-900/50 transition-colors"
        >
          <Mail size={20} />
        </a>
      </footer>
    </section>
  );
}