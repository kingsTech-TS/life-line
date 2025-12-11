import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"

// Placeholder blog post data
const getPost = (id: string) => ({
  id,
  title: "Transforming Healthcare Access in Rural Nigeria: Our 2024 Journey",
  content: `
    <p>As we reflect on the past year, LifeLine has made significant strides in expanding healthcare access across Nigeria's most underserved communities. Our commitment to bringing quality medical services to those who need it most has never been stronger.</p>
    
    <h2>The Challenge We Face</h2>
    <p>Rural communities in Nigeria often lack basic healthcare infrastructure. Many residents must travel hours to reach the nearest clinic, and the cost of transportation alone can be prohibitive for low-income families. This creates a healthcare gap that disproportionately affects women, children, and the elderly.</p>
    
    <h2>Our Approach</h2>
    <p>LifeLine has adopted a community-centered approach to healthcare delivery. Rather than waiting for patients to come to us, we bring healthcare services directly to the communities. Our mobile health units, staffed by trained community health workers, visit remote villages on a regular schedule.</p>
    
    <h2>Key Achievements in 2024</h2>
    <ul>
      <li><strong>25+ Communities Reached:</strong> We expanded our reach to include 10 new communities this year alone.</li>
      <li><strong>50,000+ Lives Impacted:</strong> From preventive care to emergency services, we've touched tens of thousands of lives.</li>
      <li><strong>100+ Healthcare Workers Trained:</strong> Local capacity building ensures sustainable healthcare delivery.</li>
      <li><strong>Maternal Health Programs:</strong> Our prenatal and postnatal care initiatives have significantly reduced maternal mortality rates in target areas.</li>
    </ul>
    
    <h2>Stories of Impact</h2>
    <p>Behind every statistic is a human story. Meet Mama Adaeze, a mother of five from Enugu State, who gave birth safely at our mobile clinic after experiencing complications. Or consider the story of young Chidi, whose malaria was caught early and treated effectively, preventing what could have been a tragic outcome.</p>
    
    <h2>Looking Ahead</h2>
    <p>As we move into 2025, LifeLine is committed to scaling our impact. With your continued support, we aim to reach 50 communities by the end of next year. Together, we're not just providing healthcare – we're building a healthier Nigeria, one community at a time.</p>
  `,
  image: "/healthcare-workers-in-nigerian-community.jpg",
  category: "News & Updates",
  author: "Dr. Amina Okonkwo",
  authorRole: "Executive Director",
  authorImage: "/professional-african-woman-doctor.jpg",
  date: "December 5, 2024",
  readTime: "8 min read",
})

const relatedPosts = [
  {
    id: 2,
    title: "5 Essential Health Tips for the Harmattan Season",
    image: "/harmattan-season-health.jpg",
    category: "Health Tips",
    date: "December 2, 2024",
  },
  {
    id: 3,
    title: "Meet the Heroes: Community Health Workers Making a Difference",
    image: "/community-health-workers.png",
    category: "Community Stories",
    date: "November 28, 2024",
  },
  {
    id: 4,
    title: "NPHN Partnership: Expanding Our Reach Across States",
    image: "/healthcare-partnership.jpg",
    category: "Partner Spotlights",
    date: "November 25, 2024",
  },
]

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = getPost(id)

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
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
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />
              {post.readTime}
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
                  <img
                    src={post.authorImage || "/placeholder.svg"}
                    alt={post.author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{post.author}</p>
                    <p className="text-sm text-foreground/60">{post.authorRole}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70">
                  Dr. Okonkwo leads LifeLine's mission to transform healthcare access across Nigeria with over 15 years
                  of experience in public health.
                </p>
              </Card>

              {/* Share */}
              <Card className="p-6">
                <h3 className="font-semibold text-sm text-foreground/60 uppercase tracking-wider mb-4">
                  Share this article
                </h3>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <Facebook size={18} />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <Twitter size={18} />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <Linkedin size={18} />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <Share2 size={18} />
                  </Button>
                </div>
              </Card>

              {/* CTA */}
              <Card className="p-6 bg-primary text-primary-foreground">
                <h3 className="font-bold text-lg mb-2">Support Our Mission</h3>
                <p className="text-sm opacity-90 mb-4">
                  Help us bring quality healthcare to more communities across Nigeria.
                </p>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/donate">Donate Now</Link>
                </Button>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={relatedPost.image || "/placeholder.svg"}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-secondary font-medium">{relatedPost.category}</span>
                    <h3 className="font-semibold text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-xs text-foreground/60 mt-2">{relatedPost.date}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
