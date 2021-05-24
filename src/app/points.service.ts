import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PointsService {

  pointsTotal = 0;
  points = 15;
  streakCounter = 0;
  streak = 3;
  bonus = 200;

  constructor() {}

  correctAnswer() {
    let points = this.points;
    this.streakCounter++;

    if (this.streakCounter >= this.streak) {
      points = this.points + this.bonus;
      this.bonus = this.bonusIncrement();
    }

    return this.pointsTotal += points;
  }

  wrongAnswer() {
    this.resetBonus();
    return this.pointsTotal -= this.points;
  }

  resetBonus() {
    this.streakCounter = 0;
    this.bonus = 200;
  }

  bonusIncrement() {
    return this.bonus * this.streakCounter;
  }
}
