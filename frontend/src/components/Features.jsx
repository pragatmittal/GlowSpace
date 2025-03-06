import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const featuresRef = useRef(null);
  const cardsRef = useRef([]);
  
  useEffect(() => {
    // Animate section title
    gsap.from('.features-title', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: featuresRef.current,
        start: 'top 80%'
      }
    });

    // Animate cards with stagger
    gsap.from(cardsRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: featuresRef.current,
        start: 'top 70%'
      }
    });

    // Set up hover animations for each card
    cardsRef.current.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { 
          scale: 1.05, 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          duration: 0.3 
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { 
          scale: 1, 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          duration: 0.3 
        });
      });
    });
    
  }, []);

  // Features data
  const featuresData = [
    {
      icon: "🧠",
      title: "AI Mental Health Assessment",
      description: "Get personalized insights and analysis to understand your mental wellbeing through advanced AI."
    },
    {
      icon: "🎙️",
      title: "Mood Detection via Voice",
      description: "Our AI analyzes your voice patterns to detect mood changes and offer timely support."
    },
    {
      icon: "🤝",
      title: "Community Support & Peer Connection",
      description: "Connect with others on similar journeys in a safe, moderated environment."
    },
    {
      icon: "🧘",
      title: "Personalized Meditation",
      description: "Experience custom relaxation exercises tailored to your specific needs and preferences."
    }
  ];

  return (
    <section ref={featuresRef} className="py-20 bg-gray-50 bg-opacity-80">
      <div className="container mx-auto px-4">
        <h2 className="features-title text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
          Powerful Features for Your Mental Wellness Journey
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="feature-card flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
