"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  CreditCard,
  ArrowLeft,
  Loader2,
  Package,
  Layers,
  Heart,
  Star,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  HeadphonesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import PaymentModal from "@/components/PaymentModal";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ProductDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const { addToCart: addToCartGlobal } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/shop/${slug}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);

        // Initialize variants
        const initialVariants: { [key: string]: string } = {};
        data.variants?.forEach((v: any) => {
          if (v.options?.length > 0) {
            initialVariants[v.type] = v.options[0];
          }
        });
        setSelectedVariants(initialVariants);

        // Fetch related products
        const relRes = await fetch("/api/inventory");
        const relData = await relRes.json();
        if (Array.isArray(relData)) {
          setRelatedProducts(relData.filter(p => p.category === data.category && p.slug !== data.slug).slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Product not found");
        router.push("/shop");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug, router]);

  const addToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCartGlobal(product, selectedVariants);
    }
    toast.success(`${quantity} ${product.name} added to cart`);
  };

  const handlePayNow = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0b]">
        <Loader2 className="animate-spin text-[#016AF9]" size={48} />
      </div>
    );
  }

  if (!product) return null;

  const displayImages = product.images?.length > 0 ? product.images : [product.image || "/placeholder.svg"];

  const TABS = [
    { id: "description", label: "Description" },
    { id: "specs", label: "Additional Information" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0b] flex flex-col pt-20">
      <main className="flex-1 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-12">
            <Link href="/" className="hover:text-[#016AF9] transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link href="/shop" className="hover:text-[#016AF9] transition-colors">Shop</Link>
            <ChevronRight size={10} />
            <span className="text-muted-foreground/60">{product.category}</span>
            <ChevronRight size={10} />
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-20">
            {/* Gallery Section */}
            <div className="w-full lg:w-1/2 space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-[#f8f9fb] dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 group"
              >
                <Image
                  src={displayImages[activeImageIndex]}
                  alt={product.name}
                  fill
                  className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </motion.div>

              {displayImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-start">
                  {displayImages.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`relative h-24 w-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        i === activeImageIndex
                          ? "border-[#016AF9] bg-white shadow-lg"
                          : "border-transparent opacity-60 hover:opacity-100 bg-[#f8f9fb]"
                      }`}
                    >
                      <Image
                        src={img}
                        alt="Thumbnail"
                        fill
                        className="object-cover p-2"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">
                    {product.category}
                  </p>
                  <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight tracking-tighter">
                    {product.name}
                  </h1>
                  
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed text-lg max-w-xl">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm font-bold">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                      </div>
                      <span className="text-muted-foreground">(258 Reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-4xl font-black text-[#016AF9] tracking-tighter">
                    ₦{product.price.toLocaleString()}
                  </div>
                  <div className="text-2xl font-black text-muted-foreground/40 line-through tracking-tighter">
                    ₦{(product.price * 1.4).toLocaleString()}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#016AF9] bg-blue-50 px-3 py-1 rounded-full">
                    Discount Only For This Weekend
                  </span>
                </div>

                {/* Variants */}
                <div className="space-y-8">
                  {product.variants?.map((v: any, i: number) => (
                    <div key={i} className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        Pick a {v.type}
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        {v.options.map((opt: string, j: number) => {
                          const isColor = v.type.toLowerCase().includes('color');
                          return (
                            <button
                              key={j}
                              onClick={() => setSelectedVariants(prev => ({ ...prev, [v.type]: opt }))}
                              className={`relative transition-all ${
                                isColor 
                                  ? `w-8 h-8 rounded-full border-2 p-0.5 ${selectedVariants[v.type] === opt ? "border-[#016AF9] scale-110" : "border-transparent"}`
                                  : `px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest border-2 ${selectedVariants[v.type] === opt ? "bg-[#016AF9] text-white border-[#016AF9] shadow-xl shadow-blue-500/20" : "bg-white text-muted-foreground border-zinc-100"}`
                              }`}
                              title={opt}
                            >
                              {isColor ? (
                                <span className="block w-full h-full rounded-full" style={{ backgroundColor: opt.toLowerCase() }} />
                              ) : opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                  <div className="flex items-center border-2 border-zinc-100 rounded-xl h-14 bg-white overflow-hidden shadow-sm">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-14 h-full hover:bg-zinc-50 flex items-center justify-center border-r border-zinc-100 text-zinc-400 hover:text-foreground transition-colors">
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="w-14 text-center font-black text-xl">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-14 h-full hover:bg-zinc-50 flex items-center justify-center border-l border-zinc-100 text-zinc-400 hover:text-foreground transition-colors">
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                  
                  <p className="text-xs font-bold text-muted-foreground">
                    Only <span className="text-[#016AF9]">{product.stock} Items Left</span>, Hurry up!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handlePayNow}
                    className="flex-1 h-16 rounded-xl bg-[#016AF9] text-white hover:bg-blue-700 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Buy Now
                  </Button>
                  <Button
                    onClick={addToCart}
                    variant="outline"
                    className="flex-1 h-16 rounded-xl border-2 border-[#016AF9] text-[#016AF9] hover:bg-blue-50 text-sm font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Add to Cart
                  </Button>
                </div>

                {/* Features */}
                <div className="pt-10 space-y-6 border-t border-zinc-100">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#016AF9]"><Truck size={20} strokeWidth={2.5} /></div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight">Fast delivery</h4>
                      <p className="text-xs text-muted-foreground font-medium">Fast delivery service provide on purchase</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#016AF9]"><ShieldCheck size={20} strokeWidth={2.5} /></div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight">Secure Payments</h4>
                      <p className="text-xs text-muted-foreground font-medium">Top Secure payments services available</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#016AF9]"><HeadphonesIcon size={20} strokeWidth={2.5} /></div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight">24/7 Support</h4>
                      <p className="text-xs text-muted-foreground font-medium">Our Customer support center available for help</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-32 border-t border-zinc-100 pt-12">
            <div className="flex justify-center gap-12 mb-16 overflow-x-auto pb-4 scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-4 text-lg font-black tracking-tighter transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? "text-[#016AF9]" : "text-muted-foreground/40 hover:text-muted-foreground"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-1 bg-[#016AF9] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="max-w-5xl mx-auto">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="prose prose-lg dark:prose-invert max-w-none"
                  >
                    <p className="text-muted-foreground text-lg leading-relaxed text-center">
                      {product.description}
                    </p>
                  </motion.div>
                )}

                {activeTab === "specs" && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="overflow-hidden rounded-2xl border border-zinc-100"
                  >
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#016AF9] text-white">
                          <th className="p-5 font-black text-sm uppercase tracking-widest border-r border-white/10">Specification</th>
                          <th className="p-5 font-black text-sm uppercase tracking-widest border-r border-white/10">Details</th>
                          <th className="p-5 font-black text-sm uppercase tracking-widest border-r border-white/10">More Info</th>
                          <th className="p-5 font-black text-sm uppercase tracking-widest">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-sm font-bold">
                        {(product.specifications?.length > 0 ? product.specifications : [
                          { label: "Category", value: product.category },
                          { label: "Stock Status", value: product.stock > 0 ? "In Stock" : "Out of Stock" },
                          { label: "Shipping", value: "Fast delivery" },
                          { label: "Authentication", value: "Verified Product" },
                        ]).map((row: any, i: number) => (
                          <tr key={i} className="hover:bg-zinc-50 transition-colors">
                            <td className="p-5 text-muted-foreground border-r border-zinc-100">{row.label}</td>
                            <td className="p-5 text-foreground border-r border-zinc-100 font-black">{row.value}</td>
                            <td className="p-5 text-muted-foreground border-r border-zinc-100">{row.info || "Technical data"}</td>
                            <td className="p-5 text-foreground">{row.remark || "Verified"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-10"
                  >
                    <Star size={48} className="mx-auto text-amber-400 mb-4" />
                    <h3 className="text-2xl font-black mb-2">Customer Feedback</h3>
                    <p className="text-muted-foreground">Product reviews are currently being verified by our team.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-40">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-black tracking-tighter">Related Posts</h2>
                <div className="flex gap-2">
                  <button className="h-10 w-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="h-10 w-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((rel) => (
                  <Link key={rel.slug} href={`/shop/${rel.slug}`}>
                    <div className="group rounded-3xl overflow-hidden border border-zinc-100 hover:shadow-2xl transition-all duration-500">
                      <div className="relative aspect-square bg-[#f8f9fb] flex items-center justify-center">
                        <Image src={rel.image || rel.images?.[0] || "/placeholder.svg"} alt={rel.name} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                        <span className="absolute top-4 left-4 bg-[#016AF9] text-white text-[10px] font-black uppercase px-2 py-1 rounded-md">New</span>
                      </div>
                      <div className="p-6 bg-white">
                        <h3 className="font-black text-lg mb-2 group-hover:text-[#016AF9] transition-colors">{rel.name}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-black text-[#016AF9]">₦{rel.price.toLocaleString()}</span>
                          <span className="text-sm font-bold text-muted-foreground/40 line-through">₦{(rel.price * 1.3).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Paystack Payment Modal */}
      {product && (
        <PaymentModal
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          amount={product.price * quantity}
          title={`Buy: ${product.name}`}
          subtitle={`₦${(product.price * quantity).toLocaleString()} · ${quantity} Items`}
          paymentSource="shop"
          productName={product.name}
          items={[
            {
              id: product._id,
              name: product.name,
              price: product.price,
              quantity: quantity,
              image: product.image || product.images?.[0] || "",
              variants: selectedVariants,
              vendorId: product.vendorId?._id || product.vendorId,
            }
          ]}
          deliveryAddress="To be provided by user during payment"
        />
      )}
    </div>
  );
}
