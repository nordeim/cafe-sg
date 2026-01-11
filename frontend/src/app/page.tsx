import { ButtonMerlion } from "@/components/merlion/button-merlion";
import { CardMerlion } from "@/components/merlion/card-merlion";
import { Ornament } from "@/components/merlion/ornament";
import { TextureOverlay } from "@/components/merlion/texture-overlay";
import { ZigzagItem, ZigzagSection } from "@/components/merlion/zigzag";
import { MobileNavMerlion } from "@/components/merlion/mobile-nav";
import { NewsletterForm } from "@/components/merlion/newsletter-form";
import Link from "next/link";
import Image from "next/image";

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  try {
    const res = await fetch(`${baseUrl}/api/v1/products`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
        console.warn("Backend not reachable during build, using empty data");
        return { data: [] };
    }
    
    return await res.json();
  } catch (e) {
    console.warn("Failed to fetch products during build", e);
    return { data: [
        {
            name: 'Singapore Heritage Blend',
            slug: 'singapore-heritage-blend',
            description: 'Our signature blend honoring Singapore\'s kopi culture.',
            price_cents: 2800,
        },
        {
            name: 'Peranakan Estate',
            slug: 'peranakan-estate',
            description: 'Single-origin Arabica from the highlands of Indonesia.',
            price_cents: 3200,
        }
    ] };
  }
}

function formatPrice(cents: number) {
  const dollars = (cents / 100).toFixed(2);
  return `$${dollars} SGD (Incl. 9% GST)`;
}

interface Product {
  slug: string;
  name: string;
  description: string;
  price_cents: number;
}

