import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  constructor() {}

  // With HTTP-only cookies, most of the token service methods are no longer needed
  // as the browser and server handle the cookies automatically

  // This method can be used to check if the user is likely logged in
  // but actual validation should happen via the AuthService.validateSession() method
  isLoggedIn(): boolean {
    // This is a simple client-side check that can be used for UI purposes
    // A more reliable check would be to use the AuthService.isAuthenticated$ observable
    return document.cookie.includes("logged_in=true");
  }

  // We keep this method for backward compatibility, but it will now rely on the auth service
  getAuthStatus(): boolean {
    return this.isLoggedIn();
  }
}
