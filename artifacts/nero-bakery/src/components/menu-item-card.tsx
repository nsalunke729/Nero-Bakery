import { MenuItem } from '@workspace/api-client-react/src/generated/api.schemas';
import { StarRating } from '@/components/star-rating';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onClick?: () => void;
  className?: string;
}

const categoryColors: Record<string, string> = {
  bread: 'bg-amber-100 text-amber-900 border-amber-200',
  pastries: 'bg-orange-100 text-orange-900 border-orange-200',
  cakes: 'bg-pink-100 text-pink-900 border-pink-200',
  coffee: 'bg-stone-600 text-stone-50 border-stone-700',
  sandwiches: 'bg-green-100 text-green-900 border-green-200',
  seasonal: 'bg-purple-100 text-purple-900 border-purple-200',
};

export function MenuItemCard({ item, onClick, className }: MenuItemCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-full text-left overflow-hidden rounded-xl border border-card-border bg-card transition-all hover:shadow-lg hover:-translate-y-0.5',
        !item.isAvailable && 'opacity-60',
        className
      )}
      data-testid={`card-menu-item-${item.id}`}
    >
      {/* Image */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-6xl font-display font-bold text-muted-foreground/20">
              {item.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-base md:text-lg leading-tight truncate">
              {item.name}
            </h3>
            {!item.isAvailable && (
              <span className="text-xs text-destructive font-medium">Unavailable</span>
            )}
          </div>
          <Badge variant="outline" className={cn('shrink-0 text-xs', categoryColors[item.category])}>
            {item.category}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground" data-testid={`price-${item.id}`}>
            €{item.price.toFixed(2)}
          </span>
          
          {item.ratingCount > 0 ? (
            <div className="flex items-center gap-1.5">
              <StarRating rating={item.averageRating} size="sm" />
              <span className="text-xs text-muted-foreground">
                ({item.ratingCount})
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">No reviews yet</span>
          )}
        </div>
      </div>
    </button>
  );
}
