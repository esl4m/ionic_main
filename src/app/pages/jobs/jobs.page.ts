import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit {

  allJobs: any;
  AUTH_SERVER_ADDRESS: string = environment.apiURL;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getJobs();
  }

  getJobs(){
    // console.log(this.authService.isLoggedIn());
    if (this.authService.isAuthenticated) {
      console.log('here !!');
      this.http.get(`${this.AUTH_SERVER_ADDRESS}/jobs`)
      .subscribe((res:any) => {
        if (res.jobs){
          console.log(res.jobs);
          this.allJobs = res.jobs;
          console.log('all ... ', this.allJobs.json);
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
