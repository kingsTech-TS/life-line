"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { 
  BarChart3, 
  PieChart, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Loader2, 
  Save,
  Activity,
  Droplets,
  BookOpen,
  Heart,
  Target
} from "lucide-react";

const iconOptions = [
  { value: 'Activity', label: 'Activity/Healthcare' },
  { value: 'Droplets', label: 'Water/Droplets' },
  { value: 'BookOpen', label: 'Education/Book' },
  { value: 'ShieldCheck', label: 'Shield/Safety' },
  { value: 'Heart', label: 'Heart/Donation' },
  { value: 'Target', label: 'Target/Impact' },
];

export default function AdminFinances() {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [ethics, setEthics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/finances/stats");
      const data = await res.json();
      if (data.allocations) setAllocations(data.allocations);
      if (data.ethics) setEthics(data.ethics);
    } catch (err) {
      toast.error("Failed to fetch financial settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAllocations = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/finances/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: 'fund_allocations', value: allocations }),
      });
      if (res.ok) toast.success("Fund allocations updated!");
      else toast.error("Failed to update allocations");
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEthics = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/finances/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: 'financial_ethics', value: ethics }),
      });
      if (res.ok) toast.success("Financial ethics updated!");
      else toast.error("Failed to update ethics");
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground">Financial Transparency</h1>
        <p className="text-muted-foreground font-medium">Manage how the public views platform fund allocations and ethics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Allocations Management */}
        <Card className="p-8 rounded-[2.5rem] border border-border/50 bg-card shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <PieChart size={20} />
              </div>
              <h2 className="text-xl font-black tracking-tight">Fund Allocations</h2>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="rounded-xl font-bold border-primary/20 text-primary"
              onClick={() => setAllocations([...allocations, { category: 'New Category', percentage: 0, icon: 'Activity', color: '#016AF9' }])}
            >
              <Plus size={16} className="mr-2" /> Add Category
            </Button>
          </div>

          <div className="space-y-4 flex-1">
            {allocations.map((alloc, i) => (
              <div key={i} className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category Name</label>
                    <Input 
                      value={alloc.category}
                      onChange={(e) => {
                        const newAllocations = [...allocations];
                        newAllocations[i].category = e.target.value;
                        setAllocations(newAllocations);
                      }}
                      className="h-10 rounded-xl border-none bg-background font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Percentage (%)</label>
                    <Input 
                      type="number"
                      value={alloc.percentage}
                      onChange={(e) => {
                        const newAllocations = [...allocations];
                        newAllocations[i].percentage = Number(e.target.value);
                        setAllocations(newAllocations);
                      }}
                      className="h-10 rounded-xl border-none bg-background font-bold text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Icon & Color</label>
                    <div className="flex gap-2">
                      <select 
                        value={alloc.icon}
                        onChange={(e) => {
                          const newAllocations = [...allocations];
                          newAllocations[i].icon = e.target.value;
                          setAllocations(newAllocations);
                        }}
                        className="h-10 px-3 rounded-xl bg-background border-none text-xs font-bold outline-none flex-1"
                      >
                        {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                      <input 
                        type="color"
                        value={alloc.color}
                        onChange={(e) => {
                          const newAllocations = [...allocations];
                          newAllocations[i].color = e.target.value;
                          setAllocations(newAllocations);
                        }}
                        className="w-10 h-10 rounded-xl bg-background border-none cursor-pointer"
                      />
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => setAllocations(allocations.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <Button 
              className="w-full h-12 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20"
              onClick={handleSaveAllocations}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Save Allocations</>}
            </Button>
          </div>
        </Card>

        {/* Ethics Management */}
        <Card className="p-8 rounded-[2.5rem] border border-border/50 bg-card shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-xl font-black tracking-tight">Financial Ethics</h2>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="rounded-xl font-bold border-amber-500/20 text-amber-500"
              onClick={() => setEthics([...ethics, { title: 'New Ethics Policy', description: '', icon: 'ShieldCheck' }])}
            >
              <Plus size={16} className="mr-2" /> Add Policy
            </Button>
          </div>

          <div className="space-y-4 flex-1">
            {ethics.map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Policy Title</label>
                  <Input 
                    value={item.title}
                    onChange={(e) => {
                      const newEthics = [...ethics];
                      newEthics[i].title = e.target.value;
                      setEthics(newEthics);
                    }}
                    className="h-10 rounded-xl border-none bg-background font-bold text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
                  <textarea 
                    value={item.description}
                    onChange={(e) => {
                      const newEthics = [...ethics];
                      newEthics[i].description = e.target.value;
                      setEthics(newEthics);
                    }}
                    className="w-full p-3 min-h-[80px] rounded-xl border-none bg-background text-sm font-medium resize-none outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 max-w-[200px]">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Icon</label>
                    <select 
                      value={item.icon}
                      onChange={(e) => {
                        const newEthics = [...ethics];
                        newEthics[i].icon = e.target.value;
                        setEthics(newEthics);
                      }}
                      className="h-10 w-full px-3 rounded-xl bg-background border-none text-xs font-bold outline-none"
                    >
                      {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => setEthics(ethics.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <Button 
              className="w-full h-12 rounded-2xl bg-amber-500 text-white font-black uppercase tracking-widest shadow-lg shadow-amber-500/20"
              onClick={handleSaveEthics}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Save Ethics</>}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
