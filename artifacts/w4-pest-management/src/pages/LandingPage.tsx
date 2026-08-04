import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Phone, CheckCircle2, Clock, MapPin, 
  Search, Bug, MousePointer2, AlertTriangle, 
  FileText, Home, ArrowRight, Menu, X, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FaFacebook, FaGoogle, FaInstagram } from 'react-icons/fa';

// @ts-ignore
import heroImg from '../assets/hero.jpg';
// @ts-ignore
import aboutImg from '../assets/about.jpg';

function formatUSPhone(value: string, isDeleting = false): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length < 3) return `(${digits}`;
  if (digits.length === 3) return isDeleting ? `(${digits}` : `(${digits}) `;
  if (digits.length < 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length === 6) {
    return isDeleting
      ? `(${digits.slice(0, 3)}) ${digits.slice(3)}`
      : `(${digits.slice(0, 3)}) ${digits.slice(3)}-`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Enter a valid 10-digit US phone number"),
  email: z
    .string()
    .email("Valid email is required")
    .optional()
    .or(z.literal("")),
  service: z.string().min(1, "Please select a service"),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      service: "",
      message: "",
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitError(null);
    try {
      const response = await fetch(
        "https://n8n-stripe.localpackmonster.com/webhook-test/form-submission",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result: { success: "true" | "false" } = await response.json();

      if (result.success !== "true") {
        throw new Error("Failed to send message");
      }

      toast({
        title: "Request Received!",
        description: "We'll contact you shortly to schedule your inspection.",
        variant: "default",
      });
      form.reset();
    } catch {
      setSubmitError("Something went wrong. Please try again or call us.");
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <span className={`font-heading font-bold text-xl tracking-tight ${isScrolled ? 'text-foreground' : 'text-white'}`}>
              W4 Pest Management
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {['Home', 'Services', 'Maintenance Plans', 'About', 'Reviews', 'FAQ', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-sm font-medium hover:text-accent transition-colors ${
                  isScrolled ? 'text-foreground' : 'text-white/90 hover:text-white'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:2489300138" className={`flex items-center gap-2 font-semibold ${isScrolled ? 'text-primary' : 'text-white'}`}>
              <Phone className="w-4 h-4" />
              (248) 930-0138
            </a>
            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg">
              <a href="#contact">Free Inspection</a>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-foreground' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-foreground' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-border/50 py-4 px-4 flex flex-col gap-4">
            {['Home', 'Services', 'Maintenance Plans', 'About', 'Reviews', 'FAQ', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-foreground font-medium py-2 border-b border-border/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <a href="tel:2489300138" className="flex items-center gap-2 font-bold text-primary py-2">
              <Phone className="w-5 h-5" />
              (248) 930-0138
            </a>
            <Button className="w-full bg-primary" onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('contact')?.scrollIntoView();
            }}>
              Free Inspection
            </Button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Pest control technician inspecting property" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              Professional Pest Control That Gives You <span className="text-accent">Peace of Mind</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Protect your home or business from unwanted pests with reliable inspections, effective treatments, and affordable maintenance plans from W4 Pest Management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold text-lg h-14 px-8" asChild>
                <a href="#contact">Request Free Inspection</a>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold text-lg h-14 px-8" asChild>
                <a href="tel:2489300138">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (248) 930-0138
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm md:text-base font-medium">
              {[
                'Licensed Professionals', 
                'Fast Response', 
                'Honest Pricing', 
                'Maintenance Plans Available', 
                'Residential & Commercial'
              ].map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about-preview" className="py-24 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">Why Homeowners Trust W4 Pest Management</h2>
            <div className="w-20 h-1 bg-accent mx-auto mb-6 rounded-full"></div>
            <p className="text-muted-foreground text-lg">
              We're the knowledgeable neighbor who shows up when you have a problem. No high-pressure sales, just honest solutions.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: Clock, title: "Fast Response", desc: "Same-day and prompt scheduling whenever possible" },
              { icon: Search, title: "Thorough Inspections", desc: "We identify the source of the problem—not just the symptoms" },
              { icon: Bug, title: "Effective Treatments", desc: "Professional products and proven methods that deliver lasting results" },
              { icon: ShieldCheck, title: "Honest Recommendations", desc: "Only the services you actually need" },
              { icon: FileText, title: "Maintenance Plans", desc: "Year-round protection with convenient recurring service options" },
              { icon: Star, title: "Customer Satisfaction", desc: "Friendly service backed by professionalism and reliability" }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-card p-8 rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">Our Pest Control Services</h2>
            <div className="w-20 h-1 bg-primary mb-6 rounded-full"></div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Targeted solutions for your specific pest problems. We use the right approach for the right pest.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { title: "General Pest Inspection", desc: "Comprehensive inspections to identify current pest issues and potential entry points" },
              { title: "Ant Extermination", desc: "Effective treatment for carpenter ants, flying ants, and common household ants" },
              { title: "Spider Extermination", desc: "Reduce spider populations inside and around your home" },
              { title: "Rodent Extermination", desc: "Professional solutions for mice and rats, including identifying entry points and prevention strategies" },
              { title: "Hornet & Wasp Removal", desc: "Safe removal of dangerous nests around your property" },
              { title: "Bee Removal", desc: "Professional assessment and safe removal solutions" },
              { title: "Termite Inspection", desc: "Early detection to protect your home from costly structural damage" },
              { title: "Termite Treatment", desc: "Targeted termite control solutions to eliminate active infestations" },
              { title: "General Bug Control", desc: "Treatment for common household insects including roaches, silverfish, earwigs, centipedes, and more" }
            ].map((service, i) => (
              <motion.div key={i} variants={fadeInUp} className="group p-6 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all">
                <h3 className="text-lg font-heading font-bold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Maintenance Plans */}
      <section id="maintenance-plans" className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Year-Round Pest Protection</h2>
              <p className="text-lg md:text-xl text-white/80 mb-12 leading-relaxed">
                Our maintenance plans help prevent infestations before they become costly problems. 
                Keep your home secure 365 days a year.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 text-left"
            >
              {[
                "Quarterly service", "Seasonal treatments", "Priority scheduling", "Warranty-backed service",
                "Preventative inspections", "Convenient recurring payments", "Less stress", "Long-term savings"
              ].map((benefit, i) => (
                <motion.div key={i} variants={fadeInUp} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="font-medium text-white/90">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold h-14 px-10 text-lg shadow-xl" asChild>
                <a href="#contact">Ask About Maintenance Plans</a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl transform translate-x-4 translate-y-4"></div>
                <img 
                  src={aboutImg} 
                  alt="Friendly W4 Pest Management Technician" 
                  className="relative rounded-2xl z-10 w-full h-[500px] object-cover shadow-lg bg-muted"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">Local Pest Control You Can Trust</h2>
              <div className="w-20 h-1 bg-primary mb-8 rounded-full"></div>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  W4 Pest Management proudly serves homeowners and businesses throughout Troy and the surrounding communities with dependable pest control solutions focused on quality, honesty, and customer satisfaction.
                </p>
                <p>
                  Whether you're dealing with ants, spiders, rodents, termites, wasps, or other unwanted pests, our experienced technicians take the time to identify the source of the problem and develop the right treatment plan for your property. 
                </p>
                <p>
                  We believe great pest control starts with honest communication, professional service, and treating every customer like family. We don't just spray and leave; we educate you on how to keep pests out for good.
                </p>
              </div>
              
              <div className="mt-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xl text-foreground">Fully Licensed & Insured</h4>
                    <p className="text-muted-foreground">Professional protection for your property</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">Our Proven Process</h2>
            <div className="w-20 h-1 bg-accent mx-auto mb-6 rounded-full"></div>
            <p className="text-muted-foreground text-lg">We take a systematic approach to eliminate pests and keep them from coming back.</p>
          </motion.div>

          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
              {[
                { step: "01", title: "Schedule Your Inspection", desc: "Contact us to book a convenient time." },
                { step: "02", title: "Professional Evaluation", desc: "Thorough property assessment." },
                { step: "03", title: "Customized Plan", desc: "Tailored solutions for your home." },
                { step: "04", title: "Professional Treatment", desc: "Safe, effective application." },
                { step: "05", title: "Ongoing Protection", desc: "Maintenance to prevent return." }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-card p-6 rounded-xl shadow-sm border border-border text-center relative"
                >
                  <div className="w-12 h-12 mx-auto bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg border-4 border-card">
                    {item.step}
                  </div>
                  <h3 className="font-heading font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">What Our Customers Are Saying</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1,2,3,4,5].map(star => <Star key={star} className="w-6 h-6 fill-accent text-accent" />)}
            </div>
            <p className="font-bold text-xl text-foreground">4.9★ across 200+ reviews</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { text: "Our pest treatment worked even better than expected. The issue was completely resolved and our home feels comfortable again.", author: "Sarah M.", location: "Troy MI" },
              { text: "Jay is always kind, professional, and incredibly thorough. His pricing is fair and the quality of work is outstanding.", author: "Michael R.", location: "Rochester Hills" },
              { text: "I called several companies that never showed up. W4 came the very same day, arrived exactly when promised, and solved the problem.", author: "Jennifer T.", location: "Birmingham" },
              { text: "Jay performed a same-day inspection and honestly confirmed we didn't have bed bugs. His honesty and professionalism were refreshing.", author: "David K.", location: "Bloomfield Hills" },
              { text: "They eliminated our carpenter ant problem quickly and explained the entire treatment process.", author: "Lisa H.", location: "Royal Oak" },
              { text: "Jay patiently explained our mouse problem, showed us the entry points, and educated us on preventing future issues.", author: "Robert W.", location: "Sterling Heights" }
            ].map((review, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-muted p-8 rounded-xl relative">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-accent text-accent" />)}
                </div>
                <p className="text-foreground italic mb-6">"{review.text}"</p>
                <div>
                  <p className="font-bold font-heading">{review.author}</p>
                  <p className="text-sm text-muted-foreground">{review.location}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-24 bg-secondary text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Proudly Serving Troy & Surrounding Communities</h2>
              <div className="w-20 h-1 bg-accent mb-8 rounded-full"></div>
              <p className="text-white/80 text-lg mb-8">
                As a locally owned and operated business, we respond quickly to homes and businesses throughout Metro Detroit.
              </p>
              
              <div className="flex flex-wrap gap-3">
                {[
                  "Troy", "Rochester Hills", "Royal Oak", "Clawson", 
                  "Birmingham", "Bloomfield Hills", "Sterling Heights", 
                  "Madison Heights", "Auburn Hills", "Metro Detroit"
                ].map(city => (
                  <div key={city} className="flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="font-medium text-sm">{city}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="w-full lg:w-1/2 h-[400px] rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47102.43!2d-83.1499!3d42.6064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8824c3a7e1e5e591%3A0x9d1d7f3a84c2f1c!2sTroy%2C%20MI!5e0!3m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="W4 Pest Management Service Area"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">Frequently Asked Questions</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                { q: "How often should pest control treatments be performed?", a: "For most homes, quarterly treatments provide excellent year-round protection. However, frequency may vary depending on the severity of the infestation and the specific pests involved." },
                { q: "Do you offer recurring maintenance plans?", a: "Yes! Our maintenance plans provide quarterly service, seasonal treatments, and priority scheduling to keep your home protected year-round at an affordable recurring rate." },
                { q: "Are your treatments safe for children and pets?", a: "Absolutely. We use professional-grade products applied by licensed technicians. We'll advise you on any precautions to take during and after treatment to ensure the safety of your family and pets." },
                { q: "How long does a treatment take?", a: "Most residential treatments take 30–90 minutes depending on the size of the property and the type of pest being treated." },
                { q: "What pests do you treat?", a: "We treat ants, spiders, rodents, termites, hornets, wasps, bees, roaches, silverfish, earwigs, centipedes, and many other common household pests." },
                { q: "Do you provide termite inspections?", a: "Yes, we offer thorough termite inspections to detect early signs of infestation before they cause costly structural damage." },
                { q: "How quickly can you schedule service?", a: "We offer same-day and next-day scheduling whenever possible. Call us at (248) 930-0138 and we'll get you on the schedule right away." },
                { q: "Do you offer warranties?", a: "Yes, our services are backed by a warranty. If pests return between scheduled treatments, we'll come back at no additional charge." }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border px-6 rounded-lg">
                  <AccordionTrigger className="text-left font-bold py-5 hover:text-primary transition-colors text-lg">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Pest control" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/90"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Protect Your Home from Unwanted Pests</h2>
            <p className="text-xl text-white/90 mb-10">
              Schedule your professional inspection today and enjoy lasting peace of mind with W4 Pest Management.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold text-lg h-14 px-8" asChild>
                <a href="#contact">Request Free Inspection</a>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold text-lg h-14 px-8" asChild>
                <a href="tel:2489300138">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (248) 930-0138
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="w-full lg:w-5/12"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">Get in Touch</h2>
              <div className="w-16 h-1 bg-primary mb-8 rounded-full"></div>
              
              <div className="space-y-8 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Office Location</h4>
                    <p className="text-muted-foreground">W4 Pest Management<br/>3334 Rochester Rd #225<br/>Troy, MI 48083</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Phone</h4>
                    <p className="text-muted-foreground">
                      <a href="tel:2489300138" className="hover:text-primary transition-colors font-medium text-lg">
                        (248) 930-0138
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Call for same-day service availability</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="w-full">
                    <h4 className="font-bold text-lg mb-2">Business Hours</h4>
                    <table className="w-full text-muted-foreground text-sm">
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-2">Mon – Fri</td>
                          <td className="py-2 text-right font-medium text-foreground">8:00 AM – 7:00 PM</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-2">Saturday</td>
                          <td className="py-2 text-right font-medium text-foreground">9:00 AM – 2:00 PM</td>
                        </tr>
                        <tr>
                          <td className="py-2">Sunday</td>
                          <td className="py-2 text-right font-medium text-foreground">Closed</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="w-full lg:w-7/12"
            >
              <div className="bg-card p-8 md:p-10 rounded-2xl shadow-lg border border-border">
                <h3 className="text-2xl font-heading font-bold mb-6">Request a Quote or Inspection</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(248) 555-0123"
                                type="tel"
                                inputMode="tel"
                                className="h-12"
                                {...field}
                                onChange={(e) => {
                                  const next = e.target.value;
                                  const isDeleting = next.length < field.value.length;
                                  field.onChange(formatUSPhone(next, isDeleting));
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Needed *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="general">General Pest Inspection</SelectItem>
                                <SelectItem value="ants">Ant Extermination</SelectItem>
                                <SelectItem value="spiders">Spider Extermination</SelectItem>
                                <SelectItem value="rodents">Rodent Extermination</SelectItem>
                                <SelectItem value="wasps">Hornet & Wasp Removal</SelectItem>
                                <SelectItem value="bees">Bee Removal</SelectItem>
                                <SelectItem value="termites_insp">Termite Inspection</SelectItem>
                                <SelectItem value="termites_treat">Termite Treatment</SelectItem>
                                <SelectItem value="other">Other / Not Sure</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message / Additional Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about the pest issue you're experiencing, your property address, and any other details you think are relevant." 
                              className="min-h-[120px] resize-y" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {submitError && (
                      <p className="text-red-500 text-sm">{submitError}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Request Inspection"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white/80 pt-16 pb-8 border-t-[6px] border-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            
            <div className="space-y-4 lg:col-span-1">
              <div className="flex items-center gap-2 text-white mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <span className="font-heading font-bold text-2xl tracking-tight">
                  W4 Pest<br/>Management
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                Professional Pest Control Solutions for Homes & Businesses in Metro Detroit.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white">
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white">
                  <FaGoogle className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white">
                  <FaInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-4 font-heading">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#maintenance-plans" className="hover:text-primary transition-colors">Maintenance Plans</a></li>
                <li><a href="#reviews" className="hover:text-primary transition-colors">Customer Reviews</a></li>
                <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-4 font-heading">Core Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="hover:text-primary transition-colors">Ant Extermination</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Rodent Control</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Spider Extermination</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Hornet & Wasp Removal</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Termite Treatment</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">General Bug Control</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-4 font-heading">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <span>3334 Rochester Rd #225<br/>Troy, MI 48083</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href="tel:2489300138" className="hover:text-white transition-colors text-base font-medium">(248) 930-0138</a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0" />
                  <span>Mon-Fri: 8AM - 7PM<br/>Sat: 9AM - 2PM<br/>Sun: Closed</span>
                </li>
              </ul>
            </div>
            
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; {new Date().getFullYear()} W4 Pest Management. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Call Button for Mobile */}
      <a 
        href="tel:2489300138" 
        className="fixed bottom-6 right-6 z-50 bg-accent text-white rounded-full py-4 px-6 shadow-2xl flex items-center gap-2 font-bold hover:bg-accent/90 transition-transform hover:scale-105 active:scale-95 animate-bounce-short"
        style={{ animation: 'bounce 2s infinite' }}
      >
        <Phone className="w-5 h-5" />
        <span className="hidden md:inline">Call Now: </span>(248) 930-0138
      </a>
      
      {/* Basic animation style for floating button */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-short {
          animation: bounce-short 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}