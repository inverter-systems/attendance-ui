import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, map, take } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredRoles = route.data["roles"] as Array<string>;

    return this.authService.currentUser$.pipe(
      take(1),
      map((user) => {
        // First check if user is authenticated
        if (!user) {
          this.router.navigate(["/login"], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }

        // If no specific roles are required, allow access
        if (!requiredRoles || requiredRoles.length === 0) {
          return true;
        }

        // Check if user has any of the required roles
        const hasRequiredRole = requiredRoles.some((role) =>
          this.authService.hasRole(role)
        );

        if (!hasRequiredRole) {
          this.router.navigate(["/access-denied"]);
          return false;
        }

        return true;
      })
    );
  }
}
