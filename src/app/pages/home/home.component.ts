import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as MediumEditor from 'medium-editor';

import { UserData, UserDataService } from '@app/core/api/data/user-data.service';
import { AuthService, User } from '@app/core/services/auth/auth.service';
import { from, fromEvent, Observable, of } from 'rxjs';
import { buffer, bufferTime, debounceTime, delay, distinctUntilChanged, map, take, tap } from 'rxjs/operators';
import { EditorUtils } from '@app/core/utils/editor-utils';
import { MatSnackBar } from '@angular/material/snack-bar';


@AutoUnsubscribe()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mediumEditor') mediumEditor: ElementRef;
  text: string;


  private userUid: string;

  constructor(
    private userDataService: UserDataService,
    private authService: AuthService,
    private editorUtils: EditorUtils,
    private matSnackBar: MatSnackBar,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.userUid = await this.authService.getUserUid();
    this.getUserData();
  }

  ngAfterViewInit(): void {
    this.initEditor();
  }

  ngOnDestroy(): void {
  }

  initEditor(): void {
    const mediumEditor = this.mediumEditor.nativeElement;
    const editor = new MediumEditor(mediumEditor, {placeholder: false});

    let timeout;
    editor.subscribe('editableInput', (event) => {
      const editorSaveTimeoutMs = 1000;

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        const text = (event.target as HTMLDivElement).innerHTML;
        const updatedText = this.checkForLatex(text);
        this.saveTextState(updatedText);
      }, editorSaveTimeoutMs);
    });
  }

  private checkForLatex(text: string): string {
    const latex = text.match(this.editorUtils.latexPattern);

    if (latex) {
      try {
        const [editorValue, delimiter, value] = latex;
        const calculatedValue = new Function('return ' + value)();
        this.text = text.replace(editorValue, calculatedValue);
        return this.text;
      } catch (e) {
        this.matSnackBar.open(`${e.message}. Example: $1+1$`, null, {duration: 5000});
      }
    }

    return text;
  }

  private getUserData(): void {
    if (this.userUid) {
      this.userDataService.getUserData(this.userUid).subscribe((userData: UserData) => {
        if (userData && Boolean(userData.text)) {
          this.text = userData.text;
        }
      });
    }
  }

  private saveTextState(innerHTML: string): void {
    if (this.userUid) {
      this.userDataService.putUserData(this.userUid, {text: innerHTML}).subscribe();
    }
  }
}
