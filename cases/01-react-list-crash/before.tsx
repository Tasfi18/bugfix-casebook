export interface Order {
  id: string;
  customer: string;
  total: number;
}

export interface OrdersState {
  /** Undefined while the request is still loading. */
  data?: { items: Order[] };
  error?: string;
}

// BUG: assumes `data` is always there. On the first render the request has not
// finished, `data` is undefined, and React crashes the whole page.
export function OrderList({ state }: { state: OrdersState }) {
  return (
    <ul>
      {state.data!.items.map((o) => (
        <li key={o.id}>
          {o.customer}: ${o.total.toFixed(2)}
        </li>
      ))}
    </ul>
  );
}
