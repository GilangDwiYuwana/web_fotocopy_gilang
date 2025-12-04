'use client';
import Link from "next/link";
import Navbar from "@/components/layouts/Navbar";
import { useState } from "react";
import { useRouter } from 'next/navigation'; // Import router
import { useAuth } from '@/src/hooks/useAuth'; // Import hook

export default function LandingPage() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-white via-[#f8f9fb] to-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-[#123891] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute top-40 -right-40 w-80 h-80 bg-[#4f6596] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-20 w-80 h-80 bg-[#123891] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-10">
              {/* Badge */}
              <div className="flex items-center gap-2 w-fit">
                <div className="w-2 h-2 rounded-full bg-[#123891]"></div>
                <span className="text-sm font-semibold text-[#123891] tracking-wide">FASTER PRINTING SOLUTION</span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#0e121b] leading-tight tracking-tight">
                  Print Without
                  <br />
                  <span className="bg-gradient-to-r from-[#123891] to-[#4f6596] bg-clip-text text-transparent">The Wait</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-lg sm:text-xl text-[#4f6596] max-w-lg leading-relaxed font-light">
                Upload your documents, make a secure payment, and get your prints ready the same day. Simple. Fast. Reliable.
              </p>

              {/* Features List */}
              <div className="space-y-4 py-4">
                {[
                  { title: "Instant Upload", desc: "Drag & drop your files in seconds" },
                  { title: "Secure Payment", desc: "100% encrypted transactions" },
                  { title: "Same-Day Ready", desc: "Quick turnaround guaranteed" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="w-5 h-5 rounded-full bg-[#123891] flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0e121b]">{feature.title}</p>
                      <p className="text-sm text-[#4f6596]">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link 
                  href="/pesanan/buat" 
                  className="group inline-flex items-center justify-center px-8 py-4 bg-[#123891] text-white rounded-xl font-bold shadow-lg shadow-[#123891]/30 hover:shadow-xl hover:shadow-[#123891]/40 hover:bg-[#0d2654] transition-all duration-300 text-lg overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0d2654] to-[#123891] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Link>
                
                <button 
                  onClick={() => scrollToSection('services')}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#123891] text-[#123891] rounded-xl font-bold hover:bg-[#f8f9fb] transition-all duration-300 text-lg"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md h-96">
                {/* Floating Card Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#123891]/5 to-[#4f6596]/5 rounded-3xl blur-2xl"></div>

                {/* Main Card */}
                <div className="relative bg-white rounded-2xl shadow-2xl border border-[#e8ebf3] overflow-hidden h-full flex flex-col">
                  {/* Header */}
                  <div className="h-24 bg-gradient-to-r from-[#123891] to-[#4f6596] p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-white text-sm font-medium opacity-90">Document Status</p>
                      <p className="text-white text-lg font-bold">Ready to Print</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 space-y-6">
                    {[
                      { step: 1, label: "Upload", desc: "Upload your document" },
                      { step: 2, label: "Pay", desc: "Secure payment" },
                      { step: 3, label: "Pickup", desc: "Pick up your order" }
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#123891]/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-[#123891] text-sm">{item.step}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#0e121b] text-sm">{item.label}</p>
                          <p className="text-xs text-[#4f6596]">{item.desc}</p>
                        </div>
                        <div className="text-[#4f6596]">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="h-16 bg-[#f8f9fb] border-t border-[#e8ebf3] px-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#4f6596]">Total Cost</p>
                      <p className="font-bold text-[#0e121b]">From Rp 5.000</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#123891] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0e121b] mb-4">What We Offer</h2>
            <p className="text-lg text-[#4f6596]">Everything you need for professional printing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📄",
                title: "Document Printing",
                desc: "Print your documents in high quality with various paper options"
              },
              {
                icon: "🖼️",
                title: "Photo Printing",
                desc: "Get professional photo prints with vibrant colors and details"
              },
              {
                icon: "📑",
                title: "Brochures & Flyers",
                desc: "Create stunning marketing materials for your business"
              },
              {
                icon: "🎨",
                title: "Custom Design",
                desc: "Let us design your materials or upload your own designs"
              },
              {
                icon: "📦",
                title: "Bulk Orders",
                desc: "Special pricing for large quantity orders and corporate needs"
              },
              {
                icon: "⚡",
                title: "Express Service",
                desc: "Need it faster? We offer rush printing services"
              }
            ].map((service, idx) => (
              <div 
                key={idx} 
                onMouseEnter={() => setHoveredService(idx)}
                onMouseLeave={() => setHoveredService(null)}
                className="group p-8 bg-gradient-to-br from-white to-[#f8f9fb] rounded-2xl border border-[#e8ebf3] hover:border-[#123891] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="text-5xl mb-4 transition-transform duration-300" style={{
                  transform: hoveredService === idx ? 'scale(1.2) rotate(5deg)' : 'scale(1)'
                }}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0e121b] mb-3">{service.title}</h3>
                <p className="text-[#4f6596]">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-24 px-4 bg-gradient-to-r from-[#f8f9fb] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0e121b] mb-4">Why Choose CetakDigital?</h2>
            <p className="text-lg text-[#4f6596]">The best choice for all your printing needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: "Fast & Reliable",
                items: ["Same-day delivery available", "99% on-time guarantee", "Professional quality assured"]
              },
              {
                title: "Easy & Convenient",
                items: ["Simple online ordering", "Multiple payment options", "Track your order anytime"]
              },
              {
                title: "Affordable Pricing",
                items: ["Competitive rates", "No hidden fees", "Volume discounts available"]
              },
              {
                title: "Great Support",
                items: ["24/7 customer service", "Expert consultation", "Quick problem resolution"]
              }
            ].map((section, idx) => (
              <div key={idx} className="p-8 bg-white rounded-2xl border border-[#e8ebf3] hover:shadow-lg transition-all duration-300">
                <h3 className="text-2xl font-bold text-[#123891] mb-6">{section.title}</h3>
                <ul className="space-y-4">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#123891]/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-[#123891]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-[#4f6596]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 px-4 bg-gradient-to-r from-[#f8f9fb] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0e121b] mb-4">Trusted by Thousands</h2>
            <p className="text-lg text-[#4f6596]">Join our growing community of satisfied customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "1000+", label: "Orders Completed" },
              { number: "98%", label: "Customer Satisfaction" },
              { number: "24/7", label: "Online Service" }
            ].map((stat, idx) => (
              <div key={idx} className="group p-8 bg-white rounded-2xl border border-[#e8ebf3] hover:border-[#123891] hover:shadow-lg transition-all duration-300 text-center">
                <p className="text-5xl font-black bg-gradient-to-r from-[#123891] to-[#4f6596] bg-clip-text text-transparent mb-3">{stat.number}</p>
                <p className="text-lg text-[#4f6596] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 px-4 bg-gradient-to-br from-[#123891] to-[#4f6596]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">Ready to Print?</h2>
          <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto">Start your order now and experience the fastest printing service in town.</p>
          <Link 
            href="/pesanan/buat" 
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#123891] rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
          >
            Create Your Order Now
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}