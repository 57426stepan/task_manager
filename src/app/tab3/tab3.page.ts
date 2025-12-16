import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { addIcons } from 'ionicons';
import { logOut, personCircle } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab3Page implements OnInit {
  userEmail: string | null = null;

  constructor(
    private dataService: DataService,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    addIcons({ logOut, personCircle });
  }

  ngOnInit() {
    // Získáme info o přihlášeném uživateli
    this.dataService.getProfile().subscribe(user => {
      if (user) {
        this.userEmail = user.email;
      }
    });
  }

  // Funkce pro odhlášení s potvrzením
  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Odhlášení',
      message: 'Opravdu se chcete odhlásit?',
      buttons: [
        { text: 'Zrušit', role: 'cancel' },
        {
          text: 'Odhlásit',
          role: 'destructive',
          handler: async () => {
            await this.dataService.logout();
            // Přesměrování na Login a vymazání historie (aby nešlo jít zpět šipkou)
            this.router.navigateByUrl('/login', { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }
}