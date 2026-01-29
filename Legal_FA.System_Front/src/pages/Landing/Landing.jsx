import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown, Zap, BarChart3, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [index, setIndex] = useState(0);
const [isModalOpen, setIsModalOpen] = useState(false);
  const texts = [
    "A plataforma que transforma burocracia em inteligência visual.",
    "Crie contratos que seus clientes realmente entendem e assinam com confiança."
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    // w-screen e overflow-x-hidden garantem que nada escape para os lados
    <div className="relative bg-black text-white selection:bg-purple-500/30 font-sans w-screen overflow-x-hidden">
      
      {/* HEADER DINÂMICO */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 h-[72px] flex items-center ${
          scrolled 
            ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 shadow-2xl" 
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter shrink-0 cursor-pointer">
              <Shield className="text-purple-500 fill-current" size={24} />
              <span className="text-white">Legal FA.System</span>
            </div>
            
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <button onClick={() => navigate('/login')}
            className={`text-[13px] md:text-[14px] font-semibold transition-colors duration-300 ${
                scrolled ? "text-white hover:text-purple-400" : "text-gray-200 hover:text-white" 
              }`}>
              Fazer login
            </button>
            <button onClick={() => navigate('/cadastro')}
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[13px] md:text-[14px] font-bold transition-all duration-500 transform active:scale-95 ${
                scrolled 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "bg-transparent text-white border border-white/40 hover:bg-white hover:text-black"
              }`}
            >
              Comece gratuitamente
            </button>
          </div>
        </div>
      </header>

      {/* SEÇÃO 1 - HERO (Ajustada para preenchimento total) */}
      <section className="relative h-screen w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2670&auto=format&fit=crop" 
            alt="Fundo"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-[#0a0a0a]" />
        </div>

        <div className="relative z-10 text-center w-full max-w-5xl px-6 flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.1] mb-8"
          >
            Seu jurídico pode ser <br />
            <span className="text-purple-400 italic">uma potência.</span>
          </motion.h1>

          <div className="h-24 md:h-20 mb-10 w-full flex justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl"
              >
                {texts[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          

        </div>
      </section>

{/* SEÇÃO 2 — CARDS METÁLICOS ULTRAWIDE */}
<section className="
  relative 
  bg-[#0a0a0a] 
  -mt-24 
  pt-44 
  pb-[60px] 
  px-10 
  rounded-t-[100px] 
  border-t 
  border-white/5 
  overflow-hidden
">

  {/* Glow central */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[520px] bg-white/5 blur-[180px]" />

  <div className="
    relative 
    max-w-[1920px] 
    mx-auto 
    text-center
    px-12
    2xl:px-24
  ">

    <h2 className="text-4xl md:text-8xl font-bold mb-36 tracking-tight">
      A nova era do <br /> Direito é visual.
    </h2>

{/* CARDS */}
<div className="
  flex 
  justify-center 
  items-stretch 
  gap-12
  flex-wrap
">

  {[
    {
      icon: <Zap size={60} />,
      title: "Velocidade",
      desc: "Feche os seus contratos até 3x mais rápido com fluxos inteligentes e automações na geração."
    },
    {
      icon: <BarChart3 size={60} />,
      title: "Inteligência",
      desc: "Seus contratos transformados em arquivos com visões estratégicas claras e acionáveis."
    },
    {
      icon: <Globe size={60} />,
      title: "Padronizado",
      desc: "Clareza nas documentações, pronta para operações jurídicas em grandes escalas e negociações."
    }
  ].map((item, i) => (
    <div
      key={i}
      className="
        group
        relative
        w-full
        sm:w-[480px]
        md:w-[580px]
        lg:w-[650px]
        xl:w-[700px]
        2xl:w-[750px]
        min-h-[400px] 
        rounded-[60px]
        px-12 
        py-16
        bg-metal
        border 
        border-white/20
        shadow-[0_70px_200px_rgba(0,0,0,0.9)]
        transition-all 
        duration-700
        hover:-translate-y-6
        flex 
        flex-col 
        justify-center
        items-center 
        text-center
        overflow-hidden
        mb-8
      "
    >
      {/* Reflexo metálico no hover */}
      <div className="
        pointer-events-none
        absolute 
        inset-0 
        opacity-0 
        group-hover:opacity-100
        transition-opacity 
        duration-700
        bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.15),transparent)]
        animate-metallic
      " />

      <div className="metallic-icon mb-8 relative z-10">
        {item.icon}
      </div>

      <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white relative z-10">
        {item.title}
      </h3>

      <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light relative z-10 px-4">
        {item.desc}
      </p>
    </div>
  ))}
</div>


  </div>
</section>



      {/* FOOTER */}
      <footer className="
  bg-[#0a0a0a] 
  pt-40 
  pb-24 
  text-center 
  border-t 
  border-white/5
">
  <p className="text-gray-600 text-xs tracking-[0.35em]">
    © 2026 LEGAL FA.SYSTEM — REDEFININDO O PADRÃO JURÍDICO.
  </p>
</footer>


{/* ESTILO METÁLICO */}
<style>{`
  .bg-metal {
    background: linear-gradient(
      135deg,
      rgba(255,255,255,0.14),
      rgba(255,255,255,0.03),
      rgba(255,255,255,0.14)
    );
    backdrop-filter: blur(26px);
  }

  .metallic-icon {
    background: linear-gradient(
      110deg,
      #9ca3af,
      #ffffff,
      #9ca3af
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 6s linear infinite;
  }

  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }

  @keyframes metallic {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-metallic {
    animation: metallic 3.5s ease-in-out infinite;
  }
`}</style>


    </div>
  );
}