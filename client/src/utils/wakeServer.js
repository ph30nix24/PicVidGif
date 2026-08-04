const wakeServer = async (baseUrl, {maxAttempts = 8, delayMs = 1000 } = {}) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(`${baseUrl}/picVidGif/v1/health`, { signal: AbortSignal.timeout(6000) });
      if (res.ok) return true;
    } catch {
      // ignore, retry
    }
    await new Promise((r) => setTimeout(r, delayMs)); // pause before next loop iteration
  }
  return false;
}

export default wakeServer;