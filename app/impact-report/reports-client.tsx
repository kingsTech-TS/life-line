"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

const metrics = [
  { label: "Amount deployed this quarter", value: "₦0" },
  { label: "People supported", value: "0" },
  { label: "Active initiatives", value: "0" },
  { label: "Countries reached", value: "1" },
];

// const regionData = [
//   {
//     region: "North West Nigeria",
//     people: "1,450",
//     projects: "2",
//     image: "placeholder.svg",
//   },
//   {
//     region: "South East Nigeria",
//     people: "1,200",
//     projects: "3",
//     image: "placeholder.svg",
//   },
//   {
//     region: "Rural Communities (Multiple States)",
//     people: "2,200",
//     projects: "2",
//     image: "placeholder.svg",
//   },
// ];

export default function ReportsClient() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/impact");
        const data = await res.json();
        if (Array.isArray(data)) {
          setReports(data);
        }
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <main className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Impact Reports
          </h1>
          <p className="text-lg text-foreground/70">
            Every quarter we publish what we’ve done, where we’ve been and how
            your support turns into change. Thank you for being part of the
            journey.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 text-center bg-background/80 backdrop-blur-sm rounded-2xl">
                <div className="text-3xl font-bold text-primary mb-2">
                  {m.value}
                </div>
                <div className="text-sm text-foreground/70">{m.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Regional Snapshot
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Regional Snapshot
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {regionData.map((r, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="rounded-2xl overflow-hidden">
                  <div className="relative w-full h-48">
                    <img
                      src={r.image}
                      alt={r.region}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-xl mb-2">{r.region}</h3>
                    <p className="text-sm text-foreground/70 mb-4">
                      {r.people} people supported across {r.projects} projects
                    </p>
                    <Button
                      variant="outline"
                      className="border-primary text-primary"
                    >
                      View details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div> */}

        {/* In-Field Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            From the Field
          </h2>
          {loading ? (
            <div className="text-center py-10 text-foreground/40">
              Loading reports...
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-10 text-foreground/40">
              No reports found yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {reports.map((report, idx) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="rounded-2xl overflow-hidden h-full flex flex-col">
                    <div className="relative w-full h-64">
                      <img
                        src={report.imageUrl || "placeholder.svg"}
                        alt={report.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold mb-2">
                        {report.title}
                      </h3>
                      <p className="text-sm text-foreground/70 mb-4 flex-1 line-clamp-3">
                        {report.description}
                      </p>
                      <div className="flex gap-2 flex-wrap mb-4">
                        {report.tags?.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => setSelectedReport(report)}
                      >
                        Read full story
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Call To Action */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Want a deeper dive?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Quarterly reports will be available for download here, including
            financials, audits, and full project data.
          </p>
          <Button size="lg" className="bg-primary text-white rounded-xl px-10">
            Download the report
          </Button>
        </motion.div>
      </div>

      {selectedReport && (
        <Dialog
          open={!!selectedReport}
          onOpenChange={(open) => {
            if (!open) setSelectedReport(null);
          }}
        >
          <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-none shadow-2xl">
            <div className="flex flex-col">
              {/* Image */}
              <div className="relative w-full h-[250px] md:h-[400px]">
                <img
                  src={selectedReport.imageUrl || "placeholder.svg"}
                  alt={selectedReport.title}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl md:text-3xl font-bold">
                    {selectedReport.title}
                  </DialogTitle>
                </DialogHeader>

                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {selectedReport.description}
                </p>

                {/* Tags */}
                {selectedReport.tags?.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {selectedReport.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Button
                  className="w-full mt-4"
                  onClick={() => setSelectedReport(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
