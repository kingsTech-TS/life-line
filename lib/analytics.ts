// Analytics tracking utilities

export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  // Google Analytics tracking
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", eventName, eventData)
  }

  // Meta Pixel tracking
  if (typeof window !== "undefined" && (window as any).fbq) {
    ;(window as any).fbq("track", eventName, eventData)
  }

  console.log("[Analytics]", eventName, eventData)
}

export const trackDonation = (amount: number, type: "one-time" | "recurring") => {
  trackEvent("donation", {
    value: amount,
    currency: "NGN",
    type,
  })
}

export const trackPurchase = (items: any[], total: number) => {
  trackEvent("purchase", {
    value: total,
    currency: "NGN",
    items,
  })
}

export const trackPageView = (pageName: string) => {
  trackEvent("page_view", {
    page_title: pageName,
  })
}
