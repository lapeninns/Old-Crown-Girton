interface BlogHeroProps {
  title: string;
  subtitle: string;
}

export default function BlogHero({ title, subtitle }: BlogHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
}