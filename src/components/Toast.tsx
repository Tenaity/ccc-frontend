import { useEffect, useState } from 'react';

export default function Toast({
  msg,
  onDone,
}: {
  msg?: string | null;
  onDone?: () => void;
}) {
  const [show, setShow] = useState(Boolean(msg));
  useEffect(() => {
    setShow(Boolean(msg));
  }, [msg]);
  if (!show) return null;
  return (
    <div
      style={{ position: 'fixed', right: 16, bottom: 16, background: '#111827', color: 'white', padding: 12, borderRadius: 8 }}
      onClick={() => {
        setShow(false);
        onDone?.();
      }}
    >
      {msg}
    </div>
  );
}