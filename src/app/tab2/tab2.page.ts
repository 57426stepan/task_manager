import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { DataService, Note } from '../services/data.service';
import { addIcons } from 'ionicons';
import { trash, refresh, checkmarkCircle, checkmarkDoneCircle } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab2Page {
  doneNotes: Note[] = [];

  constructor(
    private dataService: DataService,
    private toastCtrl: ToastController
  ) {
    // Registrace ikonek
    addIcons({ trash, refresh, checkmarkCircle, checkmarkDoneCircle });

    // Načtení dat - filtrujeme jen HOTOVÉ
    this.dataService.getNotes().subscribe(res => {
      this.doneNotes = res.filter(note => note.isDone === true);
    });
  }

  // Funkce pro vrácení úkolu zpět (Odškrtnout)
  async undoNote(note: Note) {
    const updated = { ...note, isDone: false };
    await this.dataService.updateNote(updated);
    this.showToast('Úkol vrácen mezi aktivní.');
  }

  // Trvalé smazání
  async deleteNote(note: Note) {
    await this.dataService.deleteNote(note);
    this.showToast('Úkol trvale smazán.');
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }
}