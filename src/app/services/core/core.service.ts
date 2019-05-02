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


    /* const browser = this.inAppBrowser.create(url, '_blank');

    try {
      browser.on('exit').subscribe(event => {
        console.log(event);
        alert(event);
      });
    } catch (e) {
      console.log(e);
      //alert('heyyo');
    }

     //browser.close(); */

    return this.safariViewController.show({
      url: url,
      hidden: false,
      animated: false,
      transition: 'curl',
      enterReaderModeIfAvailable: true,
      tintColor: '#ff0000'
    })






    /* this.safariViewController.isAvailable()
      .then((available: boolean) => {
          if (available) {
            
            

          } else {
            // use fallback browser, example InAppBrowser
          }
        }); */


  }

}
