import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // Subject para controlar la visibilidad del modal
  private showModalSubject = new BehaviorSubject<boolean>(false);

  private currentGameId: string | null = null;

  setCurrentGameId(gameId: string) {
    this.currentGameId = gameId;
  }

  getCurrentGameId(): string | null {
    return this.currentGameId;
  }
  
  // Subject para manejar los datos de los jugadores
  private playersSubject = new BehaviorSubject<{
    names: string[], 
    count: number
  }>({ names: [], count: 0 });

  // Exponer como Observables públicos
  public showModal$: Observable<boolean> = this.showModalSubject.asObservable();
  public players$: Observable<{names: string[], count: number}> = this.playersSubject.asObservable();

  private scoreModalSubject = new BehaviorSubject<boolean>(false);
  public scoreModal$ = this.scoreModalSubject.asObservable();

  constructor() {}

  

  openScoreModal(): void {
    this.scoreModalSubject.next(true);
  }

  closeScoreModal(): void {
    this.scoreModalSubject.next(false);
  }


  // Métodos para controlar el modal
  openModal(): void {
    this.showModalSubject.next(true);
  }

  closeModal(): void {
    this.showModalSubject.next(false);
  }

  // Métodos para manejar los jugadores
  setPlayers(names: string[], count: number): void {
    this.playersSubject.next({ names, count });
  }

  getCurrentPlayers(): {names: string[], count: number} {
    return this.playersSubject.value;
  }

  // Limpiar datos
  resetPlayers(): void {
    this.playersSubject.next({ names: [], count: 0 });
  }
}