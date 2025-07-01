'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestEnvPage() {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test if we can connect to Supabase
        const { data, error } = await supabase.from('posts').select('count').limit(1);
        
        if (error) {
          setError(`Connection failed: ${error.message}`);
          setStatus('❌ Failed');
        } else {
          setStatus('✅ Connected successfully!');
        }
      } catch (err) {
        setError(`Unexpected error: ${err}`);
        setStatus('❌ Failed');
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Environment Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Connection Status</h2>
            <p className="text-lg">{status}</p>
            {error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Environment Variables</h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>SUPABASE_URL:</strong> 
                <span className="ml-2 text-muted-foreground">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              <div>
                <strong>SUPABASE_ANON_KEY:</strong> 
                <span className="ml-2 text-muted-foreground">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Next Steps</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>If connection failed, check your Supabase credentials</li>
              <li>Make sure you've run the database schema from SETUP.md</li>
              <li>Verify your .env.local file is in the project root</li>
              <li>Restart your development server after adding environment variables</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 