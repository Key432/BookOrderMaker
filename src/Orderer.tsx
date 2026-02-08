import { useEffect, useRef, useState } from 'react';

export default function Ordered({ className }: { className?: string }) {
  const [name, setName] = useState('清水 貴心');
  const [phoneNumber, setPhoneNumber] = useState('080-8698-0432');

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
    const v = value.trim();
    if (v) setName(v);
    setEditingName(false);
  };

  const commitPhone = (value: string) => {
    const v = value.trim();
    if (v) setPhoneNumber(v);
    setEditingPhone(false);
  };

  return (
    <div className={className}>
      <h2 className="text-lg">注文者：</h2>
      {editingName ? (
        <input
          ref={nameRef}
          className="pl-8"
          defaultValue={name}
          onBlur={(e) => commitName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter')
              commitName((e.target as HTMLInputElement).value);
            if (e.key === 'Escape') setEditingName(false);
          }}
        />
      ) : (
        <p className="pl-8" onDoubleClick={() => setEditingName(true)}>
          {name}
        </p>
      )}

      <h2 className="text-lg">電話番号：</h2>
      {editingPhone ? (
        <input
          ref={phoneRef}
          className="pl-8"
          defaultValue={phoneNumber}
          onBlur={(e) => commitPhone(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter')
              commitPhone((e.target as HTMLInputElement).value);
            if (e.key === 'Escape') setEditingPhone(false);
          }}
        />
      ) : (
        <p className="pl-8" onDoubleClick={() => setEditingPhone(true)}>
          {phoneNumber}
        </p>
      )}
    </div>
  );
}