export default async function Home() {
  const { data: products } = await getProducts();

  const productImages: Record<string, string> = {
    'singapore-heritage-blend': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23F8F3E6'/%3E%3Cpath d='M50,200 Q100,100 200,150 T350,200' stroke='%239A5E4A' stroke-width='2' fill='none'/%3E%3Ccircle cx='150' cy='180' r='30' fill='%234A6B7D' opacity='0.2'/%3E%3Ccircle cx='250' cy='220' r='25' fill='%23C77966' opacity='0.2'/%3E%3Ctext x='200' y='220' font-family='Arial' font-size='16' text-anchor='middle' fill='%233A2A1F' opacity='0.3'%3ESingapore Heritage%3C/text%3E%3C/svg%3E",
    'peranakan-estate': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23F8F3E6'/%3E%3Cpath d='M100,100 Q200,50 300,100 T350,250' stroke='%239A5E4A' stroke-width='2' fill='none'/%3E%3Ccircle cx='200' cy='150' r='40' fill='%234A6B7D' opacity='0.1'/%3E%3Ctext x='200' y='200' font-family='Arial' font-size='16' text-anchor='middle' fill='%233A2A1F' opacity='0.3'%3EPeranakan Estate%3C/text%3E%3C/svg%3E",
    'straits-sourcing': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23F8F3E6'/%3E%3Cpath d='M50,300 Q150,250 250,300 T350,250' stroke='%239A5E4A' stroke-width='2' fill='none'/%3E%3Ccircle cx='150' cy='280' r='25' fill='%234A6B7D' opacity='0.3'/%3E%3Ccircle cx='300' cy='260' r='20' fill='%23C77966' opacity='0.3'/%3E%3Ctext x='200' y='230' font-family='Arial' font-size='16' text-anchor='middle' fill='%233A2A1F' opacity='0.3'%3EStraits Sourcing%3C/text%3E%3C/svg%3E",
  };

  const navLinks = [
    { label: "Our Beans", href: "#beans" },
    { label: "Our Story", href: "#story" },
    { label: "Tasting Room", href: "#tasting-room" },
    { label: "Events", href: "#events" },
  ];

  return (
    <>
      <TextureOverlay />
      
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-nyonya-cream/85 backdrop-blur-md border-b border-kopi-brown/10 z-50 px-4">
        <div className="max-w-[85ch] mx-auto h-full flex justify-between items-center">
          <Link href="#" className="font-heading text-2xl text-ui-terracotta flex items-center gap-2">
            <span className="font-decorative text-3xl text-gold-leaf">☕</span>
            <span className="font-600 tracking-tight">Merlion Brews</span>
          </Link>
          
          <nav className="hidden md:flex gap-8">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="font-body text-lg font-500 text-kopi-brown hover:text-ui-terracotta relative group">
                {link.label}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ui-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-medium ease-smooth" />
              </Link>
            ))}
          </nav>

          {/* <MobileNavMerlion links={navLinks} /> */}
        </div>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden pt-32 pb-24">
          <div className="max-w-[75ch] z-10 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            <h1 className="text-6xl tracking-tight mb-6 text-ui-terracotta leading-tight">
              Artisan Coffee Crafted with Peranakan Soul
            </h1>
            <div className="font-decorative text-3xl text-ui-blue mb-8">
              Singapore&apos;s Heritage in Every Cup
            </div>
            <p className="text-xl text-kopi-brown mb-12 max-w-[60ch] mx-auto">
              Since 2015, we&apos;ve been roasting single-origin beans using techniques passed down through generations, blending traditional Singaporean coffee culture with contemporary craft roasting methods.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <ButtonMerlion variant="primary" href="#beans" className="w-full md:w-auto">
                Discover Our Beans
              </ButtonMerlion>
              <ButtonMerlion variant="secondary" href="#tasting-room" className="w-full md:w-auto">
                Tasting Experience
              </ButtonMerlion>
            </div>
          </div>

          <Ornament position="tl" className="hidden md:block" />
          <Ornament position="tr" className="hidden md:block" />
          <Ornament position="bl" className="hidden md:block" />
          <Ornament position="br" className="hidden md:block" />

          <div className="absolute top-1/4 left-[15%] w-3 h-3 rounded-full bg-kopi-brown/30 animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-[40%] left-[85%] w-3 h-3 rounded-full bg-kopi-brown/30 animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-[60%] left-[25%] w-3 h-3 rounded-full bg-kopi-brown/30 animate-float" style={{ animationDelay: '1s' }} />
        </section>

                        {/* Collections */}

                        <ZigzagSection id="beans" className="py-24 px-4 max-w-[85ch] mx-auto">

                          <div className="text-center mb-12">

                            <h2 className="text-4xl font-600 text-ui-terracotta mb-4">Heritage Bean Collection</h2>

                            <div className="font-decorative text-xl text-ui-blue">Single-Origin Mastery</div>

                          </div>

                

                          {products?.map((product: Product) => (

                            <ZigzagItem

                              key={product.slug}

                              image={

                                <Image 

                                  src={productImages[product.slug] || productImages['singapore-heritage-blend']} 

                                  alt={product.name}

                                  width={400}

                                  height={400}

                                  className="w-full h-full object-cover"

                                />

                              }

                              details={

                                <>

                                  <h3 className="text-3xl font-600 text-ui-terracotta mb-4">{product.name}</h3>

                                  <p className="mb-4">{product.description}</p>

                                  <div className="font-decorative text-2xl text-ui-gold mb-6">

                                    {formatPrice(product.price_cents)}

                                  </div>

                                  <ButtonMerlion variant="secondary">Add to Cart</ButtonMerlion>

                                </>

                              }

                            />

                          ))}

                        </ZigzagSection>

                

                        {/* Story */}

                        <section id="story" className="py-24 px-4 bg-nyonya-cream">

                          <div className="max-w-[85ch] mx-auto">

                            <div className="text-center mb-12">

                              <h2 className="text-4xl font-600 text-ui-terracotta mb-4">Our Manuscript</h2>

                              <div className="font-decorative text-xl text-ui-blue">A Heritage of Craft</div>

                            </div>

                            

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                              <div className="folio-frame aspect-[3/2]">

                                <Image 

                                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23F8F3E6'/%3E%3Ccircle cx='150' cy='200' r='80' fill='%234A6B7D' opacity='0.2'/%3E%3Ccircle cx='450' cy='200' r='60' fill='%23C77966' opacity='0.2'/%3E%3Cpath d='M100,300 Q200,200 300,300 T500,300' stroke='%239A5E4A' stroke-width='3' fill='none'/%3E%3Ctext x='300' y='200' font-family='Arial' font-size='24' text-anchor='middle' fill='%233A2A1F' opacity='0.3'%3EMaster Roaster%3C/text%3E%3C/svg%3E"

                                  alt="Master Roaster"

                                  width={600}

                                  height={400}

                                  className="w-full h-full object-cover"

                                />

                              </div>

                              <div>

                                <p className="mb-4 text-lg">

                                  <span className="float-left font-decorative text-6xl leading-[0.8] text-terracotta mr-3 mt-1">I</span>

                                  n 2015, after a decade studying coffee roasting techniques across Southeast Asia and Europe, I returned to Singapore with a singular vision: to create coffee that honors both our multicultural heritage and the meticulous craftsmanship of traditional roasting methods.

                                </p>

                                <p className="text-lg">

                                  Our roastery in Tiong Bahru operates on principles drawn from Singapore&apos;s kopitiams and European roasting traditions. Every cast-iron drum roaster is hand-maintained, every batch roasted by ear and smell.

                                </p>

                              </div>

                            </div>

                          </div>

                        </section>

                

                        {/* Tasting Room */}

                        <section id="tasting-room" className="py-24 px-4">

                          <div className="max-w-[85ch] mx-auto text-center">

                             <h2 className="text-4xl font-600 text-ui-terracotta mb-4">Tasting Room</h2>

                             <div className="font-decorative text-xl text-ui-blue mb-12">Experience Our Craft</div>

                             

                             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                                <CardMerlion className="p-8 text-left">

                                  <h3 className="text-2xl font-600 text-kopi-brown mb-2">Heritage Cupping</h3>

                                  <p className="mb-4 text-sm">An immersive journey through three generations of Singaporean coffee culture.</p>

                                  <div className="font-decorative text-xl text-ui-gold mb-4">$45.00 per person</div>

                                  <ButtonMerlion variant="secondary" className="w-full">Book Experience</ButtonMerlion>

                                </CardMerlion>

                                

                                <CardMerlion className="p-8 text-left">

                                  <h3 className="text-2xl font-600 text-kopi-brown mb-2">Brewing Masterclass</h3>

                                  <p className="mb-4 text-sm">Learn the techniques behind perfect pour-over, French press, and traditional sock brewing.</p>

                                  <div className="font-decorative text-xl text-ui-gold mb-4">$65.00 per person</div>

                                  <ButtonMerlion variant="secondary" className="w-full">Book Class</ButtonMerlion>

                                </CardMerlion>

                

                                <CardMerlion className="p-8 text-left">

                                  <h3 className="text-2xl font-600 text-kopi-brown mb-2">Private Room</h3>

                                  <p className="mb-4 text-sm">Host your next gathering in our intimate tasting room. Perfect for team building.</p>

                                  <div className="font-decorative text-xl text-ui-gold mb-4">$350.00 / 8 guests</div>

                                  <ButtonMerlion variant="secondary" className="w-full">Reserve Room</ButtonMerlion>

                                </CardMerlion>

                             </div>

                          </div>

                        </section>

        {/* Newsletter */}
        <section id="newsletter" className="py-24 px-4 bg-nyonya-cream">
          <div className="max-w-[65ch] mx-auto text-center">
            <h2 className="text-4xl font-600 text-ui-terracotta mb-4">Join Our Manuscript</h2>
            <div className="font-decorative text-xl text-ui-blue mb-8">Receive Exclusive Insights</div>
            <p className="mb-8">
              Subscribe to receive quarterly manuscript pages featuring bean discoveries, roasting techniques, and invitations to our private tasting salons.
            </p>
            <NewsletterForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-kopi-brown/5 py-16 px-4 border-t border-kopi-brown/10 text-center">
        <div className="max-w-[85ch] mx-auto">
          <div className="font-decorative text-2xl text-ui-terracotta mb-2">Merlion Brews Artisan Roastery</div>
          <p className="text-sm text-kopi-brown mb-8">Heritage coffee crafted with Peranakan soul since 2015</p>
          
          <div className="w-full h-px bg-kopi-brown/10 my-8" />
          
          <p className="text-xs text-kopi-brown/60 leading-loose">
            Roastery: 48 Tiong Bahru Road, #01-12, Singapore 168893<br/>
            Business Registration: 2015123456K • GST Registration: M9-1234567-8<br/>
            © 2026 Merlion Brews Artisan Roastery Pte. Ltd. Singapore • All rights reserved<br/>
            Prices displayed in SGD with 9% GST included for Singapore customers
          </p>
        </div>
      </footer>
    </>
  );
}