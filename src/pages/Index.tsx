import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import GenerateForm from "@/components/GenerateForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <GenerateForm />
      <Footer />
    </div>
  );
};

export default Index;
