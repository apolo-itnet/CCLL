"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";

interface NewsItem {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  publishedAt: string;
}

const CATEGORIES = ["All", "News", "Media", "Press Release", "Event"];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => { if (d.success) setNews(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === "All"
    ? news
    : news.filter((n) => n.category === activeCategory);

  return (
    <>
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">News & Media</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-blue-200 text-lg">Latest updates, announcements and media coverage</motion.p>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap mb-8">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                    <div className="h-5 bg-slate-200 rounded" />
                    <div className="h-4 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No news found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <motion.div key={item._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(item)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-100 hover:border-blue-100 transition-all duration-300 cursor-pointer">
                  <div className="h-48 bg-slate-100 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                        <span className="text-blue-300 text-4xl font-bold">CCLL</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
                        <Tag className="w-3 h-3" /> {item.category}
                      </span>
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.publishedAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2">{item.excerpt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* News Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {selected.image && (
              <img src={selected.image} alt={selected.title} className="w-full h-56 object-cover rounded-t-2xl" />
            )}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">{selected.category}</span>
                <span className="text-slate-400 text-xs">
                  {new Date(selected.publishedAt).toLocaleDateString("en-BD", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">{selected.title}</h2>
              {selected.excerpt && <p className="text-blue-600 text-sm mb-4 font-medium">{selected.excerpt}</p>}
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selected.content}</div>
              <button onClick={() => setSelected(null)}
                className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-medium transition-all">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}