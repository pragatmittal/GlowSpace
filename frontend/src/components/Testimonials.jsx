import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Product Designer",
      text: "GlowSpace has transformed how we approach design projects. The collaborative features are incredible!"
    },
    {
      name: "Sarah Williams",
      role: "Creative Director",
      text: "The tools in GlowSpace have helped our team deliver projects faster with better results."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What People Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
