import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Github, Linkedin, Mail, ChevronRight, 
  Code, Palette, TrendingUp, Briefcase,
  ExternalLink, MapPin, MessageSquare, Send, Loader2
} from 'lucide-react';

export default function Portfolio() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'model', text: "Hi! I'm an AI assistant trained on M. Hasaan's portfolio. Ask me anything about his experience, skills, or projects!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const apiKey = ""; // Canvas provides this automatically
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      // UPDATED PROMPT: Removed South Korea Master's reference
      const systemPrompt = `You are a helpful AI assistant representing Muhammad Hasaan on his personal portfolio website. 
      Your goal is to answer questions about him professionally and enthusiastically.
      Here is the information you know about him:
      - He is a Creative Director, Web Developer, and E-commerce Founder based in Havelian, Pakistan.
      - He founded and directs Xetechstudio, a digital creative agency (branding, Next.js web dev, Meta/TikTok ads, video editing).
      - He founded and owns READY, an e-commerce apparel and leather goods brand (Shopify, SEO, product design).
      - He previously worked as an Operations Manager for an 80-person wholesale garment business in Rawalpindi.
      - He has a Bachelor's Degree in English Language and Literature and a Professional Design Certificate.
      - Tech Skills: Next.js, React, Shopify, Tailwind CSS, Vercel.
      - Design Skills: Adobe Illustrator, Photoshop, CapCut, Premiere Pro.
      - Marketing: Meta/TikTok ads, bilingual copywriting (English/Roman Urdu), SEO.
      Keep answers concise (1-3 paragraphs max) and conversational. Do not make up information. If you don't know something, say so and suggest they contact him via the form.`;

      const apiHistory = chatMessages.slice(1).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      
      apiHistory.push({ role: 'user', parts: [{ text: userMessage }] });

      const payload = {
        contents: apiHistory,
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const replyText = data.candidates[0].content.parts[0].text;
        setChatMessages(prev => [...prev, { role: 'model', text: replyText }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again later or use the contact form." }]);
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      setChatMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try reaching out via the contact form instead." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  /* Helper for text highlights */
  const Highlight = ({ children }) => (
    <span className="inline-block text-sky-300 bg-sky-500/10 px-2 py-0.5 mx-1 rounded border border-sky-500/20 font-semibold shadow-[0_0_10px_rgba(14,165,233,0.15)]">
      {children}
    </span>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-sky-500/30 selection:text-sky-200 relative overflow-hidden">
      
      {/* Ambient Background Glows for Glass Effect */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-600/10 blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-purple-600/5 blur-[100px] pointer-events-none"></div>

      {/* Navigation */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 shadow-2xl' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold tracking-tighter text-white drop-shadow-md">
            M<span className="text-sky-400">.</span> Hasaan
          </a>
          
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-slate-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <button 
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="flex flex-col py-4 px-6 gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-slate-300 hover:text-sky-400 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col justify-center min-h-screen max-w-6xl mx-auto">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sky-300 text-sm font-medium mb-8 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            Available for new opportunities
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8 tracking-tight">
            I craft digital experiences & build minimal brands.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl leading-relaxed">
            I'm <strong className="text-white font-semibold">Muhammad Hasaan</strong> — an expert in 
            <Highlight>Next.js & React</Highlight>, a versatile 
            <Highlight>Creative Director</Highlight>, and an 
            <Highlight>E-commerce Founder</Highlight>. I bridge the gap between compelling, bilingual storytelling and striking visual design to drive real business growth.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href="#experience" 
              className="px-8 py-3.5 rounded-xl bg-sky-500/10 text-sky-300 font-semibold border border-sky-500/30 hover:bg-sky-500 hover:text-white hover:border-transparent transition-all duration-300 flex items-center gap-2 hover:gap-3 group shadow-[0_0_20px_rgba(14,165,233,0.1)] hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]"
            >
              View My Work
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a 
              href="#contact" 
              className="px-8 py-3.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 border border-white/10 transition-all backdrop-blur-sm"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {}
      <section id="about" className="py-24 px-6 border-t border-white/5 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">About Me</h2>
            <div className="h-px bg-white/10 flex-grow max-w-xs"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              <p>
                My journey is built on a unique foundation: a <strong className="text-white font-medium">Bachelor's in English Language and Literature</strong> combined with a <strong className="text-white font-medium">Professional Design Certificate</strong>. This allows me to approach projects not just as a developer or designer, but as a <Highlight>Storyteller</Highlight>.
              </p>
              <p>
                Whether I'm writing persuasive copy for ad campaigns, editing dynamic videos, or architecting a seamless <Highlight>Shopify</Highlight> storefront, my focus is always on the narrative and the user experience. I've successfully translated this philosophy into real-world business operations, blending creativity with concrete logistics and management.
              </p>
            </div>
            
            {/* Glassmorphism Profile Visual */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative group p-1">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-sky-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                <div className="w-full h-full rounded-[1.3rem] flex items-center justify-center bg-black/40 relative z-10 border border-white/5">
                   <div className="text-center">
                      <Palette size={64} className="mx-auto mb-4 text-white/30" />
                      <p className="text-sm font-medium uppercase tracking-widest text-white/30">Profile Image</p>
                   </div>
                </div>
              </div>
              <div className="absolute -inset-4 border border-white/10 rounded-3xl -z-10 translate-x-4 translate-y-4 opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="experience" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ventures & Experience</h2>
            <div className="h-px bg-white/10 flex-grow max-w-xs"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Glass Card 1: Xetechstudio */}
            <div className="group rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 relative overflow-hidden flex flex-col h-full shadow-lg">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
              <div className="relative z-10 flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/5 text-sky-300 border border-white/10 p-3 rounded-xl shadow-inner">
                    <Code size={24} />
                  </div>
                  <span className="text-xs font-mono text-sky-200/70 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">Present</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Xetechstudio</h3>
                <h4 className="text-sky-300 font-medium mb-4 flex items-center gap-2">
                  Founder & Director
                  <span className="text-slate-500 text-sm flex items-center"><MapPin size={12} className="mr-1"/> Havelian</span>
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Leading a digital creative agency specializing in graphic design, video editing, brand identity, and social media advertising. Designed and developed the agency's web presence using Next.js.
                </p>
              </div>
              <div className="relative z-10 pt-6 mt-auto border-t border-white/10 flex gap-2 flex-wrap">
                {['Next.js', 'Branding', 'Meta Ads', 'Video Editing'].map(tag => (
                  <span key={tag} className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Glass Card 2: READY */}
            <div className="group rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 relative overflow-hidden flex flex-col h-full shadow-lg">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/20 transition-all"></div>
              <div className="relative z-10 flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/5 text-sky-300 border border-white/10 p-3 rounded-xl shadow-inner">
                    <TrendingUp size={24} />
                  </div>
                  <span className="text-xs font-mono text-sky-200/70 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">Present</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">READY</h3>
                <h4 className="text-sky-300 font-medium mb-4">Founder & Owner</h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Managing the full e-commerce pipeline for an apparel and leather goods brand. Overseeing Shopify theme customization, SEO, product design (specifying cotton/poly blends), and graphic prints.
                </p>
              </div>
              <div className="relative z-10 pt-6 mt-auto border-t border-white/10 flex gap-2 flex-wrap">
                {['Shopify', 'Product Design', 'SEO', 'E-commerce'].map(tag => (
                  <span key={tag} className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Glass Card 3: Operations Manager */}
            <div className="group rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 relative overflow-hidden flex flex-col h-full shadow-lg">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all"></div>
              <div className="relative z-10 flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/5 text-slate-300 border border-white/10 p-3 rounded-xl shadow-inner">
                    <Briefcase size={24} />
                  </div>
                  <span className="text-xs font-mono text-slate-400/70 bg-white/5 px-3 py-1 rounded-full border border-white/10">Past</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Wholesale Garments</h3>
                <h4 className="text-slate-300 font-medium mb-4 flex items-center gap-2">
                  Operations Manager
                  <span className="text-slate-500 text-sm flex items-center"><MapPin size={12} className="mr-1"/> Rawalpindi</span>
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Handled daily cash reconciliation, payroll administration, and workforce operations for an 80-person wholesale business, ensuring smooth day-to-way logistics.
                </p>
              </div>
              <div className="relative z-10 pt-6 mt-auto border-t border-white/10 flex gap-2 flex-wrap">
                {['Operations', 'Payroll', 'Management', 'Logistics'].map(tag => (
                  <span key={tag} className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {}
      <section id="skills" className="py-24 px-6 border-t border-white/5 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Core Competencies</h2>
            <div className="h-px bg-white/10 flex-grow max-w-xs"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Skill Category 1 */}
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-8 text-white font-semibold text-lg">
                <Code className="text-sky-400" size={22} />
                Web & E-commerce
              </div>
              <div className="space-y-6">
                {[
                  { name: 'Next.js & React', level: 90 },
                  { name: 'Shopify Storefronts', level: 85 },
                  { name: 'Tailwind CSS', level: 92 },
                  { name: 'Vercel Deployment', level: 80 }
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300 font-medium">{skill.name}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full relative shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Category 2 */}
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-8 text-white font-semibold text-lg">
                <Palette className="text-indigo-400" size={22} />
                Creative & Design
              </div>
              <div className="space-y-6">
                {[
                  { name: 'Adobe Illustrator', level: 95 },
                  { name: 'Adobe Photoshop', level: 90 },
                  { name: 'Premiere Pro & CapCut', level: 88 },
                  { name: 'Brand Identity', level: 92 }
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300 font-medium">{skill.name}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full relative shadow-[0_0_10px_rgba(129,140,248,0.5)]"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Category 3 */}
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-8 text-white font-semibold text-lg">
                <Megaphone className="text-purple-400" size={22} />
                Marketing & Content
              </div>
              <div className="space-y-6">
                {[
                  { name: 'Bilingual Copywriting', level: 95 },
                  { name: 'Meta & TikTok Ads', level: 88 },
                  { name: 'SEO Optimization', level: 80 },
                  { name: 'AI Video Gen Tools', level: 85 }
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300 font-medium">{skill.name}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full relative shadow-[0_0_10px_rgba(192,132,252,0.5)]"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {}
      <section id="contact" className="py-24 px-6 relative border-t border-white/5">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Let's build together</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Whether you need a full-scale e-commerce solution, a striking brand identity, or operations expertise, I'm ready to bring your vision to life.
            </p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Subtle glow inside the form card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-300">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors backdrop-blur-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors backdrop-blur-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-300">Message</label>
                <textarea 
                  id="message" 
                  rows="5"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors resize-none backdrop-blur-sm"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-sky-500/90 hover:bg-sky-400 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2 backdrop-blur-md border border-sky-400/50"
              >
                Send Message
                <Mail size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {}
      <footer className="border-t border-white/5 py-12 px-6 text-center text-slate-500 relative z-10">
        <div className="flex justify-center gap-6 mb-8">
          <a href="#" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm">
            <Github size={20} />
          </a>
          <a href="#" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:text-sky-400 hover:bg-sky-500/10 transition-all backdrop-blur-sm">
            <Linkedin size={20} />
          </a>
          <a href="#" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm">
            <Mail size={20} />
          </a>
        </div>
        <p>© {new Date().getFullYear()} Muhammad Hasaan. All rights reserved.</p>
        <p className="mt-2 text-sm">Designed in Havelian, Built with React & Tailwind.</p>
      </footer>

      {}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div className="mb-4 w-80 sm:w-96 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[450px] transition-all duration-300 origin-bottom-right">
            <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(14,165,233,0.5)] border border-sky-400/50">
                  AI
                </div>
                <div>
                  <h3 className="font-semibold text-white">Portfolio Assistant</h3>
                  <p className="text-xs text-sky-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_5px_rgba(14,165,233,1)]"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto bg-transparent flex flex-col gap-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-sky-500/90 text-white rounded-tr-sm border border-sky-400/50 shadow-lg' 
                        : 'bg-white/10 text-slate-200 border border-white/10 rounded-tl-sm backdrop-blur-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 bg-white/5 border-t border-white/10 backdrop-blur-md">
              <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about my experience..."
                  className="w-full bg-black/50 border border-white/10 rounded-full pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 focus:bg-black/70 transition-all"
                  disabled={isTyping}
                />
                <button 
                  type="submit"
                  disabled={!chatInput.trim() || isTyping}
                  className="absolute right-1 top-1 bottom-1 w-8 flex items-center justify-center text-sky-400 hover:text-sky-300 disabled:opacity-50 disabled:hover:text-sky-400 transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 border ${
            isChatOpen 
              ? 'bg-white/10 text-white border-white/20 backdrop-blur-md' 
              : 'bg-sky-500 text-white border-sky-400/50 shadow-[0_0_20px_rgba(14,165,233,0.3)]'
          }`}
          aria-label="Toggle chat"
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

    </div>
  );
}

function Megaphone(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m3 11 18-5v12L3 14v-3z"></path>
            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
        </svg>
    )
}