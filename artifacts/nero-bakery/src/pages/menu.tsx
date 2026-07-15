import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useListMenuItems, useGetMenuItem, useListMenuItemRatings, useCreateMenuItemRating, getGetMenuItemQueryKey, getListMenuItemRatingsQueryKey, getListMenuItemsQueryKey } from '@workspace/api-client-react';
import { MenuCategory } from '@workspace/api-client-react/src/generated/api.schemas';
import { MenuItemCard } from '@/components/menu-item-card';
import { StarRating } from '@/components/star-rating';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const categories: { value: MenuCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'bread', label: 'Bread' },
  { value: 'pastries', label: 'Pastries' },
  { value: 'cakes', label: 'Cakes' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'sandwiches', label: 'Sandwiches' },
  { value: 'seasonal', label: 'Seasonal' },
];

export default function Menu() {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const itemIdFromUrl = urlParams.get('item');
  const categoryFromUrl = urlParams.get('category') as MenuCategory | null;

  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>(categoryFromUrl || 'all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(itemIdFromUrl);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingAuthor, setRatingAuthor] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);

  const { data: menuData, isLoading: menuLoading } = useListMenuItems(
    selectedCategory === 'all' ? undefined : { category: selectedCategory, sort: 'rating' }
  );

  const { data: selectedItem, isLoading: itemLoading } = useGetMenuItem(
    selectedItemId || '',
    { query: { enabled: !!selectedItemId, queryKey: getGetMenuItemQueryKey(selectedItemId || '') } }
  );

  const { data: ratingsData, isLoading: ratingsLoading } = useListMenuItemRatings(
    selectedItemId || '',
    { query: { enabled: !!selectedItemId, queryKey: getListMenuItemRatingsQueryKey(selectedItemId || '') } }
  );

  const createRating = useCreateMenuItemRating();

  useEffect(() => {
    if (itemIdFromUrl) {
      setSelectedItemId(itemIdFromUrl);
    }
  }, [itemIdFromUrl]);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as MenuCategory | 'all');
    const params = new URLSearchParams();
    if (category !== 'all') {
      params.set('category', category);
    }
    setLocation(`/menu${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleItemClick = (itemId: string) => {
    setSelectedItemId(itemId);
    setShowRatingForm(false);
    setRatingValue(5);
    setRatingComment('');
    setRatingAuthor('');
  };

  const handleCloseDialog = () => {
    setSelectedItemId(null);
    setShowRatingForm(false);
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    setLocation(`/menu${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleSubmitRating = async () => {
    if (!selectedItemId || ratingValue < 1) return;

    createRating.mutate(
      {
        id: selectedItemId,
        data: {
          rating: ratingValue,
          comment: ratingComment.trim() || undefined,
          authorName: ratingAuthor.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: 'Rating submitted',
            description: 'Go raibh maith agat — thank you for your feedback!',
          });
          setShowRatingForm(false);
          setRatingValue(5);
          setRatingComment('');
          setRatingAuthor('');
          queryClient.invalidateQueries({ queryKey: getListMenuItemRatingsQueryKey(selectedItemId) });
          queryClient.invalidateQueries({ queryKey: getGetMenuItemQueryKey(selectedItemId) });
          queryClient.invalidateQueries({ queryKey: getListMenuItemsQueryKey() });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to submit rating. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const menuItems = menuData || [];
  const ratings = ratingsData || [];

  return (
    <div className="min-h-screen grain py-12 md:py-16">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything baked fresh daily. Availability may vary.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-12">
          <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex w-auto min-w-full justify-start md:justify-center">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="whitespace-nowrap"
                    data-testid={`tab-category-${cat.value}`}
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>

        {/* Menu Grid */}
        {menuLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : menuItems.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-fade-in">
            {menuItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onClick={() => handleItemClick(item.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No items found in this category.</p>
          </div>
        )}
      </div>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItemId} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {itemLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="aspect-[16/9] w-full rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : selectedItem ? (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4 pr-8">
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-2xl md:text-3xl font-display mb-2 break-words">
                      {selectedItem.name}
                    </DialogTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-sm">
                        {selectedItem.category}
                      </Badge>
                      {!selectedItem.isAvailable && (
                        <Badge variant="destructive" className="text-sm">
                          Unavailable
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {selectedItem.imageUrl && (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full aspect-[16/9] object-cover rounded-lg"
                />
              )}

              <div className="space-y-6">
                <div>
                  <p className="text-muted-foreground leading-relaxed">{selectedItem.description}</p>
                </div>

                <div className="flex items-center justify-between py-4 border-y border-border">
                  <span className="text-2xl font-bold text-foreground">
                    €{selectedItem.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    <StarRating rating={selectedItem.averageRating} size="md" showNumber />
                    <span className="text-sm text-muted-foreground">
                      ({selectedItem.ratingCount} {selectedItem.ratingCount === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>

                {/* Ratings Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-semibold">Reviews</h3>
                    {!showRatingForm && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRatingForm(true)}
                        data-testid="button-add-review"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Review
                      </Button>
                    )}
                  </div>

                  {showRatingForm && (
                    <div className="space-y-4 p-4 border border-border rounded-lg mb-6 bg-muted/30">
                      <div>
                        <Label>Your Rating</Label>
                        <StarRating
                          rating={ratingValue}
                          size="lg"
                          interactive
                          onChange={setRatingValue}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating-author">Name (optional)</Label>
                        <Input
                          id="rating-author"
                          placeholder="Your name"
                          value={ratingAuthor}
                          onChange={(e) => setRatingAuthor(e.target.value)}
                          data-testid="input-rating-author"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating-comment">Comment (optional)</Label>
                        <Textarea
                          id="rating-comment"
                          placeholder="Share your thoughts..."
                          value={ratingComment}
                          onChange={(e) => setRatingComment(e.target.value)}
                          rows={3}
                          data-testid="textarea-rating-comment"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSubmitRating}
                          disabled={createRating.isPending}
                          data-testid="button-submit-rating"
                        >
                          {createRating.isPending ? 'Submitting...' : 'Submit Review'}
                        </Button>
                        <Button variant="outline" onClick={() => setShowRatingForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {ratingsLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ))}
                    </div>
                  ) : ratings.length > 0 ? (
                    <div className="space-y-4">
                      {ratings.map((rating) => (
                        <div
                          key={rating.id}
                          className="p-4 border border-border rounded-lg"
                          data-testid={`review-${rating.id}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <StarRating rating={rating.rating} size="sm" />
                              {rating.authorName && (
                                <p className="text-sm font-medium mt-1">{rating.authorName}</p>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {rating.comment && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {rating.comment}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
