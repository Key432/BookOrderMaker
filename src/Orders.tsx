import Order from './Order';

export type BookOrder = {
  id: number;
  publisher: string;
  author: string;
  title: string;
  price: number;
  isbn: string;
};

export default function Orders({
  className,
  orders,
  onChange,
  nextOrderId,
}: {
  className?: string;
  orders: BookOrder[];
  onChange: (orders: BookOrder[]) => void;
  nextOrderId: number;
}) {
  function handleAddOrder() {
    onChange([
      ...orders,
      { id: nextOrderId, publisher: '', author: '', title: '', price: 0, isbn: '' },
    ]);
  }

  function handleRemoveOrder(id: number) {
    onChange(orders.length <= 1 ? orders : orders.filter((order) => order.id !== id));
  }

  function handleUpdateOrder(id: number, nextOrder: BookOrder) {
    onChange(orders.map((order) => (order.id === id ? nextOrder : order)));
  }

  return (
    <div className={className}>
      {orders.map((order, index) => (
        <div key={order.id}>
          <Order
            className="mt-2"
            index={index}
            order={order}
            onChange={(nextOrder) => handleUpdateOrder(order.id, nextOrder)}
          />
          <div className="mt-1 text-right print:hidden">
            <button
              className="mr-2 rounded-md border-2 bg-gray-100 pl-4 pr-4"
              onClick={handleAddOrder}
              type="button"
            >
              +
            </button>
            <button
              className="rounded-md border-2 bg-gray-100 pl-4 pr-4"
              onClick={() => handleRemoveOrder(order.id)}
              type="button"
            >
              -
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
