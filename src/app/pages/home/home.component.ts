import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as MediumEditor from 'medium-editor';

import { UserData, UserDataService } from '@app/core/api/data/user-data.service';
import { AuthService, User } from '@app/core/services/auth/auth.service';


@AutoUnsubscribe()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mediumEditor') mediumEditor: ElementRef;

  text: string;
  preview: string;
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
        this.preview = text;
        this.saveTextState(text);
      }, editorSaveTimeoutMs);
    });
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
