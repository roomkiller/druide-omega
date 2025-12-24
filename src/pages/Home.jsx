/**
 * Redirection automatique vers Landing
 */
import React, { useEffect } from 'react';
import { createPageUrl } from '@/utils';

export default function Home() {
  useEffect(() => {
    window.location.href = createPageUrl('Landing');
  }, []);

  return null;
}