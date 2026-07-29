"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Users, Battery, Settings, LogOut, 
  Plus, Edit2, Trash2, Search, Eye, Filter,
  Activity, Database, Loader2, AlertCircle, Zap
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BatteryDetail {
  id: string;
  sn: string;
  name: string;
  category: string;
  nominalVoltage: string;
  nominalCapacity: string;
  status: string;
  image: string;
  showOnWebsite?: boolean;
}

export default function BatteriesListPage() {
  const [batteries, setBatteries] = useState<BatteryDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [origin, setOrigin] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  const fetchBatteries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/batteries");
      const data = await res.json();
      setBatteries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setOrigin(window.location.origin);
    fetchBatteries();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this model?")) {
      try {
        await fetch(`/api/batteries/${id}`, { method: "DELETE" });
        fetchBatteries();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const categories = ["All", ...new Set(batteries.map(b => b.category).filter(Boolean))];

  const filteredBatteries = batteries.filter(b => {
    const matchesSearch = b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.sn?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || b.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredBatteries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBatteries = filteredBatteries.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory]);

  return (
    <main className="p-8 md:p-12">
      <div className="w-full space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
              Battery <span className="italic text-primary">Models</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Manage battery model specifications & configurations</p>
          </div>
          
          <Link 
            href="/admin/batteries/add"
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" /> Add New Model
          </Link>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Search model name or part number..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex items-center gap-4">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Showing {paginatedBatteries.length} of {filteredBatteries.length} Models
                </p>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${showFilters ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                  <Filter className="w-4 h-4" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 border-t border-slate-50 flex flex-wrap gap-3">
                    {categories.map((cat: string) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterCategory === cat ? 'bg-secondary text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">#</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Info</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Specs</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Website Visibility</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Models...</p>
                    </td>
                  </tr>
                ) : paginatedBatteries.map((battery, index) => (
                    <tr key={battery.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6 text-center">
                        <span className="text-xs font-black text-slate-300">{startIndex + index + 1}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          {battery.image ? (
                            <img 
                              src={battery.image} 
                              alt={battery.name} 
                              className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-300">
                              <Battery className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <p className="font-black text-secondary text-sm tracking-tight">{battery.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                              {battery.category?.replace(/^APPLICATION\s+/i, '') || "Standard Component"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/50 border border-slate-100 text-[10px] font-black text-secondary uppercase tracking-tight">
                            <Zap className="w-3 h-3 text-amber-500" />
                            {battery.nominalVoltage || "N/A"}
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/50 border border-slate-100 text-[10px] font-black text-secondary uppercase tracking-tight">
                            <Battery className="w-3 h-3 text-primary" />
                            {battery.nominalCapacity || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <button
                          onClick={async () => {
                            try {
                              const newShow = battery.showOnWebsite !== false ? false : true;
                              // Update state immediately for optimal UX (optimistic update)
                              setBatteries(prev => prev.map(b => b.id === battery.id ? { ...b, showOnWebsite: newShow } : b));
                              
                              const res = await fetch(`/api/batteries/${battery.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ showOnWebsite: newShow })
                              });
                              if (!res.ok) throw new Error('Update failed');
                            } catch (err) {
                              console.error(err);
                              // Revert state if failed
                              fetchBatteries();
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                            battery.showOnWebsite !== false
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                              : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${battery.showOnWebsite !== false ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                          {battery.showOnWebsite !== false ? 'Shown' : 'Hidden'}
                        </button>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/batteries/view/${battery.id}`} className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-primary transition-all">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/batteries/edit/${battery.id}`} className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-primary transition-all">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(battery.id)} className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-red-500 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-8 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary disabled:opacity-50 transition-all"
                >
                  Previous
                </button>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary disabled:opacity-50 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


    </main>
  );
}
