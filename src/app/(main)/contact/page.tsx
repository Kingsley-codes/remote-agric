import Hero from "@/components/contactPage/Hero";
import ContactDetails from "@/components/contactPage/ContactDetails";
import FAQSection from "@/components/contactPage/FAQSection";
import ContactForm from "@/components/contactPage/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Hero />
      <main className="max-w-7xl mx-auto px-6 lg:px-20 -mt-16 relative z-20 pb-20 grid lg:grid-cols-3 gap-8">
        <ContactForm />
        <ContactDetails />
      </main>
      <FAQSection />
    </>
  );
}