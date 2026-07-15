import { Link } from 'wouter';
import { useListMenuItems } from '@workspace/api-client-react';
import { MenuItemCard } from '@/components/menu-item-card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data: menuItems, isLoading } = useListMenuItems({ sort: 'rating' });
  const featured = menuItems?.slice(0, 3) || [];

  return (
    <div className="min-h-screen grain">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container px-4 md:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6 md:space-y-8">
              <p className="text-xs sm:text-sm font-semibold text-primary/70 tracking-[0.2em] uppercase">
                Fáilte — Welcome
              </p>
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  <Star className="h-4 w-4 shrink-0" />
                  <span>Sandyford's Favourite Since 2019</span>
                </span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Fresh bread,
                <br />
                baked with
                <br />
                <span className="text-primary">intention</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Sourdough that takes three days. Croissants laminated by hand. 
                Cakes that make moments unforgettable. Everything made here, nothing rushed.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-base" data-testid="button-browse-menu">
                  <Link href="/menu">
                    Browse Menu
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base" data-testid="button-order-catering">
                  <Link href="/catering">
                    <Calendar className="mr-2 h-5 w-5" />
                    Order Catering
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[600px]">
              <img
                src="/hero-sourdough.jpg"
                alt="Artisan sourdough bread"
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="container px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Customer Favorites
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The items our community can't get enough of
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade-in">
              {featured.map((item) => (
                <Link key={item.id} href={`/menu?item=${item.id}`}>
                  <MenuItemCard item={item} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No menu items available yet.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" data-testid="button-see-full-menu">
              <Link href="/menu">
                See Full Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8 stagger-fade-in">
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <img
                src="/pastries-hero.jpg"
                alt="Laminated pastries"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-display text-2xl font-bold mb-2">Pastries</h3>
                <p className="text-sm text-white/90 mb-4">Butter, flour, time. Laminated by hand every morning.</p>
                <Button asChild variant="secondary" size="sm">
                  <Link href="/menu?category=pastries">Explore</Link>
                </Button>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <img
                src="/bread-basket.jpg"
                alt="Fresh sourdough"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-display text-2xl font-bold mb-2">Sourdough</h3>
                <p className="text-sm text-white/90 mb-4">Three-day fermentation. No shortcuts. Just flour, water, salt, time.</p>
                <Button asChild variant="secondary" size="sm">
                  <Link href="/menu?category=bread">Explore</Link>
                </Button>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <img
                src="/celebration-cake.jpg"
                alt="Celebration cakes"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-display text-2xl font-bold mb-2">Celebration Cakes</h3>
                <p className="text-sm text-white/90 mb-4">Custom cakes for birthdays, weddings, and moments worth remembering.</p>
                <Button asChild variant="secondary" size="sm">
                  <Link href="/menu?category=cakes">Explore</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Teaser */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">
              Baked fresh, every day
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We start before sunrise. The oven is lit by 4am. By the time you walk in, 
              the first loaves are out, still crackling as they cool. This is what a bakery should be.
            </p>
            <Button asChild variant="outline" size="lg" data-testid="button-our-story">
              <Link href="/about">
                Our Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Catering CTA */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 to-accent text-primary-foreground p-8 md:p-12 lg:p-16">
            <div className="relative z-10 max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Catering for your next event
              </h2>
              <p className="text-lg mb-6 text-primary-foreground/90">
                From corporate meetings to wedding receptions, we bring the warmth of 
                our bakery to your gathering. Custom orders welcome.
              </p>
              <Button asChild size="lg" variant="secondary" data-testid="button-request-catering">
                <Link href="/catering">
                  <Calendar className="mr-2 h-5 w-5" />
                  Request Catering
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
