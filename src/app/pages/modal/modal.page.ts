import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  modalTitle: string;
  modalData: any;
  role: any;
  roleDriver: any;
  roleUser: any;

  constructor(
    private authService: AuthService,
    private modalController: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    if (this.authService.isAuthenticated){
      console.table(this.navParams);
      this.modalTitle = this.navParams.data.paramTitle;
      this.modalData = this.navParams.data.paramData;

      Storage.get({ key: "role" }).then((val) => {
        this.role = val.value;
        
        if (val.value == 'driver'){
          this.roleDriver = true;
        }
        if (val.value == 'user'){
          this.roleUser = true;
        }
      });
    }
    else {
      console.log('logged out !');
    }
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }
}
