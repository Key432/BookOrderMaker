import Order from './Order';
import { useState, useRef } from 'react';

type OrderItem = { id: number };

export default function Orders({ className }: { className?: string }) {
  const nextId = useRef(1);
  const [orders, setOrders] = useState<OrderItem[]>([{ id: nextId.current++ }]);

  function handleAddOrder() {
    setOrders((prev) => [...prev, { id: nextId.current++ }]);
  }

  // 削除ボタンで押された id の要素のみを削除する
  function handleRemoveOrder(id: number) {
    setOrders((prev) => (prev.length <= 1 ? prev : prev.filter((o) => o.id !== id)));
  }

  return (
    <div className={className}>
      {orders.map((order, index) => (
        <div key={order.id}>
          <Order className="mt-2" index={index} />
          <div className="mt-1 text-right print:hidden">
            <button
              className="mr-2 rounded-md border-2 bg-gray-100 pl-4 pr-4"
              onClick={handleAddOrder}
            >
              +
            </button>
            <button
              className="rounded-md border-2 bg-gray-100 pl-4 pr-4"
              onClick={() => handleRemoveOrder(order.id)}
            >
              -
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

