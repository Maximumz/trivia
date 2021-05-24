import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Questions {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

@Injectable({
  providedIn: 'root'
})

export class TriviaService {

  questions: Observable<Questions[]>;

  constructor(private http:HttpClient) {}

  getQuestions(): Observable<Questions[]> {
    return this.http.get<Questions[]>('https://opentdb.com/api.php?amount=50&difficulty=medium&type=boolean');
  }
}
