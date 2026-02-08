import { useEffect, useState } from 'react';

type TdProps = React.TdHTMLAttributes<HTMLTableCellElement>;

function EditableTd({
  value,
  onChange,
  inputType = 'text',
  tdProps,
}: {
  value: string;
  onChange: (v: string) => void;
  inputType?: 'text' | 'number';
  tdProps?: TdProps;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  //TODO: 

  return (
    <td
      {...tdProps}
      onDoubleClick={(e) => {
        tdProps?.onDoubleClick?.(e as any);
        setEditing(true);
      }}
    >
      {editing ? (
        <input
          autoFocus
          className="w-full h-full border-0 bg-transparent outline-none"
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
      ) : (
        (value && value !== '') || value === '0' ? (
          value
        ) : (
          <span className="text-gray-400">編集</span>
        )
      )}
    </td>
  );
}

export default function Order({
  className,
  index,
}: {
  className?: string;
  index: number;
}) {
  const [publisher, setPublisher] = useState('');
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [isbn, setIsbn] = useState('');

  function handleFetchInfo() {
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
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
            setPublisher(bookData.summary.publisher || '');
            setAuthor(bookData.summary.author || '');
            setTitle(bookData.summary.title || '');
          } else {
            alert('該当する書籍情報が見つかりませんでした。');
          }
        }
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
            <td
              rowSpan={3}
              className="border border-black px-2 py-1 text-center align-middle"
            >
              {index + 1}
            </td>
            <EditableTd
              value={publisher}
              onChange={(v) => setPublisher(v)}
              tdProps={{ className: 'border border-black px-2 py-1' }}
            />
            <EditableTd
              value={author}
              onChange={(v) => setAuthor(v)}
              tdProps={{ className: 'border border-black px-2 py-1' }}
            />
            <EditableTd
              value={price === 0 ? '' : String(price)}
              onChange={(v) => setPrice(Number(v) || 0)}
              inputType="number"
              tdProps={{ className: 'border border-black px-2 py-1' }}
            />
          </tr>
          <tr className="bg-black text-white">
            <th colSpan={2} className="border border-black px-2 py-1 text-left">
              書名
            </th>
            <th className="border border-black px-2 py-1 text-left flex justify-between">ISBN
              <button className='bg-gray-50 text-black pl-1 pr-1 rounded-md ml-2 text-sm print:hidden' onClick={handleFetchInfo}>取得</button>
            </th>
          </tr>
          <tr>
            <EditableTd
              value={title}
              onChange={(v) => setTitle(v)}
              tdProps={{ colSpan: 2, className: 'border border-black px-2 py-1' }}
            />
            <EditableTd
              value={isbn}
              onChange={(v) => setIsbn(v)}
              tdProps={{ className: 'border border-black px-2 py-1' }}
            />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
