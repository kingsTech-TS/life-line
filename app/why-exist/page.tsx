import Link from "next/link";
import { Button } from "../../components/ui/button";

export const metadata = {
  title: "Why We Exist | LifeLine",
  description:
    "LifeLine exists to make quality healthcare accessible to all Nigerians. Learn why we do what we do and the values that guide our mission.",
};

export default function WhyExistPage() {
  return (
    <>
      <main className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why We Exist
            </h1>

            <p className="text-foreground/80 mb-4">
              LifeLine exists because healthcare is a fundamental human right, not
              a privilege. In Nigeria, millions of people lack access to basic
              healthcare services, leading to preventable deaths and suffering.
              This is not inevitable—it's a choice that can be changed through
              dedicated effort and community-centered action.
            </p>

            <p className="text-foreground/80 mb-4">
              We exist to bridge the healthcare gap. We believe that:
            </p>

            <ul className="space-y-3 mb-6">
              <li className="text-foreground/80 flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Every person deserves access to quality healthcare regardless of
                  their economic status
                </span>
              </li>
              <li className="text-foreground/80 flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Communities must be at the center of healthcare solutions
                </span>
              </li>
              <li className="text-foreground/80 flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Prevention is more powerful than cure</span>
              </li>
              <li className="text-foreground/80 flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Education empowers people to take control of their health
                </span>
              </li>
              <li className="text-foreground/80 flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Sustainable change requires partnership and collaboration
                </span>
              </li>
            </ul>

            <p className="text-foreground/80">
              We exist to transform these beliefs into action and create a
              healthier, more equitable Nigeria for all.
            </p>
          </div>
        </div>
      </main>

      {/* ✅ CTA now sits above the footer */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Whether through donations, volunteering, or partnerships, there are
            many ways to support our work.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/donate">Get Involved</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
