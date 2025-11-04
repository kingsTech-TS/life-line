"use client";

import { motion } from "framer-motion";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";


const metrics = [
  { label: "Amount deployed this quarter", value: "₦15,200,000" },
  { label: "People supported", value: "4,850" },
  { label: "Active initiatives", value: "7" },
  { label: "Countries reached", value: "3" },
];

const regionData = [
  {
    region: "North West Nigeria",
    people: "1,450",
    projects: "2",
    image: "placeholder.svg",
  },
  {
    region: "South East Nigeria",
    people: "1,200",
    projects: "3",
    image: "placeholder.svg",
  },
  {
    region: "Rural Communities (Multiple States)",
    people: "2,200",
    projects: "2",
    image: "placeholder.svg",
  },
];

export default function ReportsClient() {
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
            Q3 2025 Impact Report
          </h1>
          <p className="text-lg text-foreground/70">
            Every quarter we publish what we’ve done, where we’ve been and how your support turns into change. Thank you for being part of the journey.
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
                <div className="text-3xl font-bold text-primary mb-2">{m.value}</div>
                <div className="text-sm text-foreground/70">{m.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Regional Snapshot */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Regional Snapshot</h2>
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
                    <Button variant="outline" className="border-primary text-primary">
                      View details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* In-Field Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">From the Field</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="rounded-2xl overflow-hidden">
                <div className="relative w-full h-64">
                  <img
                    src="placeholder.svg"
                    alt="Field story"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Free Primary Healthcare in Rural Nigeria
                  </h3>
                  <p className="text-sm text-foreground/70 mb-4">
                    Our mobile clinic treated over 890 patients this quarter and
                    laid groundwork for two permanent community health facilities.
                  </p>
                  <Button variant="secondary">
                    Read full story
                  </Button>
                </div>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="rounded-2xl overflow-hidden">
                <div className="relative w-full h-64">
                  <img
                    src="placeholder.svg"
                    alt="Field story"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Clean Water Access in Remote Communities
                  </h3>
                  <p className="text-sm text-foreground/70 mb-4">
                    We installed 3 new boreholes and trained 45 community water-agents this quarter.
                  </p>
                  <Button variant="secondary">
                    Read full story
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
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
            Download our full Q3 2025 Report (PDF) including financials, audits and full project data.
          </p>
          <Button size="lg" className="bg-primary text-white rounded-xl px-10">
            Download the report
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
