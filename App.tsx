
import React, { useState, useCallback } from 'react';
import { generateConfirmationMessage } from './services/geminiService';
import { TreeIcon } from './components/TreeIcon';

type Status = 'idle' | 'loading' | 'success' | 'error';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');

  const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      setFormError('Please fill in both name and email.');
      return;
    }
    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setFormError('');
    setStatus('loading');
    setMessage('');

    try {
      const confirmationMessage = await generateConfirmationMessage(name);
      setMessage(confirmationMessage);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setMessage('We encountered an issue signing you up. Please try again later.');
      setStatus('error');
    }
  }, [name, email]);

  return (
    <div className="bg-brand-beige min-h-screen text-brand-green font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5">
        <TreeIcon className="w-full h-full text-brand-green" />
      </div>

      <main className="z-10 flex flex-col items-center text-center w-full max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif-italic text-5xl md:text-7xl italic">atelier</h1>
          <h2 className="font-display text-8xl md:text-9xl tracking-tighter -mt-4">560</h2>
        </div>

        <div className="bg-brand-green/10 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full">
          {status !== 'success' && (
            <>
              <h3 className="font-display text-3xl md:text-4xl text-brand-green mb-2">A new story begins.</h3>
              <p className="text-brand-green/80 mb-6 max-w-md mx-auto">
                Inspired by deep roots and the richness of nature. Be the first to discover a new culinary experience. Join our list for exclusive opening announcements.
              </p>
            </>
          )}

          {status === 'idle' || status === 'loading' ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-brand-off-white/50 text-brand-green placeholder-brand-green/60 px-4 py-3 rounded-md border border-brand-green/20 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all"
                disabled={status === 'loading'}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                className="w-full bg-brand-off-white/50 text-brand-green placeholder-brand-green/60 px-4 py-3 rounded-md border border-brand-green/20 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all"
                disabled={status === 'loading'}
              />
              {formError && <p className="text-red-700 text-sm">{formError}</p>}
              <button
                type="submit"
                className="w-full bg-brand-green text-brand-off-white font-display text-xl px-6 py-3 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 focus:ring-offset-brand-beige transition-all disabled:bg-brand-green/50 disabled:cursor-not-allowed"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Cultivating...' : 'Join The List'}
              </button>
            </form>
          ) : (
            <div className="p-6 rounded-md text-brand-green">
              <h3 className="font-display text-3xl mb-4">Welcome.</h3>
              <p className="whitespace-pre-wrap text-lg">{message}</p>
            </div>
          )}
        </div>
        <footer className="mt-8 text-xs text-brand-green/50">
          <p>&copy; {new Date().getFullYear()} Atelier 560. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
