import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false, // 👈 Add this line
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  intervalId: any;
  showModal = false;

  constructor(private modalService: ModalService) {
    this.subscriptions.add(
      this.modalService.showModal$.subscribe(show => {
        this.showModal = show;
      })
    );
  }

  ngOnInit(): void {
    this.updateClock();
    this.intervalId = setInterval(() => this.updateClock(), 1000);
    
    this.subscriptions.add(
      this.modalService.players$.subscribe(players => {
        if (players.count > 0) {
          console.log('Jugadores configurados:', players);
        }
      })
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.subscriptions.unsubscribe();
  }

  showNewGameModal(): void {
    this.modalService.openModal();
  }

    // home.component.ts
  openScoreModal() {
    this.modalService.openScoreModal();
  }


  updateClock(): void {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    clockElement.textContent = `${hours}:${minutes}`;
  }
}