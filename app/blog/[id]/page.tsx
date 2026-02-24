import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

async function getPost(id: string) {
  // Use absolute URL for server-side fetching in Next.js if needed,
  // but usually a relative URL works if the API is in the same app.
  // However, for server components, it's better to call the logic directly or use a full URL.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/posts/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function getRelatedPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/posts`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.slice(0, 3);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  const relatedPosts = await getRelatedPosts();

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link href="/blog" className="text-primary hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative pb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
          <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-4xl text-balance">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
            <span className="flex items-center gap-2">
              <User size={16} />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />5 min read
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            {/* Article */}
            <article className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-li:text-foreground/80">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Author Card */}
              <Card className="p-6">
                <h3 className="font-semibold text-sm text-foreground/60 uppercase tracking-wider mb-4">
                  About the Author
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={32} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground uppercase tracking-tight">
                      {post.author}
                    </p>
                    <p className="text-sm text-foreground/60 italic">
                      Verified Contributor
                    </p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70">
                  Sharing stories of impact and transformation within our
                  communities. Every word brings us closer to a healthier
                  Nigeria.
                </p>
              </Card>

              {/* Share */}
              <Card className="p-6 border-none shadow-xl bg-muted/20">
                <h3 className="font-bold text-xs uppercase tracking-widest text-foreground/40 mb-4">
                  Share Impact
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl bg-background hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Facebook size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl bg-background hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Twitter size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl bg-background hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Linkedin size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl bg-background hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Share2 size={18} />
                  </Button>
                </div>
              </Card>

              {/* CTA */}
              <Card className="p-8 bg-primary text-primary-foreground rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Share2 size={80} />
                </div>
                <h3 className="font-black text-2xl mb-2 relative z-10">
                  Support Our Mission
                </h3>
                <p className="text-sm opacity-90 mb-6 relative z-10 font-medium">
                  Help us bring quality healthcare to more communities across
                  Nigeria.
                </p>
                <Button
                  variant="secondary"
                  className="w-full h-12 rounded-xl font-bold relative z-10"
                  asChild
                >
                  <Link href="/donate">Donate Now</Link>
                </Button>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8 underline decoration-primary decoration-4 underline-offset-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost: any) => (
                <Link
                  key={relatedPost._id}
                  href={`/blog/${relatedPost._id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-none bg-background rounded-3xl">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-6">
                      <span className="text-xs text-primary font-black uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md">
                        {relatedPost.category}
                      </span>
                      <h3 className="font-bold text-foreground mt-3 group-hover:text-primary transition-colors line-clamp-2 text-lg">
                        {relatedPost.title}
                      </h3>
                      <p className="text-xs text-foreground/40 mt-3 font-semibold">
                        {new Date(relatedPost.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
