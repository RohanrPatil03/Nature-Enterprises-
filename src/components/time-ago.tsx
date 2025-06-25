'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';

interface TimeAgoProps {
  timestamp: Timestamp | undefined;
}

export function TimeAgo({ timestamp }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (timestamp) {
      setTimeAgo(formatDistanceToNow(timestamp.toDate(), { addSuffix: true }));
    }
  }, [timestamp]);

  if (!timestamp) {
    return null;
  }

  // Render a placeholder on the server and initial client render
  // to prevent hydration mismatch.
  return <>{timeAgo || '...'}</>;
}
