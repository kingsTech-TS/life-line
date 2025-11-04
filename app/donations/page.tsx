import DonationsClient from "./donations-client";




export const metadata = {
  title: "Donate | LifeLine",
  description:
    "Support LifeLine’s mission to make healthcare accessible for everyone in Nigeria. Your donation saves lives and builds healthier communities.",
};

export default function DonationsPage() {
  return <DonationsClient />;
}
