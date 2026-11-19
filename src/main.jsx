import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

function OriginalMarcoXP() {
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/marcoXP-original.html')
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load the original portfolio (${response.status})`);
        return response.text();
      })
      .then((source) => {
        if (cancelled) return;
        const documentView = new DOMParser().parseFromString(source, 'text/html');

        // Keep the original stylesheet and body markup unchanged.
        documentView.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
          document.head.appendChild(node.cloneNode(true));
        });
        document.body.innerHTML = documentView.body.innerHTML.replace(/<script[\s\S]*?<\/script>/gi, '');

        // Re-run the original inline scripts after the exact original DOM exists.
        documentView.body.querySelectorAll('script').forEach((oldScript) => {
          const script = document.createElement('script');
          if (oldScript.src) script.src = oldScript.src;
          else script.textContent = oldScript.textContent;
          document.body.appendChild(script);
        });
      })
      .catch((loadError) => !cancelled && setError(loadError));

    return () => { cancelled = true; };
  }, []);

  if (error) return <pre style={{ padding: 24, color: '#b00' }}>{error.message}</pre>;
  return null;
}

createRoot(document.getElementById('root')).render(<OriginalMarcoXP />);
