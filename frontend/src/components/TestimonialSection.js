import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ImageWithFallback from './ImageWithFallback';
import { placeholders } from '../assets/images/placeholder';

const TestimonialSection = () => {
  // References for the three containers
  const container1Ref = useRef(null);
  const container2Ref = useRef(null);
  const container3Ref = useRef(null);
  
  // References for the animation timelines
  const tl1Ref = useRef(null);
  const tl2Ref = useRef(null);
  const tl3Ref = useRef(null);

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Mental Health Advocate",
      content: "GlowSpace transformed my approach to mental wellness. The tools are intuitive and the community support is incredible. I've seen real progress in managing my anxiety.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "College Student",
      content: "As a student dealing with stress, finding GlowSpace was a game-changer. The mood tracking feature helps me understand my patterns and take proactive steps.",
      rating: 4,
    },
    {
      id: 3,
      name: "Dr. Lisa Patel",
      role: "Psychologist",
      content: "I recommend GlowSpace to my patients as a supplementary tool. The voice analysis technology provides insights that complement our therapy sessions.",
      rating: 5,
    },
    {
      id: 4,
      name: "Robert Wilson",
      role: "Corporate Professional",
      content: "Work stress was taking a toll until I found GlowSpace. The daily check-ins and resources have helped me maintain balance and productivity.",
      rating: 5,
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      role: "Teacher",
      content: "The pandemic made teaching incredibly stressful. GlowSpace provided me with tools to check in with myself and maintain my mental health during those challenging times.",
      rating: 4,
    },
    {
      id: 6,
      name: "James Taylor",
      role: "Recovery Journey",
      content: "During my recovery journey, consistent support was crucial. GlowSpace filled the gaps between therapy sessions with practical tools and community connection.",
      rating: 5,
    },
    {
      id: 7,
      name: "Aisha Patel",
      role: "Healthcare Worker",
      content: "As a frontline worker, I needed accessible mental health support. GlowSpace's quick daily assessments helped me monitor my wellbeing during high-stress periods.",
      rating: 4,
    },
    {
      id: 8,
      name: "David Morales",
      role: "Parent & Caregiver",
      content: "Balancing work and caregiving was overwhelming. GlowSpace's resources helped me prioritize self-care while supporting my family's needs.",
      rating: 5,
    },
    {
      id: 9,
      name: "Sophie Wang",
      role: "Graduate Student",
      content: "Research pressure was affecting my mental health. GlowSpace's tools helped me recognize burnout signs and implement healthy boundaries.",
      rating: 5,
    }
  ];

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  useEffect(() => {
    // Initialize GSAP animations with error handling
    try {
      tl1Ref.current = gsap.timeline({ repeat: -1 });
      tl2Ref.current = gsap.timeline({ repeat: -1 });
      tl3Ref.current = gsap.timeline({ repeat: -1 });
      
      // Configure container 1 (upward movement)
      const container1 = container1Ref.current;
      const scrollingContent1 = container1.querySelector('.scrolling-content');
      const scrollHeight1 = scrollingContent1.offsetHeight;
      
      gsap.set(scrollingContent1, { y: 0 });
      
      tl1Ref.current.to(scrollingContent1, {
        y: -scrollHeight1 / 2,
        duration: 30,
        ease: 'none',
      });
      
      // Configure container 2 (downward movement)
      const container2 = container2Ref.current;
      const scrollingContent2 = container2.querySelector('.scrolling-content');
      const scrollHeight2 = scrollingContent2.offsetHeight;
      
      gsap.set(scrollingContent2, { y: -scrollHeight2 / 2 });
      
      tl2Ref.current.to(scrollingContent2, {
        y: 0,
        duration: 25,
        ease: 'none',
      });
      
      // Configure container 3 (upward movement)
      const container3 = container3Ref.current;
      const scrollingContent3 = container3.querySelector('.scrolling-content');
      const scrollHeight3 = scrollingContent3.offsetHeight;
      
      gsap.set(scrollingContent3, { y: 0 });
      
      tl3Ref.current.to(scrollingContent3, {
        y: -scrollHeight3 / 2,
        duration: 35,
        ease: 'none',
      });
      
      // Add pause/play handlers with safer event handling
      const pauseAnimation = (timeline) => {
        gsap.to(timeline, { timeScale: 0, duration: 0.5, ease: 'power2.out' });
      };
      
      const resumeAnimation = (timeline) => {
        gsap.to(timeline, { timeScale: 1, duration: 0.5, ease: 'power2.in' });
      };
      
      // Safer event handling (using functions not arrow functions for removeEventListener)
      function pause1() { pauseAnimation(tl1Ref.current); }
      function resume1() { resumeAnimation(tl1Ref.current); }
      function pause2() { pauseAnimation(tl2Ref.current); }
      function resume2() { resumeAnimation(tl2Ref.current); }
      function pause3() { pauseAnimation(tl3Ref.current); }
      function resume3() { resumeAnimation(tl3Ref.current); }
      
      container1.addEventListener('mouseenter', pause1);
      container1.addEventListener('mouseleave', resume1);
      container2.addEventListener('mouseenter', pause2);
      container2.addEventListener('mouseleave', resume2);
      container3.addEventListener('mouseenter', pause3);
      container3.addEventListener('mouseleave', resume3);
      
      // Cleanup
      return () => {
        if (tl1Ref.current) tl1Ref.current.kill();
        if (tl2Ref.current) tl2Ref.current.kill();
        if (tl3Ref.current) tl3Ref.current.kill();
        
        container1.removeEventListener('mouseenter', pause1);
        container1.removeEventListener('mouseleave', resume1);
        container2.removeEventListener('mouseenter', pause2);
        container2.removeEventListener('mouseleave', resume2);
        container3.removeEventListener('mouseenter', pause3);
        container3.removeEventListener('mouseleave', resume3);
      };
    } catch (error) {
      console.error("Error in animation setup:", error);
    }
  }, []);
  
  // Render testimonial item with profile avatar using our new component
  const renderTestimonialItem = (testimonial, isDuplicate = false) => (
    <div 
      key={isDuplicate ? `dup-${testimonial.id}` : testimonial.id} 
      className="testimonial-item p-6 border-b border-gray-100"
    >
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <ImageWithFallback
            src={placeholders.profileImage(testimonial.name.charAt(0))}
            alt={`${testimonial.name} avatar`}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div className="ml-4">
          <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
        </div>
      </div>
      <div className="mb-3 flex">
        {renderStars(testimonial.rating)}
      </div>
      <p className="text-gray-700">{testimonial.content}</p>
    </div>
  );
  
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Static header section - completely separate from scrolling content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how GlowSpace has helped people improve their mental wellbeing and live more balanced lives.
          </p>
        </div>
      </div>
      
      {/* Scrolling testimonials section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Container 1 - Moving upward */}
          <div 
            ref={container1Ref}
            className="relative bg-white rounded-xl shadow-lg overflow-hidden"
            style={{ height: "500px", zIndex: 1 }}
          >
            <div className="scrolling-content absolute w-full">
              {/* First group of testimonials */}
              {testimonials.slice(0, 3).map(testimonial => renderTestimonialItem(testimonial))}
              
              {/* Duplicated group for seamless scrolling */}
              {testimonials.slice(0, 3).map(testimonial => renderTestimonialItem(testimonial, true))}
            </div>
          </div>
          
          {/* Container 2 - Moving downward */}
          <div 
            ref={container2Ref}
            className="relative bg-white rounded-xl shadow-lg overflow-hidden"
            style={{ height: "500px", zIndex: 1 }}
          >
            <div className="scrolling-content absolute w-full">
              {/* First group of testimonials */}
              {testimonials.slice(3, 6).map(testimonial => renderTestimonialItem(testimonial))}
              
              {/* Duplicated group for seamless scrolling */}
              {testimonials.slice(3, 6).map(testimonial => renderTestimonialItem(testimonial, true))}
            </div>
          </div>
          
          {/* Container 3 - Moving upward */}
          <div 
            ref={container3Ref}
            className="relative bg-white rounded-xl shadow-lg overflow-hidden"
            style={{ height: "500px", zIndex: 1 }}
          >
            <div className="scrolling-content absolute w-full">
              {/* First group of testimonials */}
              {testimonials.slice(6, 9).map(testimonial => renderTestimonialItem(testimonial))}
              
              {/* Duplicated group for seamless scrolling */}
              {testimonials.slice(6, 9).map(testimonial => renderTestimonialItem(testimonial, true))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
