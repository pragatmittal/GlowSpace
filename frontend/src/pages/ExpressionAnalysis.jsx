import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

// List of sensitive words to highlight
const sensitiveWords = ['hate', 'kill', 'suicide', 'die', 'death', 'hurt', 'pain', 'suffer'];

function ExpressionAnalysis() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const micAnimationRef = useRef(null);
  const waveAnimationRef = useRef(null);

  useEffect(() => {
    // Initial fade in animation
    gsap.to('#expression-analysis', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  }, []);

  const handleBack = () => {
    gsap.to('#expression-analysis', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/ai-sound-analysis');
      }
    });
  };

  const handleContinue = () => {
    if (text.trim() || audioURL) {
      gsap.to('#expression-analysis', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          // Replace with actual next route
          alert('Assessment Complete!');
        }
      });
    } else {
      alert('Please share your thoughts through text or voice before continuing.');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Start recording animations
      startRecordingAnimation();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopRecordingAnimation();
    }
  };

  const startRecordingAnimation = () => {
    // Mic pulse animation
    micAnimationRef.current = gsap.to('#mic-button', {
      scale: 1.1,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // Wave animation
    waveAnimationRef.current = gsap.to('.wave-circle', {
      scale: 1.5,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      repeat: -1,
      ease: 'power1.out'
    });
  };

  const stopRecordingAnimation = () => {
    if (micAnimationRef.current) {
      micAnimationRef.current.kill();
      gsap.to('#mic-button', { scale: 1, duration: 0.3 });
    }
    if (waveAnimationRef.current) {
      waveAnimationRef.current.kill();
      gsap.to('.wave-circle', { scale: 1, opacity: 1, duration: 0.3 });
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setAudioURL(null);
    stopRecordingAnimation();
  };

  const highlightSensitiveWords = (text) => {
    let highlightedText = text;
    sensitiveWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="text-[#F28C28]">$&</span>`);
    });
    return highlightedText;
  };

  return (
    <div 
      id="expression-analysis"
      className="min-h-screen bg-[#F9F6F2] text-[#4F3222] opacity-0"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            ←
          </button>
          <div className="text-sm font-medium text-[#4F3222]/70">
            14 of 14
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#4F3222] mb-4">
            Expression Analysis
          </h1>
          <p className="text-lg text-[#4F3222]/70">
            Freely write down anything that's on your mind. Dr Freud.ai is here to listen...
          </p>
        </div>

        {/* Text Input */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 250))}
              placeholder="I don't want to be..."
              className="w-full h-48 p-4 rounded-xl bg-white border border-[#E5E5E5] focus:outline-none focus:border-[#4F3222] shadow-md placeholder:text-[#4F3222]/50 resize-none"
              disabled={isRecording}
            />
            <div className="absolute bottom-2 right-2 text-sm text-[#4F3222]/70">
              {text.length}/250
            </div>
          </div>
        </div>

        {/* Voice Recording */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col items-center gap-8">
            {!audioURL ? (
              <button
                id="mic-button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-8 py-4 rounded-full font-medium flex items-center gap-3 transition-all transform
                  ${isRecording 
                    ? 'bg-[#F28C28] text-white hover:bg-[#E07918]' 
                    : 'bg-[#A5C68C] text-[#4F3222] hover:bg-[#B7D5A0]'
                  } hover:scale-105 shadow-md`}
              >
                <svg 
                  className="w-6 h-6" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" fill="currentColor"/>
                  <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="currentColor"/>
                </svg>
                <span className="text-lg">
                  {isRecording ? 'Stop Recording' : 'Use Voice Instead'}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-6 bg-white p-4 rounded-xl shadow-md">
                <audio src={audioURL} controls className="h-10" />
                <button
                  onClick={() => setAudioURL(null)}
                  className="px-4 py-2 rounded-lg text-[#4F3222] hover:bg-[#F9F6F2] transition-colors"
                >
                  Re-record
                </button>
              </div>
            )}

            {/* Recording Animation */}
            {isRecording && (
              <div className="relative w-40 h-40 mt-4">
                {/* Wave Circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`wave-circle absolute w-full h-full rounded-full border-2 border-[#F28C28] opacity-${70 - i * 20}`}
                      style={{ transform: `scale(${1 + i * 0.2})` }}
                    />
                  ))}
                </div>
                
                {/* Listening Indicator */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-full shadow-inner">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#F28C28] rounded-full animate-pulse" />
                    <span className="text-[#4F3222] font-medium">Listening...</span>
                  </div>
                  <span className="text-sm text-[#4F3222]/70 mt-1">Speak clearly</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="px-8 py-3 rounded-full text-white bg-[#4F3222] hover:opacity-90 transition-all"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpressionAnalysis; 