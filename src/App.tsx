import { useEffect, useMemo, useState } from 'react';
import Orderer, { type OrdererInfo } from './Orderer';
import Orders, { type BookOrder } from './Orders';
import './App.css';

const DB_NAME = 'book-order-maker';
const STORE_NAME = 'order-sheet';
const RECORD_KEY = 'current-order-sheet';

type PersistedOrderSheet = {
  orderer: OrdererInfo;
  orders: BookOrder[];
};

const defaultOrderer: OrdererInfo = {
  name: '清水 貴心',
  phoneNumber: '080-8698-0432',
};

const createEmptyOrder = (id: number): BookOrder => ({
  id,
  publisher: '',
  author: '',
  title: '',
  price: 0,
  isbn: '',
});

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function App() {
  const [orderer, setOrderer] = useState<OrdererInfo>(defaultOrderer);
  const [orders, setOrders] = useState<BookOrder[]>([createEmptyOrder(1)]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadSavedData = async () => {
      try {
        const db = await openDatabase();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(RECORD_KEY);

        request.onsuccess = () => {
          if (!isMounted) return;

          const savedData = request.result as PersistedOrderSheet | undefined;
          if (savedData) {
            setOrderer(savedData.orderer ?? defaultOrderer);
            setOrders(
              savedData.orders && savedData.orders.length > 0
                ? savedData.orders
                : [createEmptyOrder(1)],
            );
            setMessage('保存済みの注文票を読み込みました。');
          }
          setIsLoaded(true);
          db.close();
        };

        request.onerror = () => {
          if (!isMounted) return;
          setMessage('保存済みデータの読み込みに失敗しました。');
          setIsLoaded(true);
          db.close();
        };
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setMessage('IndexedDB の初期化に失敗しました。');
          setIsLoaded(true);
        }
      }
    };

    void loadSavedData();

    return () => {
      isMounted = false;
    };
  }, []);

  const nextOrderId = useMemo(
    () => orders.reduce((maxId, order) => Math.max(maxId, order.id), 0) + 1,
    [orders],
  );

  const handleSave = async () => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      await new Promise<void>((resolve, reject) => {
        const request = store.put({ orderer, orders }, RECORD_KEY);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      });

      db.close();
      setMessage('注文票を保存しました。');
    } catch (error) {
      console.error(error);
      setMessage('注文票の保存に失敗しました。');
    }
  };

  const handleReset = async () => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(RECORD_KEY);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      });

      db.close();
      setOrderer(defaultOrderer);
      setOrders([createEmptyOrder(1)]);
      setMessage('保存済みデータを削除しました。');
    } catch (error) {
      console.error(error);
      setMessage('保存済みデータの削除に失敗しました。');
    }
  };

  return (
    <div className="flex min-h-screen w-full justify-center text-center print:h-auto print:p-0">
      <div className="w-3/4 py-4 font-serif print:w-full print:p-2">
        <div className="mb-4 flex items-start justify-between gap-4 print:hidden">
          <div className="min-h-6 text-left text-sm text-green-700">{isLoaded ? message : '読み込み中...'}</div>
          <div className="flex gap-2">
            <button
              className="rounded-md border border-gray-400 bg-gray-100 px-4 py-2 hover:bg-gray-200"
              onClick={() => void handleSave()}
              type="button"
            >
              保存
            </button>
            <button
              className="rounded-md border border-gray-400 bg-gray-100 px-4 py-2 hover:bg-gray-200"
              onClick={() => void handleReset()}
              type="button"
            >
              リセット
            </button>
          </div>
        </div>
        <h1 className="pb-4 text-[32px] print:pb-2 print:pt-0 print:text-2xl">書籍注文票</h1>
        <Orderer
          className="mb-4 ml-12 mr-12 text-left print:mb-2 print:ml-0 print:mr-0"
          orderer={orderer}
          onChange={setOrderer}
        />
        <Orders
          className="pl-12 pr-12 print:pl-0 print:pr-0"
          orders={orders}
          onChange={setOrders}
          nextOrderId={nextOrderId}
        />
      </div>
    </div>
  );
}

export default App;
