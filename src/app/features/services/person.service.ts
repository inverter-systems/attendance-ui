import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../environments/environment";
import { catchError, map, of, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PersonService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private router: Router) {}

  /*   login(username: string, password: string): Observable<any> {
      return this.http
        .post<any>(
          `${environment.apiUrl}/auth`,
          { username, password },
          {
            withCredentials: true, // Important: ensures cookies are sent with the request
          }
        )
        .pipe(
          tap((response) => {
            // The JWT is now stored in an HTTP-only cookie by the server
          })
        ); */

  checkRegistrationIsFull(username: string): Observable<boolean> {
    return this.http
      .get<any>(
        `${
          environment.apiUrl
        }/person/fully-registered?username=${encodeURIComponent(username)}`,
        { withCredentials: true }
      )
      .pipe(
        map((resp) => resp.data?.id != null), // Retorna true se o ID existir
        catchError(() => of(false)) // Em caso de erro, retorna false
      );
  }
}
