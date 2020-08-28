import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorUtils {
  latexPattern = /(\${1,2})((?:\\.|.)*)\1/;
}
