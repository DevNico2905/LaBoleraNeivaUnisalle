import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ScoreModalComponent } from './score-modal/score-modal.component';
import { NewGameModalComponent } from './new-game-modal/new-game-modal.component';

const routes: Routes = [
  {path: "", component:HomeComponent},
  {path:"login", component:LoginComponent},
  {path: "home", component:HomeComponent, 
    children: [
      {path: "new-game", component:NewGameModalComponent},
      {path: "score-modal", component:ScoreModalComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
