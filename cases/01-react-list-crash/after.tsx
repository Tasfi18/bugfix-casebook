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

// FIX: handle every state the request can be in before touching the data.
export function OrderList({ state }: { state: OrdersState }) {
  if (state.error) return <p role="alert">Could not load orders: {state.error}</p>;
  if (!state.data) return <p>Loading orders…</p>;
  if (state.data.items.length === 0) return <p>No orders yet.</p>;

  return (
    <ul>
      {state.data.items.map((o) => (
        <li key={o.id}>
          {o.customer}: ${o.total.toFixed(2)}
        </li>
      ))}
    </ul>
  );
}
