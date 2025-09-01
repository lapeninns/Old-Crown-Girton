import React from 'react';

type MatchProps = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startDate: string;
  venue?: string;
  competition?: string;
};

export default function MatchesSection({ matches }: { matches: MatchProps[] }) {
  return (
    <section aria-labelledby="upcoming-matches" className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 id="upcoming-matches" className="text-2xl font-display font-bold">Upcoming Matches</h2>
        <p className="text-sm text-neutral-500">Live screenings on our big screen</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {matches.map(m => (
          <article key={m.id} className="p-4 border rounded bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <strong className="block text-lg">{m.homeTeam} vs {m.awayTeam}</strong>
                <span className="block text-sm text-neutral-600">{new Date(m.startDate).toLocaleString()}</span>
                {m.venue && <span className="block text-sm text-neutral-500">Venue: {m.venue}</span>}
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 rounded">{m.competition || 'Match'}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
