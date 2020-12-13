import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userName: any;
  // userEmail: any;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    if (this.authService.isAuthenticated){
      Storage.get({ key: "name" }).then((val) => {
        this.userName = val.value;
      });
    }
    else {
      console.log('logged out !');
    }
  }
}
