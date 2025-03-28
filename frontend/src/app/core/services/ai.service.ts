import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private apiURL: string = environment.apiUrl;

  // States
  isImprovingDescription: boolean = false;
  improveDescriptionError: string = '';

  constructor(private http: HttpClient) { }

  public improveDescription(description: string): Observable<any> {
    this.isImprovingDescription = true;
    this.improveDescriptionError = '';

    return this.http.post<any>(`${this.apiURL}/ai/improve/description`, {description}, { withCredentials: true}).pipe(
      map(response => {
        if (response.improvedDescription) {
          this.isImprovingDescription = false;
          return response.improvedDescription;
        }
        throw new Error(response.message);
      }),
      catchError(e => {
        this.isImprovingDescription = false;
        this.improveDescriptionError = e.error.message || "Something went wrong. Try again later.";
        return of(null);
      })
    );
  }

}
