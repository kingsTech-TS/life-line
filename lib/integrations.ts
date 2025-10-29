// Placeholder integration configuration for payment processors, CMS, and analytics

export const PAYMENT_INTEGRATIONS = {
  paystack: {
    name: "Paystack",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY || "pk_test_placeholder",
    baseUrl: "https://api.paystack.co",
  },
  flutterwave: {
    name: "Flutterwave",
    publicKey: process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY || "FLWPUBK_TEST_placeholder",
    baseUrl: "https://api.flutterwave.com/v3",
  },
  stripe: {
    name: "Stripe",
    publicKey: process.env.NEXT_PUBLIC_STRIPE_KEY || "pk_test_placeholder",
    baseUrl: "https://api.stripe.com/v1",
  },
}

export const CMS_INTEGRATIONS = {
  wordpress: {
    name: "WordPress",
    baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.lifeline.ng",
    apiKey: process.env.WORDPRESS_API_KEY || "placeholder_key",
  },
  webflow: {
    name: "Webflow",
    baseUrl: "https://api.webflow.com/v1",
    apiKey: process.env.WEBFLOW_API_KEY || "placeholder_key",
  },
}

export const NEWSLETTER_INTEGRATIONS = {
  mailchimp: {
    name: "Mailchimp",
    apiKey: process.env.MAILCHIMP_API_KEY || "placeholder_key",
    listId: process.env.MAILCHIMP_LIST_ID || "placeholder_list_id",
  },
  brevo: {
    name: "Brevo (Sendinblue)",
    apiKey: process.env.BREVO_API_KEY || "placeholder_key",
    listId: process.env.BREVO_LIST_ID || "placeholder_list_id",
  },
}

export const ANALYTICS_INTEGRATIONS = {
  googleAnalytics: {
    name: "Google Analytics",
    measurementId: process.env.NEXT_PUBLIC_GA_ID || "G-placeholder",
  },
  metaPixel: {
    name: "Meta Pixel",
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "placeholder_pixel_id",
  },
}
