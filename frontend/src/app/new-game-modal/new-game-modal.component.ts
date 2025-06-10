import { Component, ElementRef, ViewChildren, QueryList, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { PlayerService } from '../services/player.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

interface Player {
  id?: number;
  name: string;
  gameId: string;
  finalScore?: number;
}

@Component({
  selector: 'app-new-game-modal',
  standalone: false,
  templateUrl: './new-game-modal.component.html',
  styleUrl: './new-game-modal.component.css'
})
export class NewGameModalComponent implements OnInit {
  @ViewChildren('radioButton') radioButtons!: QueryList<ElementRef>;
  
  selectedValue: string | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isSaving: boolean = false;
  showModal: boolean = false;

  constructor(
    private elRef: ElementRef,
    private modalService: ModalService,
    private playerService: PlayerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.modalService.showModal$.subscribe(show => {
      this.showModal = show;
      if (!show) {
        this.resetForm();
      }
    });
  }

  ngAfterViewInit(): void {
    this.radioButtons.forEach(button => {
      button.nativeElement.addEventListener('click', () => this.onRadioButtonClick(button.nativeElement));
    });
  }

  onRadioButtonClick(button: HTMLElement): void {
    this.radioButtons.forEach(btn => btn.nativeElement.classList.remove('selected'));
    button.classList.add('selected');
    this.selectedValue = button.dataset['value'] || null;
    this.errorMessage = '';

    switch (this.selectedValue) {
      case '1-p': this.showDivNameDefault(); break;
      case '2-p': this.showDivNameTwo(); break;
      case '3-p': this.showDivNameThree(); break;
      case '4-p': this.showDivNameFour(); break;
      case '5-p': this.showDivNameFive(); break;
      case '6-p': this.showDivNameSix(); break;
    }
  }

  startGame(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedValue) {
      this.errorMessage = 'Por favor, selecciona el número de jugadores';
      return;
    }

    const playerNames = this.getPlayerNames();
    const playerCount = parseInt(this.selectedValue.split('-')[0]);

    if (playerNames.length !== playerCount) {
      this.errorMessage = `Debes ingresar exactamente ${playerCount} nombres de jugadores`;
      return;
    }

    if (playerNames.some(name => !name.trim())) {
      this.errorMessage = 'Todos los jugadores deben tener un nombre válido';
      return;
    }

    this.isSaving = true;
    const gameId = uuidv4();

    this.playerService.savePlayers(
      playerNames.map(name => ({ name, gameId }))
    ).subscribe({
      next: (savedPlayers) => {
        this.successMessage = `¡Partida creada con ${savedPlayers.length} jugadores!`;
        this.isSaving = false;
        // Set the gameId in the modal service
        this.modalService.setCurrentGameId(gameId); //
        this.modalService.setPlayers(playerNames, playerCount);
        
        setTimeout(() => {
          this.hideNewGameModal();
        }, 1500);

        this.router.navigate(['/score-modal']);

        this.modalService.openScoreModal();
      },
      error: (err) => {
        this.errorMessage = 'Error al guardar la partida. Por favor, intenta nuevamente.';
        this.isSaving = false;
        console.error('Error:', err);
      }
    });
  }

  hideNewGameModal(): void {
    this.modalService.closeModal();
    this.router.navigate([''])
  }

  private resetForm(): void {
    this.selectedValue = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = false;
    this.clearInputs();
    this.resetSelection();
    this.showDivNameDefault();
  }

  private getPlayerNames(): string[] {
    const names = [];
    const count = this.selectedValue ? parseInt(this.selectedValue.split('-')[0]) : 0;
    
    for (let i = 1; i <= count; i++) {
      const input = this.elRef.nativeElement.querySelector(`#i-n-${this.getNumberName(i)}`) as HTMLInputElement;
      if (input) names.push(input.value.trim());
    }
    
    return names;
  }

  private getNumberName(num: number): string {
    const names = ['one', 'two', 'three', 'four', 'five', 'six'];
    return names[num - 1] || '';
  }

  /*
  private clearInputs(): void {
    const inputs = this.elRef.nativeElement.querySelectorAll("input[type='text']") as NodeListOf<HTMLInputElement>;
    inputs.forEach(input => input.value = '');
  } */

  private clearInputs(): void {
    const inputs = this.elRef.nativeElement.querySelectorAll('.input-names') as NodeListOf<HTMLInputElement>;
    inputs.forEach(input => input.value = '');
  }

  private resetSelection(): void {
    this.radioButtons?.forEach(button => {
      button.nativeElement.classList.remove('selected');
    });
  }

  private showDivNameDefault(): void {
    this.toggleDivNameClasses({ two: false, three: false, four: false, five: false, six: false });
  }


  private showDivNameTwo(): void {
    this.toggleDivNameClasses({ two: true, three: false, four: false, five: false, six: false });
  }

  private showDivNameThree(): void {
    this.toggleDivNameClasses({ two: true, three: true, four: false, five: false, six: false });
  }

  private showDivNameFour(): void {
    this.toggleDivNameClasses({ two: true, three: true, four: true, five: false, six: false });
  }

  private showDivNameFive(): void {
    this.toggleDivNameClasses({ two: true, three: true, four: true, five: true, six: false });
  }

  private showDivNameSix(): void {
    this.toggleDivNameClasses({ two: true, three: true, four: true, five: true, six: true });
  }

  private toggleDivNameClasses(states: { two: boolean; three: boolean; four: boolean; five: boolean; six: boolean }): void {
    const divTwo = this.elRef.nativeElement.querySelector('#div-name-two') as HTMLElement;
    const divThree = this.elRef.nativeElement.querySelector('#div-name-three') as HTMLElement;
    const divFour = this.elRef.nativeElement.querySelector('#div-name-four') as HTMLElement;
    const divFive = this.elRef.nativeElement.querySelector('#div-name-five') as HTMLElement;
    const divSix = this.elRef.nativeElement.querySelector('#div-name-six') as HTMLElement;

    if (divTwo) states.two ? divTwo.classList.add('showDivName') : divTwo.classList.remove('showDivName');
    if (divThree) states.three ? divThree.classList.add('showDivName') : divThree.classList.remove('showDivName');
    if (divFour) states.four ? divFour.classList.add('showDivName') : divFour.classList.remove('showDivName');
    if (divFive) states.five ? divFive.classList.add('showDivName') : divFive.classList.remove('showDivName');
    if (divSix) states.six ? divSix.classList.add('showDivName') : divSix.classList.remove('showDivName');
  }

      // home.component.ts
  openScoreModal() {
    this.modalService.openScoreModal();
  }
}