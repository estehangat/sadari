import { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Activity, Shield, ArrowRight, ArrowLeft, Info, CheckCircle2, Instagram, Play, Pause, RotateCcw, Eye, MoveUp, Search, BedDouble, ShowerHead, AlertTriangle, CircleCheck, RotateCw, Share2, Download } from 'lucide-react';
import QRCode from 'qrcode';

function App() {
  const [step, setStep] = useState(0);
  const totalSteps = 7;

  // Symptom questionnaire state
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<number>>(new Set());

  const symptomQuestions = [
    'I feel a lump or thickening in or near the breast/underarm.',
    'Significant unexplained change in breast size or shape.',
    'One breast hangs significantly lower than usual (sudden change).',
    'Skin dimpling, puckering, or redness (like orange peel).',
    'Nipple retraction (turning inward) or discharge.',
    'Persistent pain in one spot that does not go away.',
  ];

  const toggleSymptom = (index: number) => {
    setSelectedSymptoms(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Custom animation key to trigger re-renders
  const [animKey, setAnimKey] = useState(0);

  // Flashcard steps state
  const [cardStep, setCardStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalCardSteps = 5;

  const examSteps = [
    {
      title: 'Look in the Mirror',
      description: 'Stand with shoulders straight and arms on hips. Look for changes in size, shape, or color. Note if there is any distortion or swelling.',
      icon: Eye,
    },
    {
      title: 'Raise Arms',
      description: 'Raise your arms high and look for the same changes. Look specifically for any dimpling or changes in the nipple position.',
      icon: MoveUp,
    },
    {
      title: 'Squeeze Nipples',
      description: 'Gently squeeze each nipple between your finger and thumb to check for any discharge (milky, yellow, or blood).',
      icon: Search,
    },
    {
      title: 'Feel While Lying Down',
      description: 'Use your right hand to feel your left breast. Use a firm, smooth touch with the first few finger pads. Cover the entire breast.',
      icon: BedDouble,
    },
    {
      title: 'Feel While Standing',
      description: 'Finally, feel your breasts while standing or sitting. Many find this easier in the shower when skin is wet and slippery.',
      icon: ShowerHead,
    },
  ];

  const handleCardNext = useCallback(() => {
    setCardStep(prev => (prev + 1) % totalCardSteps);
  }, []);

  const handleCardPrev = () => {
    setCardStep(prev => (prev - 1 + totalCardSteps) % totalCardSteps);
  };

  const handleCardReset = () => {
    setCardStep(0);
    setIsAutoPlay(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(prev => !prev);
  };

  useEffect(() => {
    if (isAutoPlay) {
      autoPlayRef.current = setInterval(() => {
        handleCardNext();
      }, 3000);
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlay, handleCardNext]);

  // Reset flashcard state when navigating away from step 3
  useEffect(() => {
    if (step !== 3) {
      setCardStep(0);
      setIsAutoPlay(false);
    }
  }, [step]);

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      setAnimKey(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setAnimKey(prev => prev + 1);
    }
  };

  const progressPercentage = ((step + 1) / totalSteps) * 100;

  const [isGenerating, setIsGenerating] = useState(false);

  // Generate sticker image returning max values
  const generateStickerCanvas = async () => {
    const canvas = document.createElement('canvas');
    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#FFF0F7');
    bgGrad.addColorStop(0.5, '#FFE0EF');
    bgGrad.addColorStop(1, '#FFD0E8');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Decorative circles
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#EB0080';
    ctx.beginPath();
    ctx.arc(150, 400, 250, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(900, 1500, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(950, 350, 180, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Center card background
    const cardX = 80;
    const cardY = 185;
    const cardW = W - 160;
    const cardH = 920;
    const cardR = 60;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
    ctx.fill();
    // Card border
    ctx.strokeStyle = 'rgba(235,0,128,0.15)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
    ctx.stroke();

    // Heart icon (drawn as circle with gradient)
    const heartCx = W / 2;
    const heartCy = 345;
    const heartR = 70;
    const heartGrad = ctx.createRadialGradient(heartCx, heartCy, 0, heartCx, heartCy, heartR);
    heartGrad.addColorStop(0, '#FF33A1');
    heartGrad.addColorStop(1, '#EB0080');
    ctx.fillStyle = heartGrad;
    ctx.beginPath();
    ctx.arc(heartCx, heartCy, heartR, 0, Math.PI * 2);
    ctx.fill();
    // Heart symbol
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 70px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u2665', heartCx, heartCy + 4);

    // "I completed my" text
    ctx.fillStyle = '#6B7280';
    ctx.font = '500 48px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('I completed my', W / 2, 495);

    // SADARI title
    const titleGrad = ctx.createLinearGradient(W / 2 - 200, 0, W / 2 + 200, 0);
    titleGrad.addColorStop(0, '#EB0080');
    titleGrad.addColorStop(1, '#FF33A1');
    ctx.fillStyle = titleGrad;
    ctx.font = '900 130px Inter, system-ui, sans-serif';
    ctx.fillText('SADARI', W / 2, 625);

    // Subtitle
    ctx.fillStyle = '#EB0080';
    ctx.font = '600 44px Inter, system-ui, sans-serif';
    ctx.fillText('Periksa Payudara Sendiri', W / 2, 705);

    // Divider line
    ctx.strokeStyle = 'rgba(235,0,128,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 240, 785);
    ctx.lineTo(W / 2 + 240, 785);
    ctx.stroke();

    // Motivational quote
    ctx.fillStyle = '#374151';
    ctx.font = 'italic 500 40px Inter, system-ui, sans-serif';
    ctx.fillText('"Taking care of myself is', W / 2, 865);
    ctx.fillText('an act of self-love."', W / 2, 925);

    // Date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '500 40px Inter, system-ui, sans-serif';
    ctx.fillText(dateStr, W / 2, 1045);

    // Generate QR code to a temporary canvas
    const qrSize = 300;
    const qrCanvas = document.createElement('canvas');
    await QRCode.toCanvas(qrCanvas, 'https://sadarigirlup.vercel.app', {
      width: qrSize,
      margin: 1,
      color: { dark: '#EB0080', light: '#FFFFFF00' },
    });

    // Draw QR with white background circle
    const qrCx = W / 2;
    const qrCy = 1370;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.roundRect(qrCx - qrSize / 2 - 25, qrCy - qrSize / 2 - 25, qrSize + 50, qrSize + 50, 30);
    ctx.fill();
    ctx.strokeStyle = 'rgba(235,0,128,0.15)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(qrCx - qrSize / 2 - 25, qrCy - qrSize / 2 - 25, qrSize + 50, qrSize + 50, 30);
    ctx.stroke();
    // Draw QR Code
    ctx.drawImage(qrCanvas, qrCx - qrSize / 2, qrCy - qrSize / 2, qrSize, qrSize);

    // Hashtag
    ctx.fillStyle = '#EB0080';
    ctx.font = '800 52px Inter, system-ui, sans-serif';
    ctx.fillText('#BreastCancerAwareness', W / 2, 1660);

    // Instagram handle
    ctx.fillStyle = '#6B7280';
    ctx.font = '600 44px Inter, system-ui, sans-serif';
    ctx.fillText('@girlupunsoed.id', W / 2, 1720);

    return canvas;
  };

  // Generate sticker image and share/download
  const processSticker = async (action: 'download' | 'share') => {
    setIsGenerating(true);
    try {
      const canvas = await generateStickerCanvas();

      // Convert to blob and share/download
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) return;
      const file = new File([blob], 'sadari-sticker.png', { type: 'image/png' });

      if (action === 'share') {
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'SADARI - Breast Cancer Awareness',
              text: '#BreastCancerAwareness #SADARI',
            });
            return;
          } catch {
            // User cancelled or share failed, fallback to download
          }
        } else {
          alert("Your browser doesn't support direct device sharing. The image will be downloaded instead.");
        }
      }

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sadari-sticker.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans">
      {/* Background decoration */}
      <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] pointer-events-none transition-all duration-1000" style={{ transform: `translate(${step * 20}px, ${step * 10}px)` }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-light/10 rounded-full blur-[100px] pointer-events-none transition-all duration-1000" style={{ transform: `translate(-${step * 20}px, -${step * 10}px)` }} />

      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Social Media Link */}
      <a
        href="https://instagram.com/girlupunsoed.id"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[60] flex items-center justify-center gap-2 p-2.5 sm:px-6 sm:py-3 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:text-primary hover:border-primary border-opacity-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-1 focus:ring-4 focus:ring-gray-200 group"
        aria-label="Follow us on Instagram"
      >
        <Instagram className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
        <span className="hidden sm:inline text-base font-bold tracking-wide">girlupunsoed.id</span>
      </a>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-20 pb-28 sm:pb-32">
        <div className="w-full relative min-h-[500px] flex items-center justify-center">

          {/* STEP 0: HERO SECTION */}
          {step === 0 && (
            <div key={`step-0-${animKey}`} className="absolute inset-x-0 mx-auto flex flex-col items-center justify-center text-center animate-slide-in-right">
              <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-8 shadow-inner">
                <Heart className="w-14 h-14 text-primary" strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl sm:text-7xl font-extrabold text-gray-900 tracking-tight mb-3 sm:mb-4">
                SADARI
              </h1>
              <p className="text-lg sm:text-2xl text-primary font-semibold mb-4 sm:mb-6 tracking-wide uppercase">
                Periksa Payudara Sendiri
              </p>
              <p className="max-w-2xl text-base sm:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed font-medium">
                Early detection saves lives. Empower yourself with knowledge and take control of your health. Breast cancer is highly treatable when caught early.
              </p>
              <button
                onClick={handleNext}
                className="group relative inline-flex items-center justify-center px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg font-bold text-white transition-all duration-300 bg-primary rounded-full hover:bg-primary-dark hover:-translate-y-1 shadow-xl hover:shadow-primary/40 focus:ring-4 focus:ring-primary/30"
              >
                Start Journey
                <ArrowRight className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* STEP 1: FACTS SECTION */}
          {step === 1 && (
            <div key={`step-1-${animKey}`} className="absolute inset-x-0 mx-auto w-full flex flex-col justify-center animate-slide-in-right px-2 sm:px-0 mt-8 sm:mt-0">
              <div className="text-center mb-6 sm:mb-12">
                <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-2 sm:mb-4 tracking-tight">Why It Matters</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-xl font-medium">Understanding the reality of breast cancer is the first step toward proactive care.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 max-w-4xl mx-auto w-full">
                <div className="glass p-4 sm:p-8 rounded-2xl sm:rounded-3xl flex items-start gap-4 sm:gap-5 transition-all hover:scale-[1.02] hover:shadow-primary/10">
                  <div className="p-3 sm:p-4 bg-rose-100 text-primary rounded-xl sm:rounded-2xl shrink-0">
                    <Activity className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Most Common</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Breast cancer is the most commonly diagnosed cancer among women worldwide.</p>
                  </div>
                </div>

                <div className="glass p-4 sm:p-8 rounded-2xl sm:rounded-3xl flex items-start gap-4 sm:gap-5 transition-all hover:scale-[1.02] hover:shadow-primary/10">
                  <div className="p-3 sm:p-4 bg-pink-100 text-primary rounded-xl sm:rounded-2xl shrink-0">
                    <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">High Survival Rate</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">When detected early in the localized stage, the 5-year relative survival rate is 99%.</p>
                  </div>
                </div>

                <div className="glass p-4 sm:p-8 rounded-2xl sm:rounded-3xl flex items-start gap-4 sm:gap-5 transition-all hover:scale-[1.02] hover:shadow-primary/10">
                  <div className="p-3 sm:p-4 bg-red-100 text-primary rounded-xl sm:rounded-2xl shrink-0">
                    <Info className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Not Just Genetics</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Only about 5% to 10% of breast cancers are believed to be hereditary.</p>
                  </div>
                </div>

                <div className="glass p-4 sm:p-8 rounded-2xl sm:rounded-3xl flex items-start gap-4 sm:gap-5 transition-all hover:scale-[1.02] hover:shadow-primary/10">
                  <div className="p-3 sm:p-4 bg-fuchsia-100 text-primary rounded-xl sm:rounded-2xl shrink-0">
                    <Shield className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Prevention is Key</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Regular self-exams and professional screenings are your best defense.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: AWARENESS SECTION */}
          {step === 2 && (
            <div key={`step-2-${animKey}`} className="absolute inset-x-0 mx-auto w-full flex flex-col justify-center items-center text-center animate-slide-in-right">
              <div className="max-w-4xl glass p-6 sm:p-14 rounded-3xl sm:rounded-[2.5rem] relative overflow-hidden w-full shadow-2xl shadow-primary/10">
                <div className="absolute -right-16 -top-16 sm:-right-20 sm:-top-20 text-primary/[0.03] pointer-events-none">
                  <Heart className="w-64 h-64 sm:w-80 sm:h-80" fill="currentColor" />
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-5 sm:mb-8 relative z-10 tracking-tight">Listen To Your Body</h2>

                <div className="space-y-4 sm:space-y-6 text-base sm:text-xl text-gray-700 relative z-10 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                  <p className="font-medium text-center">
                    Being proactive isn't about fear; it's about <strong className="text-primary font-bold">empowerment and self-love.</strong>
                  </p>

                  <div className="bg-primary/5 border-l-4 border-primary p-5 sm:p-8 rounded-xl sm:rounded-2xl text-left my-5 sm:my-6 shadow-sm">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="currentColor" />
                      When to check?
                    </h3>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                      Perform your self-exam <strong className="text-gray-900">once a month</strong>, ideally <strong className="text-primary">7 to 10 days after your period starts</strong>. This is when your breasts are least likely to be swollen or tender.
                    </p>
                  </div>

                  <p className="text-base sm:text-lg text-center">
                    Take just 5 minutes to feel confident about your body. Notice what's normal for you, so you can easily spot if something changes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SELF-EXAM STEPS FLASHCARDS */}
          {step === 3 && (
            <div key={`step-3-${animKey}`} className="absolute inset-x-0 mx-auto w-full flex flex-col justify-center items-center animate-slide-in-right">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight text-center">
                Self-Exam Steps
              </h2>
              <p className="text-gray-500 text-lg mb-8 text-center font-medium">Follow these 5 simple steps</p>

              {/* Flashcard */}
              <div className="w-full max-w-2xl relative">
                {examSteps.map((examStep, index) => {
                  const StepIcon = examStep.icon;
                  return (
                    <div
                      key={index}
                      className={`w-full transition-all duration-500 ease-out ${index === cardStep
                        ? 'opacity-100 translate-x-0 relative'
                        : 'opacity-0 absolute inset-0 pointer-events-none ' +
                        (index > cardStep ? 'translate-x-16' : '-translate-x-16')
                        }`}
                    >
                      <div className="glass rounded-[2rem] p-8 sm:p-12 shadow-2xl shadow-primary/10 border border-white/50">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/30">
                            <StepIcon className="w-10 h-10" />
                          </div>
                          <span className="text-primary font-bold text-sm tracking-widest uppercase mb-3">
                            Step {index + 1} of {totalCardSteps}
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
                            {examStep.title}
                          </h3>
                          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                            {examStep.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Segmented Progress Indicator */}
              <div className="flex items-center gap-2 mt-8">
                {Array.from({ length: totalCardSteps }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCardStep(index)}
                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${index === cardStep
                      ? 'w-10 bg-primary'
                      : index < cardStep
                        ? 'w-6 bg-primary/40'
                        : 'w-6 bg-gray-300'
                      }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              {/* Flashcard Controls */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleCardPrev}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:text-primary hover:border-primary transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-gray-200"
                  aria-label="Previous card"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleAutoPlay}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all shadow-md hover:shadow-lg focus:ring-4 ${isAutoPlay
                    ? 'bg-primary border-primary text-white hover:bg-primary-dark focus:ring-primary/30'
                    : 'bg-white border-gray-200 text-gray-600 hover:text-primary hover:border-primary focus:ring-gray-200'
                    }`}
                  aria-label={isAutoPlay ? 'Pause auto-play' : 'Start auto-play'}
                >
                  {isAutoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button
                  onClick={handleCardNext}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:text-primary hover:border-primary transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-gray-200"
                  aria-label="Next card"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCardReset}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-gray-200"
                  aria-label="Reset to first step"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SYMPTOM QUESTIONS */}
          {step === 4 && (
            <div key={`step-4-${animKey}`} className="absolute inset-x-0 mx-auto w-full flex flex-col justify-center items-center animate-slide-in-right">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1 tracking-tight text-center">
                Symptom Checklist
              </h2>
              <p className="text-gray-500 text-base mb-4 text-center font-medium max-w-xl">
                Select any symptoms you have noticed recently.
              </p>

              {/* Disclaimer */}
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-5 max-w-2xl w-full shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  <strong>Disclaimer:</strong> This is only a self-awareness tool, <strong>not a medical diagnosis</strong>. Always consult a healthcare professional for proper evaluation.
                </p>
              </div>

              {/* Questions */}
              <div className="w-full max-w-2xl space-y-2">
                {symptomQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => toggleSymptom(index)}
                    className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-300 ${selectedSymptoms.has(index)
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all duration-300 ${selectedSymptoms.has(index)
                        ? 'border-primary bg-primary'
                        : 'border-gray-300 bg-white'
                      }`}>
                      {selectedSymptoms.has(index) && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <span className={`text-sm sm:text-base leading-relaxed transition-colors ${selectedSymptoms.has(index) ? 'text-gray-900 font-semibold' : 'text-gray-600'
                      }`}>
                      {question}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: RESULTS */}
          {step === 5 && (
            <div key={`step-5-${animKey}`} className="absolute inset-x-0 mx-auto w-full flex flex-col justify-center items-center text-center animate-slide-in-right">
              {selectedSymptoms.size === 0 ? (
                /* No symptoms selected - GREEN */
                <div className="max-w-2xl w-full">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-5 sm:mb-8 shadow-2xl shadow-emerald-400/40">
                    <CircleCheck className="w-10 h-10 sm:w-14 sm:h-14" />
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                    No Symptoms Detected
                  </h2>
                  <div className="glass rounded-3xl sm:rounded-[2rem] p-6 sm:p-10 border-2 border-emerald-200 bg-emerald-50/50 shadow-xl shadow-emerald-100/50">
                    <p className="text-base sm:text-xl text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Based on your responses, you did not select any warning signs. That's great news!
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Continue performing your monthly self-exams <strong className="text-emerald-600">7 to 10 days after your period starts</strong>. Staying consistent is key to early detection. Remember, this is not a substitute for regular professional screenings.
                    </p>
                  </div>
                  
                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <button
                      onClick={() => {
                        setSelectedSymptoms(new Set());
                        setStep(0);
                        setAnimKey(prev => prev + 1);
                      }}
                      className="w-full sm:w-auto group inline-flex justify-center items-center px-8 py-3.5 sm:py-4 rounded-full bg-emerald-500 text-white font-bold text-base sm:text-lg hover:bg-emerald-600 transition-all shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1 focus:ring-4 focus:ring-emerald-200"
                    >
                      <RotateCw className="mr-2 sm:mr-3 w-5 h-5" />
                      Start Over
                    </button>
                    <button
                      onClick={() => {
                        setStep(6);
                        setAnimKey(prev => prev + 1);
                      }}
                      className="w-full sm:w-auto group inline-flex justify-center items-center px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-primary to-primary-light text-white font-bold text-base sm:text-lg hover:opacity-90 transition-all shadow-xl hover:shadow-primary/30 hover:-translate-y-1 focus:ring-4 focus:ring-primary/20"
                    >
                      <Share2 className="mr-2 sm:mr-3 w-5 h-5" />
                      Spread Awareness
                    </button>
                  </div>
                </div>
              ) : (
                /* Symptoms selected - YELLOW/AMBER */
                <div className="max-w-2xl w-full">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white mx-auto mb-3 sm:mb-4 shadow-xl shadow-amber-400/30">
                    <AlertTriangle className="w-7 h-7 sm:w-9 sm:h-9" />
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 tracking-tight">
                    Symptoms Detected
                  </h2>
                  <p className="text-sm sm:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4">
                    You selected <strong className="text-amber-600">{selectedSymptoms.size} symptom{selectedSymptoms.size > 1 ? 's' : ''}</strong> that may require professional attention.
                  </p>
                  <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-amber-200 bg-amber-50/50 shadow-lg shadow-amber-100/50 flex flex-col">
                    <div className="text-left space-y-1.5 mb-3 sm:mb-4 overflow-y-auto max-h-[25vh] sm:max-h-[30vh] pr-1 custom-scrollbar">
                      {Array.from(selectedSymptoms).map(index => (
                        <div key={index} className="flex items-start gap-2.5 bg-white/60 px-3 py-2 rounded-lg">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700 leading-snug">{symptomQuestions[index]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-amber-100/80 rounded-lg p-3 sm:p-4 border border-amber-200 mt-auto shrink-0">
                      <p className="text-xs sm:text-base text-amber-900 font-semibold leading-relaxed">
                        We strongly recommend consulting a healthcare professional for a proper clinical examination. Early detection is your strongest ally.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <button
                      onClick={() => {
                        setSelectedSymptoms(new Set());
                        setStep(0);
                        setAnimKey(prev => prev + 1);
                      }}
                      className="w-full sm:w-auto group inline-flex justify-center items-center px-7 py-3.5 sm:py-3 rounded-full bg-amber-500 text-white font-bold text-base hover:bg-amber-600 transition-all shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 focus:ring-4 focus:ring-amber-200"
                    >
                      <RotateCw className="mr-2 w-5 h-5" />
                      Start Over
                    </button>
                    <button
                      onClick={() => {
                        setStep(6);
                        setAnimKey(prev => prev + 1);
                      }}
                      className="w-full sm:w-auto group inline-flex justify-center items-center px-7 py-3.5 sm:py-3 rounded-full bg-gradient-to-r from-primary to-primary-light text-white font-bold text-base hover:opacity-90 transition-all shadow-xl hover:shadow-primary/30 hover:-translate-y-1 focus:ring-4 focus:ring-primary/20"
                    >
                      <Share2 className="mr-2 w-5 h-5" />
                      Spread Awareness
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: SHARE/DOWNLOAD */}
          {step === 6 && (
            <div key={`step-6-${animKey}`} className="absolute inset-x-0 mx-auto w-full flex flex-col justify-center items-center text-center animate-slide-in-right px-4">
              <div className="max-w-2xl w-full flex flex-col items-center justify-center gap-8">
                
                {/* Center Column: HTML Sticker Preview */}
                <div className="w-full flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-[320px] bg-gradient-to-b from-[#FFF0F7] via-[#FFE0EF] to-[#FFD0E8] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-primary/10 flex flex-col items-center justify-center p-5 sm:p-6">
                     
                     {/* Decorative Elements */}
                     <div className="absolute top-[-10%] left-[-20%] w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
                     <div className="absolute bottom-[-10%] right-[-20%] w-56 h-56 bg-primary/10 rounded-full blur-3xl"></div>

                     {/* Main Card Area */}
                     <div className="relative z-10 bg-white/85 backdrop-blur-sm border-2 border-primary/15 rounded-[2rem] px-5 py-4 sm:px-7 sm:py-5 w-full flex flex-col items-center shadow-sm">
                       
                       {/* Heart Icon */}
                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF33A1] to-[#EB0080] flex items-center justify-center shadow-lg -mt-8 sm:-mt-10 mb-4 border-[3px] border-white">
                         <Heart className="w-6 h-6 text-white fill-white" />
                       </div>

                       <p className="text-gray-500 font-medium text-sm sm:text-base mb-0.5 text-center">I completed my</p>
                       
                       {/* Title */}
                       <div className="mb-0 text-center">
                         <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#EB0080] to-[#FF33A1] inline-block pb-1">SADARI</h3>
                       </div>
                       
                       {/* Subtitle */}
                       <p className="text-[#EB0080] font-bold text-sm sm:text-base mb-4 text-center">Periksa Payudara Sendiri</p>
                       
                       {/* Divider */}
                       <div className="w-full h-px bg-primary/20 mb-4"></div>

                       {/* Quote */}
                       <div className="text-center space-y-0.5 mb-4">
                         <p className="text-slate-700 italic font-medium text-xs sm:text-sm">"Taking care of myself is</p>
                         <p className="text-slate-700 italic font-medium text-xs sm:text-sm">an act of self-love."</p>
                       </div>

                       {/* Date */}
                       <p className="text-gray-400 font-medium text-xs text-center">
                         {new Date().toLocaleDateString('en-US', {
                           year: 'numeric',
                           month: 'long',
                           day: 'numeric',
                         })}
                       </p>
                     </div>
                  </div>
                </div>

                {/* Bottom Section: Actions */}
                <div className="w-full flex flex-col items-center text-center">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                    Spread Awareness
                  </h2>
                  <div className="glass rounded-2xl sm:rounded-3xl p-5 border-2 border-primary/10 bg-white/50 shadow-md mb-6 w-full max-w-xl">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Your answers are <b>strictly private</b>. Download or share this sticker to remind your friends to do their monthly check too!
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-lg">
                    <button
                      onClick={() => processSticker('download')}
                      disabled={isGenerating}
                      className="w-full sm:w-auto group inline-flex justify-center items-center px-8 py-3.5 sm:py-4 rounded-full bg-white border-2 border-primary text-primary font-bold text-base sm:text-lg hover:bg-primary/5 transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Download className={`mr-2 sm:mr-3 w-5 h-5 ${isGenerating ? 'animate-bounce' : ''}`} />
                      {isGenerating ? 'Generating...' : 'Download Sticker'}
                    </button>
                    <button
                      onClick={() => processSticker('share')}
                      disabled={isGenerating}
                      className="w-full sm:w-auto group inline-flex justify-center items-center px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-primary to-primary-light text-white font-bold text-base sm:text-lg hover:opacity-90 transition-all shadow-xl hover:shadow-primary/30 hover:-translate-y-1 focus:ring-4 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Share2 className={`mr-2 sm:mr-3 w-5 h-5 ${isGenerating ? 'animate-pulse' : ''}`} />
                      {isGenerating ? 'Processing...' : 'Share Sticker'}
                    </button>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => {
                        setSelectedSymptoms(new Set());
                        setStep(0);
                        setAnimKey(prev => prev + 1);
                      }}
                      className="inline-flex items-center text-gray-500 hover:text-gray-800 font-semibold transition-colors"
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      Start Over from Beginning
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Navigation Controls */}
      <div className="fixed bottom-0 left-0 w-full p-6 sm:p-10 z-50 pointer-events-none">
        <div className="max-w-5xl mx-auto flex justify-between items-center w-full">
          <div>
            {step > 0 && (
              <button
                onClick={handleBack}
                className="pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:text-primary hover:border-primary border-opacity-50 transition-all shadow-md hover:shadow-lg hover:-translate-x-1 focus:ring-4 focus:ring-gray-200"
                aria-label="Previous step"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
          </div>

          <div>
            {step > 0 && step < 5 && (
              <button
                onClick={handleNext}
                className="pointer-events-auto group flex items-center px-8 py-4 rounded-full bg-gray-900 text-white font-bold text-lg hover:bg-gray-800 transition-all shadow-xl hover:shadow-gray-900/30 hover:-translate-y-1 focus:ring-4 focus:ring-gray-300"
              >
                {step === 4 ? 'See Results' : 'Continue'}
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
