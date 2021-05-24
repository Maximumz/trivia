import { Component, OnInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { CdkDragDrop, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { TriviaService } from '../trivia.service';
import { PointsService } from '../points.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})

export class QuestionsComponent implements OnInit {

  questions: any[] = [];
  question: any[] = [];
  questionIndex = 0;
  pointsTotal = 0;
  pointsBonus = 200;
  movesTillStreak = 3;
  increase = true;

  constructor (
    private triviaService: TriviaService,
    private renderer:Renderer2,
    private pointsService: PointsService
  ) {
    // Load all the questions for the quiz
    this.getQuestions();
  }

  ngOnInit(): void {}

  getQuestions() {
    return this.triviaService.getQuestions().subscribe((data: any) => {
        data.results.forEach((element: any) => {
          this.questions.push(element);
        });
        this.getQuestion();
      });
  }

  getQuestion() {
    // Reset the question array
    this.question.length = 0;
    // Check there are more questions
    if (typeof this.questions[this.questionIndex] !== 'undefined') {
      // Add the next question
      this.question.push(this.questions[this.questionIndex]);
      // Increase the index for the next question
      this.questionIndex++;
    } else {
      // No more questions
      this.finishGame();
    }
  }

  finishGame() {
    alert('Game Over!');
  }

  drop(event: CdkDragDrop<boolean, any>) {
    // Pass into setTimeout
    let self = this;
    this.renderer.removeClass(event.container.element.nativeElement, 'hover');
    // Store the correct answer and convert to boolean
    let correctAnswer = (this.question[0].correct_answer == 'True') ? true : false;
    // Check if the answer is correct
    if (correctAnswer == event.container.data) {
      // Add points
      this.correctAnswer();
      // Toggle classes
      this.renderer.addClass(event.container.element.nativeElement, 'correct');
      setTimeout( function() {
        self.renderer.removeClass(event.container.element.nativeElement, 'correct');
      }, 500);
    } else {
      // Minus points
      this.wrongAnswer();
      // Toggle classes
      this.renderer.addClass(event.container.element.nativeElement, 'wrong');
      setTimeout( function() {
        self.renderer.removeClass(event.container.element.nativeElement, 'wrong');
      }, 500);
    }
    this.updateBonnus();
    // Cycle to the next question
    this.getQuestion();
  }

  correctAnswer() {
    this.pointsTotal = this.pointsService.correctAnswer();
    this.increase = true;
  }

  wrongAnswer() {
    this.pointsTotal = this.pointsService.wrongAnswer();
    this.increase = false;
    this.movesTillStreak = 3;
  }

  updateBonnus() {
    this.pointsBonus = this.pointsService.bonus;
    if (this.movesTillStreak) {
          this.movesTillStreak = this.pointsService.streak - this.pointsService.streakCounter;
    }
  }

  hoverDropzone(event: any) {
    // Add the class when hovering over the dropzone
    this.renderer.addClass(event.container.element.nativeElement, 'hover');
  }

  exitDropzone(event: any) {
    // Remove the class when hovering over the dropzone
    this.renderer.removeClass(event.container.element.nativeElement, 'hover');
  }
}
