'use client';
import Image from 'next/image';
import { useHomeContent } from '../_content/useHomeContent';
import {
  accentTextClassName,
  cardRecipe,
  featureListClassName,
  sectionInnerClassName,
  sectionProseClassName,
  sectionShellClassName,
  sectionTitleRecipe,
} from '@/src/design-system';

export default function AboutSection() {
  const content = useHomeContent();
  
  if (!content) {
    // No loading animation or skeleton on home
    return null;
  }
  
  const { aboutSection } = content;
  
  return (
    <section className={`bg-white ${sectionShellClassName}`} id="about-heading" aria-labelledby="about-heading">
      <div className={sectionInnerClassName}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            <h2 className={sectionTitleRecipe('mb-6')}>
              {aboutSection.title.split(aboutSection.titleAccent)[0]}
              <span className={accentTextClassName}>{aboutSection.titleAccent}</span>
              {aboutSection.title.split(aboutSection.titleAccent)[1]}
            </h2>
            
            <div className={`${sectionProseClassName} space-y-4`}>
              {aboutSection.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Awards Section */}
            <div className={cardRecipe({ tone: 'muted', className: 'mt-8 p-6' })}>
              <h3 className={sectionTitleRecipe('mb-4 text-2xl md:text-2xl')}>
                {aboutSection.features.title}
              </h3>
              <ul className={featureListClassName}>
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
