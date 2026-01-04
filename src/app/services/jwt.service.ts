import { Injectable } from '@angular/core';

// Method 1: Using jwt-decode library (Recommended)
// First install: npm install jwt-decode
// import { jwtDecode } from 'jwt-decode';

// Method 2: Manual JWT decoding service
@Injectable({
  providedIn: 'root'
})
export class JwtService {

  // Manual decode method (without external library)
  decodeToken(token: string): any {
    try {
      // Split the JWT token into its three parts
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token format');
      }

      // Decode the payload (second part)
      const payload = parts[1];
      
      // Add padding if necessary
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      
      // Decode from base64
      const decodedPayload = atob(paddedPayload);
      
      // Parse JSON
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  // Get specific claim from token
  getClaim(token: string, claimName: string): any {
    const decoded = this.decodeToken(token);
    return decoded ? decoded[claimName] : null;
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  // Get user ID from token
  getUserId(token: string): string | null {
    return this.getClaim(token, 'sub') || this.getClaim(token, 'userId') || this.getClaim(token, 'id');
  }

  // Get user email from token
  getUserEmail(token: string): string | null {
    return this.getClaim(token, 'email');
  }

  // Get user roles from token
  getUserRoles(token: string): string[] {
    const roles = this.getClaim(token, 'roles') || this.getClaim(token, 'authorities') || [];
    return Array.isArray(roles) ? roles : [roles];
  }

  // Get token expiration date
  getTokenExpirationDate(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return null;
    }
    
    return new Date(decoded.exp * 1000);
  }

  // Get time until token expires (in minutes)
  getTimeUntilExpiration(token: string): number | null {
    const expirationDate = this.getTokenExpirationDate(token);
    if (!expirationDate) {
      return null;
    }
    
    const now = new Date();
    const timeDiff = expirationDate.getTime() - now.getTime();
    return Math.floor(timeDiff / (1000 * 60)); // Convert to minutes
  }

  // Validate token format
  isValidTokenFormat(token: string): boolean {
    if (!token) return false;
    
    const parts = token.split('.');
    return parts.length === 3;
  }

  // Get full decoded token with header and payload
  getFullDecodedToken(token: string): { header: any, payload: any } | null {
    try {
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        return null;
      }

      // Decode header
      const headerPadded = parts[0] + '='.repeat((4 - parts[0].length % 4) % 4);
      const header = JSON.parse(atob(headerPadded));

      // Decode payload
      const payloadPadded = parts[1] + '='.repeat((4 - parts[1].length % 4) % 4);
      const payload = JSON.parse(atob(payloadPadded));

      return { header, payload };
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }
}