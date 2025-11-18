// Generate a random token for QR (one-time session token)
export function generateToken(length: number = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Convert object to Base64 (for secure QR payload)
export function encodeBase64(obj: any) {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}

// Decode Base64 payload from QR
export function decodeBase64(str: string) {
  return JSON.parse(Buffer.from(str, "base64").toString());
}

// Returns true if a timestamp is expired
export function isExpired(timestamp: number) {
  return Date.now() > timestamp;
}

// Get current timestamp + X seconds
export function addSeconds(seconds: number) {
  return Date.now() + seconds * 1000;
}

// Calculate distance between teacher & student location (Haversine formula)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // meters
  const toRad = (value: number) => (value * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in meters
}
