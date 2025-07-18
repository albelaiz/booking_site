// Development mode utilities
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function createFallbackWarning(): string {
  return `
⚠️  DEVELOPMENT MODE: Database quota exceeded
🔄 Using fallback storage with mock data
💡 This is normal in development when your database quota is exceeded
📊 All data will be temporary and reset on server restart
🔧 To restore database functionality, upgrade your database plan or wait for quota reset
`.trim();
}

export function logFallbackMode(): void {
  if (isDevelopment()) {
    console.log('\n' + createFallbackWarning() + '\n');
  }
}
