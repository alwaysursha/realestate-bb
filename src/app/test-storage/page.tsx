'use client';

import { useState, useEffect } from 'react';

export default function TestStorage() {
  const [testResult, setTestResult] = useState<string>('Testing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Test if localStorage is available
      if (typeof window !== 'undefined' && window.localStorage) {
        console.log('localStorage is available');
        
        // Test writing to localStorage
        localStorage.setItem('testKey', 'testValue');
        
        // Test reading from localStorage
        const readValue = localStorage.getItem('testKey');
        
        // Test removing from localStorage
        localStorage.removeItem('testKey');
        
        if (readValue === 'testValue') {
          setTestResult('localStorage is working correctly!');
        } else {
          setTestResult(`localStorage read test failed. Expected 'testValue', got '${readValue}'`);
        }
      } else {
        setTestResult('localStorage is not available in this browser');
      }
    } catch (err) {
      console.error('Error testing localStorage:', err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      setTestResult('localStorage test failed with an error');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            localStorage Test
          </h2>
          
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold">Test Result:</h3>
            <p className={`mt-2 ${testResult.includes('working') ? 'text-green-600' : 'text-red-600'}`}>
              {testResult}
            </p>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <a 
              href="/admin/login/" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 