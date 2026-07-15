import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center grain">
      <div className="container px-4 md:px-8 text-center">
        <h1 className="font-display text-8xl md:text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like this page got eaten. Head back home to find what you're looking for.
        </p>
        <Button asChild size="lg" data-testid="button-back-home">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
