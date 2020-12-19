import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  allMessages: any;
  messageDetails: any;
  AUTH_SERVER_ADDRESS: string = environment.apiURL;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getMessages();
  }

  getMessages(){
    if (this.authService.isAuthenticated) {
      this.http.get(`${this.AUTH_SERVER_ADDRESS}/messages`)
      .subscribe((res:any) => {
        if (res.messages){
          console.log(res.messages);
          this.allMessages = res.messages;
        }
      },
      (err) => {
        console.log(err);
      });
    }
    else {
      console.log('user logged out!');
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }
}
