import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(
    private alertController: AlertController,
    private safariViewController: SafariViewController
  ) { }

  async showAlertMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  showBrowser(url: string) {

    return this.safariViewController.show({
      url: url,
      hidden: false,
      animated: false,
      transition: 'slide',
      enterReaderModeIfAvailable: true,
      tintColor: '#ff0000'
    });

  }

}
