export function getSubdomain(): string | null {
  const hostname = window.location.hostname;
  
  // Ignore localhost and bare domains
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;
  
  // Support for development (e.g. shop.lvh.me)
  if (hostname.endsWith(".lvh.me")) {
    const parts = hostname.split(".");
    if (parts.length > 2) return parts[0];
    return null;
  }
  
  // Production (e.g. shop.brelness.com)
  const domainParts = hostname.split(".");
  // Assuming brelness.com has 2 parts. 
  // If subdomain.brelness.com, length will be 3.
  if (domainParts.length > 2) {
    return domainParts[0];
  }
  
  return null;
}
