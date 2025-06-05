import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { PlayerService } from '../services/player.service';
@Component({
  selector: 'app-score-modal',
  standalone: false,
  templateUrl: './score-modal.component.html',
  styleUrl: './score-modal.component.css'
})
export class ScoreModalComponent implements OnInit {
  players: any[] = [];
  currentFrame: number = 1;
  
  constructor(
    public modalService: ModalService,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    this.playerService.getPlayersByGame(this.modalService.getCurrentGameId())
      .subscribe(players => {
        this.players = players.map(p => ({
          ...p,
          frames: Array(5).fill({ attempt1: null, attempt2: null, total: null }),
          totalScore: 0
        }));
      });
  }

  updateScore(player: any, frameIndex: number, attempt: number, value: string) {
    const frame = player.frames[frameIndex];
    const numericValue = parseInt(value, 10); // Convert string to number

    // Validation of score
    // You might want to add a check for isNaN(numericValue) here if the input can be empty or non-numeric
    if (isNaN(numericValue)) {
        // Handle cases where input is empty or invalid, e.g., set to 0 or null
        // For now, we'll proceed with 0 for calculation if it's NaN
        frame[`attempt${attempt}`] = 0; 
    } else {
        if (attempt === 1 && numericValue > 10) return;
        if (attempt === 2 && (frame.attempt1 + numericValue) > 10) return;
        
        frame[`attempt${attempt}`] = numericValue;
    }
    
    frame.total = this.calculateFrameTotal(frame);
    player.totalScore = this.calculateTotalScore(player);
  }



  private calculateFrameTotal(frame: any): number {
    if (frame.attempt1 === 10) return 10; // Strike
    return (frame.attempt1 || 0) + (frame.attempt2 || 0);
  }

  private calculateTotalScore(player: any): number {
    return player.frames.reduce((sum: number, frame: any) => sum + frame.total, 0);
  }

  saveScores() {
    this.playerService.saveScores(this.players)
      .subscribe(() => {
        this.modalService.closeScoreModal();
      });
  }
}
