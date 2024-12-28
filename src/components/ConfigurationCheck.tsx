import React from 'react';
import { validateEnvironment } from '../config/environment';

interface ConfigurationCheckProps {
  children: React.ReactNode;
}

export function ConfigurationCheck({ children }: ConfigurationCheckProps) {
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      validateEnvironment();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Configuration error');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Configuration Required</h2>
            <p className="text-gray-600 mb-4">
              Please create a <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code> file in the project root with the following variables:
            </p>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm mb-4 overflow-x-auto">
              VITE_AWS_ACCESS_KEY_ID=your_access_key_id
              VITE_AWS_SECRET_ACCESS_KEY=your_secret_access_key
              VITE_AWS_REGION=your_region
              VITE_AWS_BUCKET_NAME=your_bucket_name
            </pre>
            <p className="text-sm text-gray-500">
              You can run <code className="bg-gray-100 px-1 py-0.5 rounded">npm run deploy</code> to set up the environment automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}