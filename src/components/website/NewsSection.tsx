"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

interface NewsItem {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => { if (d.success) setNews(d.data.slice(0, 3)); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Latest Updates</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">News & Media</h2>
            <p className="text-slate-500 mt-2">Stay updated with our latest news and announcements.</p>
          </div>
          <Link href="/news" className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all whitespace-nowrap">
            View All News <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
        ) : news.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-400">No news available yet.</p>
            <p className="text-slate-300 text-sm mt-1">Add news from the dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-blue-50 border border-slate-100 hover:border-blue-100 transition-all duration-300"
              >
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
                    <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">{item.category}</span>
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
  );
}