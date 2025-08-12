"use client";
import React, { useMemo, useState } from "react";
import type { Menu } from "@/src/lib/data/schemas";
import { Leaf, Shield } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800"
            />
            <div className="flex items-center gap-4">
              <button
                onClick={() => setGfOnly((v) => !v)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  gfOnly
                    ? "bg-green-100 text-green-800 border-2 border-green-300"
                    : "bg-gray-100 text-gray-600 border-2 border-gray-200"
                }`}
              >
                <Shield className="w-4 h-4" /> Gluten Free Only
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-20 z-30 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
            {menu.sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all text-sm ${
                  active === s.id
                    ? "bg-amber-500 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-amber-100"
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            {activeSection?.name}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded"></div>
        </div>

        <div className="grid gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-amber-100 hover:border-amber-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
                      {item.name}
                      {item.dietary.glutenFree && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Shield className="w-3 h-3" /> GF
                        </span>
                      )}
                      {item.dietary.vegetarian && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Leaf className="w-3 h-3" /> Veg
                        </span>
                      )}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    <span className="text-xl font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                      £{item.price.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
