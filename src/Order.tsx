import { useEffect, useState } from 'react';
import { type BookOrder } from './Orders';

type TdProps = React.TdHTMLAttributes<HTMLTableCellElement>;

function EditableTd({
  value,
  onChange,
  inputType = 'text',
  tdProps,
}: {
  value: string;
  onChange: (value: string) => void;
  inputType?: 'text' | 'number';
  tdProps?: TdProps;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  return (
    <td
      {...tdProps}
      onDoubleClick={(e) => {
        tdProps?.onDoubleClick?.(e);
        setEditing(true);
      }}
    >
      {editing ? (
        <input
          autoFocus
          className="h-full w-full border-0 bg-gray-200 bg-transparent outline-none"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            onChange(draft);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onChange(draft);
              setEditing(false);
            }
            if (e.key === 'Escape') {
              setDraft(value);
              setEditing(false);
            }
          }}
          type={inputType}
        />
      ) : value !== '' ? (
        value
      ) : (
        <span className="text-gray-400">編集</span>
      )}
    </td>
  );
}

export default function Order({
  className,
  index,
  order,
  onChange,
}: {
  className?: string;
  index: number;
  order: BookOrder;
  onChange: (order: BookOrder) => void;
}) {
  function updateField<K extends keyof BookOrder>(key: K, value: BookOrder[K]) {
    onChange({ ...order, [key]: value });
  }

  function handleFetchInfo() {
    const cleanIsbn = order.isbn.replace(/[-\s]/g, '');
    if (!/^\d{10}(\d{3})?$/.test(cleanIsbn)) {
      alert('ISBN は 10 桁または 13 桁の数字で入力してください。');
      return;
    }
    fetch(`https://api.openbd.jp/v1/get?isbn=${cleanIsbn}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data[0]) {
          const bookData = data[0];
          if (bookData.summary) {
            onChange({
              ...order,
              publisher: bookData.summary.publisher || '',
              author: bookData.summary.author || '',
              title: bookData.summary.title || '',
              price: bookData?.onix?.ProductSupply?.SupplyDetail?.Price?.[0]?.PriceAmount || 0,
              isbn: order.isbn,
            });
          } else {
            alert('該当する書籍情報が見つかりませんでした。');
          }
        } else {
          alert('該当する書籍情報を取得できませんでした。');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('書籍情報の取得中にエラーが発生しました。コンソールを確認してください。');
      });
  }

  return (
    <div className={className}>
      <table className="w-full border-collapse border border-black text-left">
        <tbody>
          <tr className="bg-black text-white">
            <th className="w-[5%] border border-black px-2 py-1">No.</th>
            <th className="w-[15%] border border-black px-2 py-1">出版社</th>
            <th className="w-[60%] border border-black px-2 py-1">著者名</th>
            <th className="w-[20%] border border-black px-2 py-1">価格</th>
          </tr>
          <tr>
            <td rowSpan={3} className="border border-black px-2 py-1 text-center align-middle">
              {index + 1}
            </td>
            <EditableTd
              value={order.publisher}
              onChange={(value) => updateField('publisher', value)}
              tdProps={{ className: 'border border-black px-2 py-1' }}
            />
            <EditableTd
              value={order.author}
              onChange={(value) => updateField('author', value)}
              tdProps={{ className: 'border border-black px-2 py-1' }}
            />
            <EditableTd
              value={order.price === 0 ? '' : String(order.price)}
              onChange={(value) => updateField('price', Number(value) || 0)}
              inputType="number"
              tdProps={{ className: 'border border-black px-2 py-1' }}
            />
          </tr>
          <tr className="bg-black text-white">
            <th colSpan={2} className="border border-black px-2 py-1 text-left">
              書名
            </th>
            <th className="border border-black px-2 py-1 text-left">
              <div className="flex items-center justify-between gap-2">
                <span>ISBN</span>
                <button
                  className="ml-2 rounded-md bg-gray-50 px-1 py-0.5 text-sm text-black print:hidden"
                  onClick={handleFetchInfo}
                  type="button"
                >
                  取得
                </button>
              </div>
            </th>
          </tr>
          <tr>
            <EditableTd
              value={order.title}
              onChange={(value) => updateField('title', value)}
              tdProps={{ colSpan: 2, className: 'border border-black px-2 py-1' }}
            />
            <EditableTd
              value={order.isbn}
              onChange={(value) => updateField('isbn', value)}
              tdProps={{ className: 'border border-black px-2 py-1' }}
            />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
