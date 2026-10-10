/**
 * A tiny stand-in for a database. Each call is one round trip and takes a few
 * milliseconds, and `queries` counts them, so tests can see how many queries a
 * report makes.
 */
export interface Order {
  id: number;
  customerId: number;
  total: number;
}

export interface Customer {
  id: number;
  name: string;
}

export class FakeDb {
  queries = 0;

  constructor(
    private orders: Order[],
    private customers: Customer[],
    private latencyMs = 2,
  ) {}

  private async roundTrip<T>(result: T): Promise<T> {
    this.queries++;
    await new Promise((r) => setTimeout(r, this.latencyMs));
    return result;
  }

  /** SELECT * FROM orders */
  getOrders(): Promise<Order[]> {
    return this.roundTrip([...this.orders]);
  }

  /** SELECT * FROM customers WHERE id = ? */
  getCustomerById(id: number): Promise<Customer | undefined> {
    return this.roundTrip(this.customers.find((c) => c.id === id));
  }

  /** SELECT * FROM customers WHERE id IN (?, ?, …) */
  getCustomersByIds(ids: number[]): Promise<Customer[]> {
    const wanted = new Set(ids);
    return this.roundTrip(this.customers.filter((c) => wanted.has(c.id)));
  }
}
