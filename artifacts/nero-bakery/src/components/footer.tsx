import { Link } from 'wouter';
import { ShoppingBag } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity mb-4">
              <ShoppingBag className="h-6 w-6 text-primary" strokeWidth={2.5} />
              <span className="font-display text-xl font-bold">Nero Bakery</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Crafting sourdough, laminated pastries, and celebration cakes for Sandyford, Dublin since 2019. 
              Every loaf tells a story.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-3">Visit</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/menu" className="hover:text-foreground transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/catering" className="hover:text-foreground transition-colors">
                  Catering
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-3">Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Wed–Fri: 7am–5pm</li>
              <li>Sat–Sun: 8am–4pm</li>
              <li>Mon–Tue: Closed</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center md:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Nero Bakery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
