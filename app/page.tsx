import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Equipment from "@/components/Equipment";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Equipment />
        <About />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
