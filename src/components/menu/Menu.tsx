"use client";
import React, { useMemo, useState } from "react";
import type { Menu } from "@/src/lib/data/schemas";
import { Leaf, Shield, Star, Crown, Award } from "lucide-react";

export type MenuProps = {
  menu: Menu;
};

export default function MenuComponent({ menu }: MenuProps) {
  const [active, setActive] = useState(menu.sections[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [gfOnly, setGfOnly] = useState(false);

  const activeSection = useMemo(
    () => menu.sections.find((s) => s.id === active) ?? menu.sections[0],
    [menu.sections, active]
  );

  const filtered = useMemo(() => {
    const items = activeSection?.items ?? [];
    return items.filter((it) => {
      const matches =
        it.name.toLowerCase().includes(search.toLowerCase()) ||
        (it.description || "").toLowerCase().includes(search.toLowerCase());
      const gf = !gfOnly || it.dietary.glutenFree === true;
      return matches && gf;
    });
  }, [activeSection, gfOnly, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-marigold-50">
      <div className="sticky top-0 z-40 bg-neutral-50 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-brand-800"
            />
            <div className="flex items-center gap-4">
              <button
                onClick={() => setGfOnly((v) => !v)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  gfOnly
                    ? "bg-cardamom-100 text-cardamom-800 border-2 border-cardamom-300"
                    : "bg-neutral-100 text-brand-600 border-2 border-neutral-200"
                }`}
              >
                <Shield className="w-4 h-4" /> Gluten Free Only
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-20 z-30 bg-neutral-50 border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
            {menu.sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all text-sm ${
                  active === s.id
                    ? "bg-accent-500 text-white shadow-lg transform scale-105"
                    : "bg-neutral-100 text-brand-600 hover:bg-accent-100"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-brand-800 mb-2 flex items-center gap-2">
            {activeSection?.name}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-accent-500 to-marigold-500 rounded"></div>
        </div>

        <div className="grid gap-6">
          {filtered.map((item) => {
            // Check if this is the Mixed Platter - our featured signature item
            const isMixedPlatter = item.name.toLowerCase().includes('mixed platter');
            
            return (
              <article
                key={item.id}
                className={`relative overflow-hidden rounded-xl transition-all duration-500 transform ${
                  isMixedPlatter
                    ? 'bg-gradient-to-br from-accent-50 via-neutral-50 to-marigold-50 border-2 border-accent-400 shadow-xl hover:shadow-2xl scale-105 ring-4 ring-accent-200/50 hover:-translate-y-3'
                    : 'bg-neutral-50 shadow-md hover:shadow-lg border border-accent-100 hover:border-accent-300 hover:-translate-y-1'
                }`}
                role={isMixedPlatter ? 'banner' : 'listitem'}
                aria-label={isMixedPlatter ? 'Featured signature dish: Mixed Platter - Chef\'s Special' : `Menu item: ${item.name}`}
                tabIndex={isMixedPlatter ? 0 : undefined}
              >
                {/* Signature Badge for Mixed Platter */}
                {isMixedPlatter && (
                  <div className="absolute -top-3 -right-3 z-20">
                    <div className="bg-gradient-to-br from-crimson-600 to-crimson-700 text-white px-4 py-2 rounded-full shadow-xl transform rotate-12 border-2 border-white">
                      <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide">
                        <Crown className="w-4 h-4 text-marigold-300" />
                        <span>SIGNATURE</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Premium Corner Accent for Mixed Platter */}
                {isMixedPlatter && (
                  <div className="absolute top-0 left-0 w-0 h-0 border-l-[60px] border-l-accent-500 border-b-[60px] border-b-transparent opacity-90">
                    <Star className="absolute -top-10 -left-12 w-5 h-5 text-white fill-current" />
                  </div>
                )}

                <div className={`p-6 ${isMixedPlatter ? 'pt-10 px-8' : ''}`}>
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <h3 className={`font-semibold flex items-start gap-3 flex-1 min-w-0 ${
                          isMixedPlatter 
                            ? 'text-2xl font-display text-brand-900 font-bold tracking-tight'
                            : 'text-lg text-brand-800'
                        }`}>
                          {isMixedPlatter && (
                            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-accent-500 to-marigold-600 rounded-full">
                              <Award className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <span className={`break-words hyphens-auto flex-1 min-w-0 ${isMixedPlatter ? 'text-brand-900' : 'text-brand-800'}`} lang="en">
                            {item.name}
                          </span>
                          {item.dietary.glutenFree && (
                            <span className="bg-cardamom-100 text-cardamom-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-cardamom-200">
                              <Shield className="w-3 h-3" /> GF
                            </span>
                          )}
                          {item.dietary.vegetarian && (
                            <span className="bg-indiagreen-100 text-indiagreen-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-indiagreen-200">
                              <Leaf className="w-3 h-3" /> V
                            </span>
                          )}
                        </h3>
                      </div>
                      
                      {/* Enhanced description for Mixed Platter */}
                      {item.description && (
                        <div className={isMixedPlatter ? 'mb-5' : 'mb-2'}>
                          <p className={`leading-relaxed ${
                            isMixedPlatter 
                              ? 'text-lg text-brand-800 font-medium mb-4'
                              : 'text-sm text-brand-600'
                          }`}>
                            {item.description}
                          </p>
                          
                          {/* Detailed component breakdown for Mixed Platter */}
                          {isMixedPlatter && (
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-brand-700 mb-3 flex items-center gap-2">
                                <Star className="w-4 h-4 text-accent-600 fill-current" />
                                What's Included:
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                  { name: 'Onion Bhaji', desc: 'Crispy & Golden' },
                                  { name: 'Chicken Tikka', desc: 'Tender & Spiced' },
                                  { name: 'Seekh Kebab', desc: 'Grilled & Juicy' }
                                ].map((component, idx) => (
                                  <div key={idx} className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center border border-accent-300 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-sm font-bold text-brand-800 mb-1">{component.name}</div>
                                    <div className="text-xs text-brand-600 font-medium">{component.desc}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Value proposition callout for Mixed Platter */}
                      {isMixedPlatter && (
                        <div className="bg-gradient-to-r from-accent-100 to-marigold-100 border border-accent-300 rounded-lg p-4 mb-4 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center mt-0.5">
                              <Star className="w-3 h-3 text-white fill-current" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-accent-900 mb-1">Perfect for Sharing</p>
                              <p className="text-xs text-accent-800 leading-relaxed">An ideal starter for 2-3 people or a complete light meal featuring our three most popular appetizers</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0 lg:ml-8">
                      <div className={`text-center ${
                        isMixedPlatter ? 'transform scale-110' : ''
                      }`}>
                        <div className={`font-bold rounded-xl shadow-lg ${
                          isMixedPlatter
                            ? 'text-2xl text-white bg-gradient-to-br from-accent-600 via-accent-500 to-marigold-500 px-5 py-4 border-2 border-white'
                            : 'text-xl text-accent-600 bg-accent-50 px-3 py-2 border border-accent-200'
                        }`}>
                          £{item.price.amount.toFixed(2)}
                        </div>
                        {isMixedPlatter && (
                          <div className="text-xs text-brand-700 mt-2 font-bold bg-marigold-100 px-2 py-1 rounded-full border border-marigold-200">
                            EXCEPTIONAL VALUE
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Chef recommendation footer for Mixed Platter */}
                  {isMixedPlatter && (
                    <div className="mt-6 pt-4 border-t-2 border-accent-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-crimson-500 to-crimson-600 rounded-full flex items-center justify-center">
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-brand-800">Chef's Recommendation</p>
                            <p className="text-xs text-brand-600">Our most ordered starter combination</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs font-bold text-accent-800 bg-accent-200 px-3 py-1.5 rounded-full border border-accent-300">
                            <Star className="w-3 h-3 fill-current text-accent-700" />
                            <span>MOST POPULAR</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-brand-600 mb-2">No items found</h3>
            <p className="text-neutral-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
