import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Player {
  id?: number;
  name: string;
  gameId: string;
  finalScore?: number;

}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = 'http://localhost:8080/api/players'; // Ajusta según tu URL de Spring Boot

  constructor(private http: HttpClient) {}

  savePlayers(players: Player[]): Observable<Player[]> {
    return this.http.post<Player[]>(this.apiUrl, players);
  }

  getPlayersByGame(gameId: string | null): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/by-game/${gameId}`);
  }

  saveScores(players: any[]): Observable<any> {
    return this.http.post('/api/games/scores', players);
  }
}