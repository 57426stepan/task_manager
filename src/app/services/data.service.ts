import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc, query, where } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';

// Definice toho, jak vypadá jeden úkol
export interface Note {
  id?: string;
  title: string;
  text: string;
  isDone: boolean;
  userId: string; // Důležité: Každý úkol patří konkrétnímu uživateli
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private auth: Auth, private firestore: Firestore) { }

  // --- AUTHENTICATION (Přihlášení) ---

  // Registrace nového uživatele
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Přihlášení
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Odhlášení
  logout() {
    return signOut(this.auth);
  }

  // Získání aktuálně přihlášeného uživatele (pomocí Observable)
  getProfile() {
    return authState(this.auth);
  }

  // --- DATABASE (Úkoly) ---

  // Získat všechny úkoly POUZE pro přihlášeného uživatele
  getNotes(): Observable<Note[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          // Pokud je uživatel přihlášen, stáhni jeho úkoly
          const notesRef = collection(this.firestore, 'notes');
          const q = query(notesRef, where('userId', '==', user.uid));
          return collectionData(q, { idField: 'id' }) as Observable<Note[]>;
        } else {
          // Pokud není přihlášen, vrať prázdné pole
          return of([]);
        }
      })
    );
  }

  // Získat jeden konkrétní úkol podle ID
  getNoteById(id: any): Observable<Note> {
    const noteDocRef = doc(this.firestore, `notes/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<Note>;
  }

  // Přidat nový úkol
  async addNote(note: Note) {
    // Musíme tam přidat ID uživatele, aby se to uložilo pod ním
    const user = this.auth.currentUser;
    if (user) {
      note.userId = user.uid; // Přiřadíme ID přihlášeného
      const notesRef = collection(this.firestore, 'notes');
      return addDoc(notesRef, note);
    }
    return null;
  }

  // Smazat úkol
  deleteNote(note: Note) {
    const noteDocRef = doc(this.firestore, `notes/${note.id}`);
    return deleteDoc(noteDocRef);
  }

  // Upravit úkol (např. změnit text nebo označit jako hotové)
  updateNote(note: Note) {
    const noteDocRef = doc(this.firestore, `notes/${note.id}`);
    return updateDoc(noteDocRef, { 
      title: note.title, 
      text: note.text,
      isDone: note.isDone 
    });
  }
}