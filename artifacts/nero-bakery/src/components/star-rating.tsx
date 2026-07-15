import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= Math.round(rating);
          
          return interactive ? (
            <button
              key={i}
              type="button"
              onClick={() => handleClick(starValue)}
              className={cn('transition-all hover:scale-110 cursor-pointer')}
              data-testid={`star-${starValue}`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled
                    ? 'fill-primary text-primary'
                    : 'fill-none text-muted-foreground/30'
                )}
                strokeWidth={1.5}
              />
            </button>
          ) : (
            <span
              key={i}
              className="cursor-default"
              data-testid={`star-${starValue}`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled
                    ? 'fill-primary text-primary'
                    : 'fill-none text-muted-foreground/30'
                )}
                strokeWidth={1.5}
              />
            </span>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
