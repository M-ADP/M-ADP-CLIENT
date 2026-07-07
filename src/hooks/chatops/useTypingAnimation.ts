import { useEffect, useState } from 'react';

interface UseTypingAnimationParams {
  pendingRequestId: string | null;
  finalResponse: string | null;
  streamingText: string | null;
}

export function useTypingAnimation({
  pendingRequestId,
  finalResponse,
  streamingText,
}: UseTypingAnimationParams) {
  const [displayedStreamingText, setDisplayedStreamingText] = useState('');

  useEffect(() => {
    const targetText = finalResponse ?? streamingText ?? '';

    if (!pendingRequestId || displayedStreamingText === targetText) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDisplayedStreamingText((current) => {
        if (!targetText.startsWith(current)) {
          return targetText;
        }

        const remaining = targetText.length - current.length;
        if (remaining <= 0) {
          return current;
        }

        const advance = Math.max(1, Math.floor(remaining / 10));
        return targetText.slice(0, current.length + advance);
      });
    }, 15);

    return () => window.clearTimeout(timeoutId);
  }, [displayedStreamingText, finalResponse, pendingRequestId, streamingText]);

  return displayedStreamingText;
}
