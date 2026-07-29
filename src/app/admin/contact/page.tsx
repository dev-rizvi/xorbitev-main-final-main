"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone, Loader2, CheckCircle, Clock, Check } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  focus: string | null;
  requirements: string | null;
  status: string;
  createdAt: string;
}

export default function ContactLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (Array.isArray(data)) {
        setLeads(data);
      } else {
        console.error("API error:", data);
        setLeads([]);
      }
    } catch (error) {
      console.error(error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      fetchLeads(); // refresh the list
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Inquiries...</p>
        </div>
      </div>
    );
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.phone && lead.phone.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="p-8 md:p-12 bg-slate-50 min-h-screen overflow-y-auto">
      <div className="w-full space-y-12">
        
        <div>
          <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight flex items-center gap-4">
            <Mail className="w-10 h-10 text-primary" />
            Contact <span className="italic text-primary">Inquiries</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2">Manage technical inquiries and business leads from the global portal.</p>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] mb-2">Inquiry Logbook</h3>
              <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredLeads.length} Matches</span>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search name, email, phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl text-xs font-semibold text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
              />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="new">New Inquiries</option>
                <option value="contacted">Contacted</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-6 pl-10 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Contact Details</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Application Focus</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest max-w-[300px]">Requirements</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="p-6 pr-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 font-medium text-sm">
                      {leads.length === 0 ? "No inquiries received yet." : "No matches found for your filter."}
                    </td>
                  </tr>
                ) : filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-6 pl-10">
                      <div className="font-black text-secondary text-sm uppercase tracking-tight mb-2">{lead.name}</div>
                      <div className="text-xs text-slate-500 flex flex-col gap-1.5 font-medium">
                        {lead.email && <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400"/> {lead.email}</span>}
                        {lead.phone && <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400"/> {lead.phone}</span>}
                      </div>
                    </td>
                    <td className="p-6 text-sm font-bold text-slate-600">
                      {lead.focus}
                    </td>
                    <td className="p-6 text-xs text-slate-500 max-w-[300px]">
                      {lead.requirements ? (
                        <div className="line-clamp-3 leading-relaxed" title={lead.requirements}>
                          {lead.requirements}
                        </div>
                      ) : (
                        <span className="opacity-50 italic">None provided</span>
                      )}
                    </td>
                    <td className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6 pr-10 text-right">
                      {lead.status === 'new' ? (
                        <button 
                          onClick={() => updateStatus(lead.id, 'contacted')}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-100 transition-colors"
                        >
                          <Clock className="w-3.5 h-3.5" /> Mark Contacted
                        </button>
                      ) : lead.status === 'contacted' ? (
                        <button 
                          onClick={() => updateStatus(lead.id, 'resolved')}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark Resolved
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                          <CheckCircle className="w-3.5 h-3.5" /> Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
