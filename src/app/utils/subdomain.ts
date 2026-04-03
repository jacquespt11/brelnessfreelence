export function getSubdomain(): string | null {
  const hostname = window.location.hostname;
  
  // Ignore localhost and bare domains
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;
  
  // Ignore les preview links de Vercel (l'interface admin principale)
  if (hostname.endsWith(".vercel.app")) return null;
  
  // Support for development (e.g. shop.lvh.me)
  if (hostname.endsWith(".lvh.me")) {
    const parts = hostname.split(".");
    if (parts.length > 2 && parts[0] !== 'www') return parts[0];
    return null;
  }
  
  // Production (e.g. shop.brelness.com)
  const domainParts = hostname.split(".");
  if (domainParts.length > 2) {
    if (domainParts[0] === 'www') return null;
    return domainParts[0];
  }
  
  return null;
}
