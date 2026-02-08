"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  User,
  Clock,
  Search,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "All", count: 12 },
  { name: "Health Tips", count: 4 },
  { name: "Community Stories", count: 3 },
  { name: "News & Updates", count: 3 },
  { name: "Partner Spotlights", count: 2 },
];

const featuredPost = {
  id: 1,
  title: "Transforming Healthcare Access in Rural Nigeria: Our 2024 Journey",
  excerpt:
    "Discover how LifeLine has expanded healthcare access to over 25 communities this year, bringing essential medical services to those who need it most.",
  image: "/healthcare-workers-in-nigerian-community.jpg",
  category: "News & Updates",
  author: "Dr. Amina Okonkwo",
  date: "December 5, 2024",
  readTime: "8 min read",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        const mappedPosts = data.map((post: any) => ({
          id: post._id,
          title: post.title,
          excerpt: post.excerpt,
          image: post.image,
          category: post.category,
          author: post.author,
          date: new Date(post.createdAt).toLocaleDateString(),
          readTime: "5 min read", // Placeholder or calculate
        }));
        setBlogPosts(mappedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,139,34,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              LifeLine Blog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Stories of <span className="text-primary">Hope</span> &{" "}
              <span className="text-secondary">Healing</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 text-pretty">
              Insights, updates, and inspiring stories from the frontlines of
              community healthcare in Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/blog/${featuredPost.id}`} className="group block">
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-card to-muted/30">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto min-h-[300px] overflow-hidden">
                  <img
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Featured
                  </span>
                </div>
                <div className="p-6 md:p-10 flex flex-col justify-center">
                  <span className="text-secondary font-medium text-sm mb-3">
                    {featuredPost.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300 text-balance">
                    {featuredPost.title}
                  </h2>
                  <p className="text-foreground/70 mb-6 text-pretty leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60 mb-6">
                    <span className="flex items-center gap-1.5">
                      <User size={14} />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <span className="inline-flex items-center text-primary font-semibold group-hover:gap-3 gap-2 transition-all duration-300">
                    Read Full Story{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
                size={18}
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category.name
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-background text-foreground/70 hover:bg-muted hover:text-foreground border border-border"
                  }`}
                >
                  {category.name}
                  <span
                    className={`ml-1.5 ${activeCategory === category.name ? "text-primary-foreground/70" : "text-foreground/40"}`}
                  >
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group block animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-500 border-border/50 hover:border-primary/20 bg-card">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-foreground/60 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-foreground/50">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-foreground/60 text-lg">
                No articles found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="group bg-transparent"
              >
                Load More Articles
                <ChevronRight
                  size={18}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Never Miss an Update
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Subscribe to our newsletter for the latest stories, health tips,
              and impact updates delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button
                variant="secondary"
                size="lg"
                className="whitespace-nowrap shadow-lg"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
