import { useState } from 'react';
import { useListMenuItems, useCreateCateringOrder, useGetCateringOrder, getGetCateringOrderQueryKey } from '@workspace/api-client-react';
import { OrderType } from '@workspace/api-client-react/src/generated/api.schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Plus, X, Search, CheckCircle2 } from 'lucide-react';
import { MenuItemCard } from '@/components/menu-item-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface OrderItem {
  menuItemId: string;
  itemName: string;
  quantity: number;
  price: number;
}

export default function Catering() {
  const { toast } = useToast();
  const { data: menuData } = useListMenuItems();
  
  const [orderType, setOrderType] = useState<OrderType>('catering');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [showMenuDialog, setShowMenuDialog] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  
  const [lookupId, setLookupId] = useState('');
  const [lookupQuery, setLookupQuery] = useState('');
  
  const createOrder = useCreateCateringOrder();
  const { data: lookedUpOrder } = useGetCateringOrder(
    lookupQuery,
    { query: { enabled: !!lookupQuery, queryKey: getGetCateringOrderQueryKey(lookupQuery) } }
  );

  const menuItems = menuData || [];

  const handleAddItem = (itemId: string, itemName: string, price: number) => {
    const existing = selectedItems.find((i) => i.menuItemId === itemId);
    if (existing) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.menuItemId === itemId ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { menuItemId: itemId, itemName, quantity: 1, price }]);
    }
    toast({
      title: 'Item added',
      description: `${itemName} added to your order`,
    });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(selectedItems.filter((i) => i.menuItemId !== itemId));
    } else {
      setSelectedItems(
        selectedItems.map((i) => (i.menuItemId === itemId ? { ...i, quantity } : i))
      );
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.menuItemId !== itemId));
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      toast({
        title: 'No items selected',
        description: 'Please add at least one menu item to your order.',
        variant: 'destructive',
      });
      return;
    }

    createOrder.mutate(
      {
        data: {
          customerName,
          email,
          phone: phone || undefined,
          orderType,
          eventDate,
          guestCount: guestCount ? Number(guestCount) : undefined,
          items: selectedItems.map(({ menuItemId, itemName, quantity }) => ({
            menuItemId,
            itemName,
            quantity,
          })),
          notes: notes || undefined,
        },
      },
      {
        onSuccess: (order) => {
          setSubmittedOrderId(order.id);
          toast({
            title: 'Order submitted!',
            description: `Your confirmation ID is ${order.id}`,
          });
          // Reset form
          setCustomerName('');
          setEmail('');
          setPhone('');
          setEventDate('');
          setGuestCount('');
          setNotes('');
          setSelectedItems([]);
          setOrderType('catering');
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to submit order. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleLookup = () => {
    if (lookupId.trim()) {
      setLookupQuery(lookupId.trim());
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-900 border-yellow-200',
    confirmed: 'bg-green-100 text-green-900 border-green-200',
    completed: 'bg-blue-100 text-blue-900 border-blue-200',
    cancelled: 'bg-red-100 text-red-900 border-red-200',
  };

  return (
    <div className="min-h-screen grain py-12 md:py-16">
      <div className="container px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Catering & Bulk Orders
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Perfect for events, meetings, or celebrations. We'll work with you to create the right spread.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-8">
            {submittedOrderId && (
              <Card className="border-primary bg-primary/5">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <CardTitle className="text-xl">Sláinte! Order Submitted Successfully!</CardTitle>
                      <CardDescription className="mt-2">
                        Your confirmation ID is:{' '}
                        <span className="font-mono font-bold text-foreground break-all">{submittedOrderId}</span>
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">
                        We'll contact you within 24 hours to confirm details. Save this ID to check your order status below.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-display">New Order</CardTitle>
                <CardDescription>Fill out the details below to request catering or bulk items</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="order-type">Order Type</Label>
                      <Select value={orderType} onValueChange={(v) => setOrderType(v as OrderType)}>
                        <SelectTrigger id="order-type" data-testid="select-order-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="catering">Catering (full service for events)</SelectItem>
                          <SelectItem value="bulk">Bulk (large quantity pickup)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer-name">Your Name *</Label>
                        <Input
                          id="customer-name"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Full name"
                          data-testid="input-customer-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          data-testid="input-email"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(555) 123-4567"
                          data-testid="input-phone"
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-date">Event Date *</Label>
                        <Input
                          id="event-date"
                          type="date"
                          required
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          data-testid="input-event-date"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="guest-count">Guest Count (optional)</Label>
                      <Input
                        id="guest-count"
                        type="number"
                        min="1"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        placeholder="Approximate number of guests"
                        data-testid="input-guest-count"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Special Requests or Dietary Notes</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any allergies, preferences, or special requests..."
                        rows={4}
                        data-testid="textarea-notes"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base">Selected Items</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMenuDialog(true)}
                        data-testid="button-add-items"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Items
                      </Button>
                    </div>

                    {selectedItems.length === 0 ? (
                      <div className="text-center py-8 border border-dashed border-border rounded-lg">
                        <p className="text-muted-foreground">No items added yet</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowMenuDialog(true)}
                          className="mt-2"
                        >
                          Browse Menu
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedItems.map((item) => (
                          <div
                            key={item.menuItemId}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border border-border rounded-lg"
                            data-testid={`order-item-${item.menuItemId}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium break-words">{item.itemName}</p>
                              <p className="text-sm text-muted-foreground">
                                €{item.price.toFixed(2)} each
                              </p>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleUpdateQuantity(item.menuItemId, item.quantity - 1)}
                                  data-testid={`button-decrease-${item.menuItemId}`}
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleUpdateQuantity(item.menuItemId, item.quantity + 1)}
                                  data-testid={`button-increase-${item.menuItemId}`}
                                >
                                  +
                                </Button>
                              </div>
                              <span className="w-16 sm:w-20 text-right font-bold shrink-0">
                                €{(item.price * item.quantity).toFixed(2)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={() => handleRemoveItem(item.menuItemId)}
                                data-testid={`button-remove-${item.menuItemId}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="font-display text-lg font-bold">Estimated Total</span>
                          <span className="font-display text-2xl font-bold text-primary">
                            €{totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={createOrder.isPending || selectedItems.length === 0}
                    data-testid="button-submit-order"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    {createOrder.isPending ? 'Submitting...' : 'Submit Order Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Lookup Sidebar */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-display">Check Order Status</CardTitle>
                <CardDescription>Enter your confirmation ID to view order details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Order ID"
                    value={lookupId}
                    onChange={(e) => setLookupId(e.target.value)}
                    data-testid="input-lookup-id"
                  />
                  <Button onClick={handleLookup} data-testid="button-lookup-order">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {lookedUpOrder && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Status</span>
                        <Badge variant="outline" className={statusColors[lookedUpOrder.status]}>
                          {lookedUpOrder.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{lookedUpOrder.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Event Date:</span>
                          <span className="font-medium">
                            {new Date(lookedUpOrder.eventDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium capitalize">{lookedUpOrder.orderType}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Items:</p>
                      <ul className="space-y-1">
                        {lookedUpOrder.items.map((item, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex justify-between">
                            <span>{item.itemName}</span>
                            <span>×{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-display">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Orders require at least 48 hours notice. For same-week requests, call us directly.
                </p>
                <p className="font-medium text-foreground">
                  +353 1 555 0199
                </p>
                <p>Available Wed-Sun during business hours</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Menu Selection Dialog */}
      <Dialog open={showMenuDialog} onOpenChange={setShowMenuDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Add Menu Items</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {menuItems
              .filter((item) => item.isAvailable)
              .map((item) => (
                <div key={item.id} className="relative">
                  <MenuItemCard item={item} onClick={() => handleAddItem(item.id, item.name, item.price)} />
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
