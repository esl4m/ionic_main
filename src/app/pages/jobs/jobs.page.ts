import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit {

  allJobs: any;
  jobDetails: any;
  dataReturned: any;
  AUTH_SERVER_ADDRESS: string = environment.apiURL;

  constructor(
    private authService: AuthService,
    public modalController: ModalController,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getJobs();
  }

  getJobs(){
    // console.log(this.authService.isLoggedIn());
    if (this.authService.isAuthenticated) {
      this.http.get(`${this.AUTH_SERVER_ADDRESS}/jobs`)
      .subscribe((res:any) => {
        if (res.jobs){
          console.log(res.jobs);
          this.allJobs = res.jobs;
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

  async getJobDetails(jobId){
    if (this.authService.isAuthenticated) {
      this.http.get(`${this.AUTH_SERVER_ADDRESS}/job/${jobId}`)
      .subscribe((res : any) => {
        if (res.job){
          this.jobDetails = res.job;
          console.log('details .. ', res.job);
          this.openModal(res.job);
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

  async openModal(details) {
    console.log('inside');
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        "paramData": details,
        "paramTitle": "Job Details"
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }

}
