import React from 'react';
import { ArrowLeft, BookOpen, Compass, ShieldCheck, Users, Mail, Sparkles } from 'lucide-react';

interface AboutPageProps {
  onBackToArticles: () => void;
  onOpenContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBackToArticles,
  onOpenContact,
}) => {
  const editorialTeam = [
    {
      name: 'Elena Rostova',
      role: 'Senior Technology Editor',
      bio: 'Investigates machine learning systems, cognitive software architectures, and multi-modal neural models with a background in computational linguistics.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80',
    },
    {
      name: 'Marcus Vance',
      role: 'Principal Workflow Architect',
      bio: 'Focuses on workplace automation, high-leverage developer tooling, software ergonomics, and the evolving protocols of the future internet.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
    },
    {
      name: 'Kenji Takahashi',
      role: 'Hardware & Devices Analyst',
      bio: 'Examines semiconductor roadmaps, solid-state battery chemistry, smartphone optical mechanics, and ambient smart home devices.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80',
    },
    {
      name: 'Dr. Sarah Lin',
      role: 'Organizational Technology Fellow',
      bio: 'Researches autonomous software agents, synthetic biological computation, enterprise AI transformation, and the economics of technological transitions.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80',
    },
    {
      name: 'Aiden Brooks',
      role: 'Cognitive Performance Specialist',
      bio: 'Studies attention economies, digital wellness protocols, mobile software ecosystems, and high-focus rituals for knowledge workers.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top back navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <button
          onClick={onBackToArticles}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors group cursor-pointer mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to TechPulse Daily</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        {/* Editorial Masthead Header */}
        <header className="mb-12 border-b border-slate-200 pb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">
            <span>About The Publication</span>
          </div>

          <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
            Demystifying Tomorrow’s Technology Today
          </h1>

          <p className="text-xl sm:text-2xl text-slate-700 font-serif-editorial leading-relaxed border-l-2 border-indigo-600 pl-6 py-2">
            “TechPulse Daily is a modern technology publication created to make complex technology easier to understand.”
          </p>
        </header>

        {/* Mission & Scope */}
        <div className="prose prose-slate max-w-none space-y-6 text-slate-700 font-sans-ui text-base sm:text-lg leading-relaxed">
          <p>
            The velocity of technological progress has never been faster. Every week brings announcements of frontier artificial intelligence models, new consumer form factors, transformative software ecosystems, and ambitious promises about the next decade of digital society. Yet for most readers, keeping pace means wading through sensationalist headlines, breathless vendor marketing, and incomprehensible technical jargon.
          </p>

          <p>
            <strong>TechPulse Daily</strong> was founded to bridge this divide. We provide clear, rigorous, and accessible journalism covering <strong>artificial intelligence, consumer gadgets, mobile applications, digital productivity, and emerging technologies</strong> shaping our world.
          </p>
        </div>

        {/* Core Pillars */}
        <section className="my-14">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            Our Coverage Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-xl font-bold text-slate-900 mb-2">
                Artificial Intelligence & Machine Learning
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans-ui">
                Cutting through commercial hype to evaluate neural models, on-device silicon processing, natural language understanding, and automated decision systems.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-xl font-bold text-slate-900 mb-2">
                Gadgets & Hardware Engineering
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans-ui">
                Deep dives into foldable displays, advanced battery chemistries, optical camera physics, smart home ecosystems, and ambient spatial hardware.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-xl font-bold text-slate-900 mb-2">
                Digital Productivity & Cognitive Habits
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans-ui">
                Evidence-based methodologies for knowledge workers: notification defense, time blocking, deep work environments, and intentional software selection.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-xl font-bold text-slate-900 mb-2">
                Apps, Mobile Life & The Future Web
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans-ui">
                Examining the societal impact of mobile software, decentralized cryptographic identity, agentic browsing, and the evolution of digital communities.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial Standards */}
        <section className="my-14 p-8 bg-slate-900 text-white rounded-3xl">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold mb-4">
            Our Editorial Commitments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <div className="text-indigo-400 font-bold text-base mb-1">01. Zero Hype</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                We evaluate technology on what it achieves today and verifiable engineering roadmaps, rejecting unsubstantiated marketing claims.
              </p>
            </div>
            <div>
              <div className="text-indigo-400 font-bold text-base mb-1">02. Human Clarity</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complex engineering is explained with elegance and intuitive analogies without sacrificing technical fidelity.
              </p>
            </div>
            <div>
              <div className="text-indigo-400 font-bold text-base mb-1">03. Independent Lens</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                We maintain editorial autonomy, upholding strict boundaries between journalistic analysis and commercial interests.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial Masthead */}
        <section className="my-14">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-slate-900">
              Editorial Staff
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {editorialTeam.map((member) => (
              <div key={member.name} className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 border border-slate-200 mb-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-serif-editorial text-lg font-bold text-slate-900">
                    {member.name}
                  </h3>
                  <div className="text-xs font-semibold text-indigo-600 mb-3">
                    {member.role}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans-ui">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Strip */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif-editorial text-xl font-bold text-slate-900">
              Have a story pitch or research tip?
            </h3>
            <p className="text-sm text-slate-600">
              Our editors welcome tips, technical corrections, and scholarly perspectives.
            </p>
          </div>
          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Editors</span>
          </button>
        </div>
      </div>
    </div>
  );
};
