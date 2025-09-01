'use client';

import Image from 'next/image';
import { useHomeContent } from '../_content/useHomeContent';

export default function AboutSection() {
  const content = useHomeContent();
  
  if (!content) {
    return (
      <section className="bg-white py-16" id="about-heading" aria-labelledby="about-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-6 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }
  
  const { aboutSection } = content;
  
  return (
    <section className="bg-white py-16" id="about-heading" aria-labelledby="about-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-stout-700 mb-6">
              {aboutSection.title.split(aboutSection.titleAccent)[0]}
              <span className="text-accent-600">{aboutSection.titleAccent}</span>
              {aboutSection.title.split(aboutSection.titleAccent)[1]}
            </h2>
            
            <div className="prose prose-lg text-brand-700 space-y-4">
              {aboutSection.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Awards Section */}
            <div className="mt-8 p-6 bg-brand-100 rounded-lg border border-brand-200">
              <h3 className="text-xl font-display font-bold text-stout-700 mb-4">
                {aboutSection.features.title}
              </h3>
              <ul className="list-disc pl-5 text-sm text-brand-700 space-y-2">
                {aboutSection.features.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={aboutSection.images.main}
                alt={aboutSection.images.alt}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
