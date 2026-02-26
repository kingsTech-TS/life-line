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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart: addToCartGlobal, setIsCartOpen } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handlePayNow = async () => {
    if (!product) return;

    setIsProcessing(true);
    try {
      // In a real Paystack implementation, you'd call your backend to initialize
      // and then use the access_code or simply use the public key for simple cases.
      // We'll use the public key approach for demonstration as per user's "Pay Now" request.

      const config = {
        key:
          process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder",
        email: "customer@line-line.org", // Should be fetched from a form/user session
        amount: product.price * 100, // Paystack amount is in kobo
        currency: "NGN",
        ref: `LL-${Math.floor(Math.random() * 1000000000 + 1)}`,
        callback: function (response: any) {
          toast.success("Payment Successful! Ref: " + response.reference);
          setIsProcessing(false);
          // Redirect to success page or similar
        },
        onClose: function () {
          toast.info("Payment window closed");
          setIsProcessing(false);
        },
      };

      if ((window as any).PaystackPop) {
        const handler = (window as any).PaystackPop.setup(config);
        handler.openIframe();
      } else {
        toast.error("Payment gateway could not be loaded. Please refresh.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred during payment");
      setIsProcessing(false);
    }
  };

  const addToCart = () => {
    if (!product) return;
    addToCartGlobal(product, selectedVariants);
    toast.success(`${product.name} added to cart!`);
    setIsCartOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!product) return null;

  const displayImages =
    product.images?.length > 0
      ? product.images
      : [product.image || "/placeholder.svg"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-foreground/40 hover:text-primary transition-colors mb-10 group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Shop
          </button>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Gallery Section */}
            <div className="w-full lg:w-1/2 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-[3rem] overflow-hidden bg-muted shadow-2xl group border border-border"
              >
                <Image
                  src={displayImages[activeImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />

                {displayImages.length > 1 && (
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === 0 ? displayImages.length - 1 : prev - 1,
                        )
                      }
                      className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === displayImages.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                )}
              </motion.div>

              {displayImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
                  {displayImages.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`relative h-24 w-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        i === activeImageIndex
                          ? "border-primary scale-105 shadow-lg"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.25em] rounded-full mb-6 inline-block">
                    {product.category}
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 leading-tight tracking-tighter">
                    {product.name}
                  </h1>
                  <div className="text-4xl font-black text-primary">
                    ₦{product.price.toLocaleString()}
                  </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-muted/30 border border-border/50">
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-4 flex items-center gap-2">
                    <Package size={14} className="text-primary" /> Product
                    Details
                  </h3>
                  <p className="text-foreground/70 leading-relaxed text-lg">
                    {product.description}
                  </p>
                </div>

                {/* Variants */}
                {product.variants?.map((v: any, i: number) => (
                  <div key={i} className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-foreground/40">
                      Select {v.type}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {v.options.map((opt: string, j: number) => (
                        <button
                          key={j}
                          onClick={() =>
                            setSelectedVariants((prev) => ({
                              ...prev,
                              [v.type]: opt,
                            }))
                          }
                          className={`px-8 py-4 rounded-2xl text-sm font-bold transition-all ${
                            selectedVariants[v.type] === opt
                              ? "bg-primary text-white scale-105 shadow-xl shadow-primary/30 ring-4 ring-primary/20"
                              : "bg-muted text-foreground/60 hover:bg-muted/80 border border-border/50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-8 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={addToCart}
                      disabled={product.stock === 0}
                      className="flex-1 h-20 rounded-[1.5rem] bg-muted text-foreground hover:bg-muted/80 border-2 border-border/80 text-lg font-black transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3"
                    >
                      <ShoppingCart size={22} /> Add to Cart
                    </Button>
                    <Button
                      onClick={handlePayNow}
                      disabled={product.stock === 0 || isProcessing}
                      className="flex-1 h-20 rounded-[1.5rem] bg-primary text-white hover:bg-primary/90 text-lg font-black transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/20 flex items-center gap-3"
                    >
                      {isProcessing ? (
                        <Loader2 className="animate-spin" size={22} />
                      ) : (
                        <CreditCard size={22} />
                      )}
                      Pay Now
                    </Button>
                  </div>

                  {product.stock < 10 && product.stock > 0 && (
                    <p className="text-center text-amber-500 text-sm font-bold flex items-center justify-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      Hurry! Only {product.stock} items left in stock
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border/50">
                  <div className="flex items-center gap-4 group">
                    <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Heart size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight">
                        Charity Impact
                      </h4>
                      <p className="text-xs text-foreground/40 font-medium mt-0.5">
                        Proceeds fund health projects
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                      <Layers size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight">
                        Verified Quality
                      </h4>
                      <p className="text-xs text-foreground/40 font-medium mt-0.5">
                        Ethically sourced products
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
