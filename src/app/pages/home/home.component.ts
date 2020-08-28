import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as MediumEditor from 'medium-editor';

import { UserData, UserDataService } from '@app/core/api/data/user-data.service';
import {AuthService, User} from '@app/core/services/auth/auth.service';
import { EditorUtils } from '@app/core/utils/editor-utils';


@AutoUnsubscribe()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mediumEditor') mediumEditor: ElementRef;

  text: string;
  user: User;

  constructor(
    private userDataService: UserDataService,
    private authService: AuthService,
    private editorUtils: EditorUtils,
    private matSnackBar: MatSnackBar,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getUser();
    console.log(this.user);
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
    if (this.user) {
      this.userDataService.getUserData(this.user.uid).subscribe((userData: UserData) => {
        if (userData && Boolean(userData.text)) {
          this.text = userData.text;
        }
      });
    }
  }

  private saveTextState(innerHTML: string): void {
    if (this.user) {
      this.userDataService.putUserData(this.user.uid, {text: innerHTML}).subscribe();
    }
  }
}
