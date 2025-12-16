import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { DataService, Note } from '../services/data.service';
import { addIcons } from 'ionicons';
import { add, trash, checkmarkCircle, ellipse } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab1Page {
  notes: Note[] = [];

  constructor(
    private dataService: DataService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private cd: ChangeDetectorRef
  ) {
    // Registrace ikonek
    addIcons({ add, trash, checkmarkCircle, ellipse });

    // Načtení dat z databáze
    this.dataService.getNotes().subscribe(res => {
      // Vyfiltrujeme jen NEDOKONČENÉ úkoly
      this.notes = res.filter(note => note.isDone === false);
      this.cd.detectChanges();
    });
  }

  // Funkce pro přidání nového úkolu (otevře vyskakovací okno)
  async addNote() {
    const alert = await this.alertCtrl.create({
      header: 'Nový úkol',
      inputs: [
        {
          name: 'title',
          placeholder: 'Co je potřeba udělat?',
          type: 'text'
        },
        {
          name: 'text',
          placeholder: 'Detaily (volitelné)',
          type: 'textarea'
        }
      ],
      buttons: [
        { text: 'Zrušit', role: 'cancel' },
        {
          text: 'Přidat',
          handler: (res) => {
            if (!res.title) return; // Ochrana proti prázdnému názvu
            this.dataService.addNote({
              title: res.title,
              text: res.text,
              isDone: false,
              userId: '' // Doplní se automaticky v servise
            });
            this.showToast('Úkol přidán');
          }
        }
      ]
    });
    await alert.present();
  }

  // Označit úkol jako hotový
  async markAsDone(note: Note) {
    const updated = { ...note, isDone: true };
    await this.dataService.updateNote(updated);
    this.showToast('Úkol dokončen! Přesunuto do záložky Hotovo.');
  }

  // Smazat úkol
  async deleteNote(note: Note) {
    await this.dataService.deleteNote(note);
    this.showToast('Úkol smazán');
  }

  // Pomocná bublina s textem
  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }
}