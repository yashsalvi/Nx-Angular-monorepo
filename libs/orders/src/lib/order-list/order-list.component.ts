import { Component } from '@angular/core';
import { SharedUiComponent } from '@angular-monorepo/shared-ui';
import { CommonModule } from '@angular/common';
import { Order } from '../order';

@Component({
    selector: 'angular-monorepo-order-list',
    imports: [CommonModule, SharedUiComponent,],
    templateUrl: './order-list.component.html',
    styleUrl: './order-list.component.css'
})
export class OrderListComponent {
   orders:Order[] = [];
  filteredOrders:Order[] = [];
  listFilter = '';
  showImage = true;
  errorMessage = '';

  ngOnInit() {
this.orders= [
  {
    orderId: 'ORD001',
    customerName: 'Alice Smith',
    orderDate: '2025-06-01',
    price: 250.75,

    imageUrl: 'https://i.pravatar.cc/150?img=3'
  },
  {
    orderId: 'ORD002',
    customerName: 'Bob Johnson',
    orderDate: '2025-06-02',
    price: 180.00,
    imageUrl: 'https://i.pravatar.cc/150?img=7'
  },
  {
    orderId: 'ORD003',
    customerName: 'Charlie Brown',
    orderDate: '2025-06-03',
    price: 320.50,
    imageUrl: 'https://i.pravatar.cc/150?img=10'
  }
];

    this.filteredOrders = this.orders;
  }

  toggleImage() {
    this.showImage = !this.showImage;
  }

  filterOrders() {
    const filter = this.listFilter.toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      order.customerName.toLowerCase().includes(filter) ||
      order.orderId.toLowerCase().includes(filter)
    );
  }

  sortBy(field: 'date' | 'amount') {
    if (field === 'date') {
      this.filteredOrders.sort((a, b) => a.orderDate > b.orderDate ? 1 : -1);
    } else {
      this.filteredOrders.sort((a, b) => a.price - b.price);
    }
  }
}
