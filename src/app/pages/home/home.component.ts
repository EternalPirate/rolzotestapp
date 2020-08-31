import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as MediumEditor from 'medium-editor';

import { UserData, UserDataService } from '@app/core/api/data/user-data.service';
import { AuthService, User } from '@app/core/services/auth/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('mediumEditor') mediumEditor: ElementRef;

  editorText: string;
  previewText: string;
  user: User;

  constructor(
    public auth: AuthService,
    private userDataService: UserDataService,
    private authService: AuthService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getUser();
    this.getUserData();
  }

  ngAfterViewInit(): void {
    this.initEditor();
  }

  private getUserData(): void {
    if (this.user) {
      this.userDataService.getUserData(this.user.uid).subscribe((userData: UserData) => {
        if (userData && Boolean(userData.text)) {
          this.editorText = userData.text;
          this.previewText = userData.text;
        }
      });
    }
  }

  private initEditor(): void {
    const mediumEditor = this.mediumEditor.nativeElement;
    const editor = new MediumEditor(mediumEditor, {placeholder: false});

    let timeout;
    const editorOnSaveDebounce = (event) => {
      const editorSaveTimeoutMs = 1000;

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        const text = (event.target as HTMLDivElement).innerHTML;
        this.previewText = text;
        this.saveTextState(text);
      }, editorSaveTimeoutMs);
    };

    editor.subscribe('editableInput', editorOnSaveDebounce);
  }

  private saveTextState(innerHTML: string): void {
    if (this.user) {
      this.userDataService.putUserData(this.user.uid, {text: innerHTML}).subscribe();
    }
  }
}
