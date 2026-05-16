import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Toast.css';

export default function Toast() {
  const { toast } = useApp();
  const [msg, setMsg]       = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(()=>{
    if(!toast) return;
    setMsg(toast.message); setVisible(true);
    const t = setTimeout(()=>setVisible(false), 2800);
    return ()=>clearTimeout(t);
  },[toast]);

  if(!visible) return null;
  return <div className="toast" role="status" aria-live="polite">{msg}</div>;
}
