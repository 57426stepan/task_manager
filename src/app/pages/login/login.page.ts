import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  // Proměnné pro formulář
  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private dataService: DataService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
  }

  // Funkce pro registraci
  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      await this.dataService.register(this.credentials.email, this.credentials.password);
      await loading.dismiss();
      this.showAlert('Vítejte', 'Registrace proběhla úspěšně! Nyní jste přihlášeni.');
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (e) {
      await loading.dismiss();
      this.showAlert('Chyba registrace', 'Zkontrolujte e-mail nebo heslo (min. 6 znaků).');
      console.error(e);
    }
  }

  // Funkce pro přihlášení
  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      await this.dataService.login(this.credentials.email, this.credentials.password);
      await loading.dismiss();
      // Přesměrování na hlavní stránku s úkoly
      this.ngZone.run(() => {
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      });
    } catch (e) {
      await loading.dismiss();
      this.showAlert('Chyba přihlášení', 'Špatný e-mail nebo heslo.');
      console.error(e);
    }
  }

  // Pomocná funkce pro zobrazení alertu
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}