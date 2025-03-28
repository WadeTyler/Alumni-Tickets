import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  private TOP_THRESHOLD: number = 250;

  public isAtTop: boolean = true;

  constructor() { }

  public updateIsAtTop(): void {
    this.isAtTop = window.scrollY <= this.TOP_THRESHOLD;
  }
}
