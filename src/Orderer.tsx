import { useEffect, useRef, useState } from 'react';

export type OrdererInfo = {
  name: string;
  phoneNumber: string;
};

export default function Ordered({
  className,
  orderer,
  onChange,
}: {
  className?: string;
  orderer: OrdererInfo;
  onChange: (value: OrdererInfo) => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingName) nameRef.current?.focus();
  }, [editingName]);

  useEffect(() => {
    if (editingPhone) phoneRef.current?.focus();
  }, [editingPhone]);

  const commitName = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      onChange({ ...orderer, name: trimmedValue });
    }
    setEditingName(false);
  };

  const commitPhone = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      onChange({ ...orderer, phoneNumber: trimmedValue });
    }
    setEditingPhone(false);
  };

  return (
    <div className={className}>
      <h2 className="text-lg">注文者：</h2>
      {editingName ? (
        <input
          ref={nameRef}
          className="pl-8"
          defaultValue={orderer.name}
          onBlur={(e) => commitName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commitName((e.target as HTMLInputElement).value);
            }
            if (e.key === 'Escape') setEditingName(false);
          }}
        />
      ) : (
        <p className="pl-8" onDoubleClick={() => setEditingName(true)}>
          {orderer.name}
        </p>
      )}

      <h2 className="text-lg">電話番号：</h2>
      {editingPhone ? (
        <input
          ref={phoneRef}
          className="pl-8"
          defaultValue={orderer.phoneNumber}
          onBlur={(e) => commitPhone(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commitPhone((e.target as HTMLInputElement).value);
            }
            if (e.key === 'Escape') setEditingPhone(false);
          }}
        />
      ) : (
        <p className="pl-8" onDoubleClick={() => setEditingPhone(true)}>
          {orderer.phoneNumber}
        </p>
      )}
    </div>
  );
}
