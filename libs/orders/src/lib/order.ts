export interface Order {
  orderId: string;
  customerName: string;
  code: string;
  orderDate: Date | string;
  price: number;
  imageUrl?: string;
  status?: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}