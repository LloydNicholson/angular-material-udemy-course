import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exerciseSub: Subscription;

  constructor(
      private trainingService: TrainingService
  ) {
  }

  ngOnInit() {
    this.exerciseSub = this.trainingService.exercisesChanged.subscribe(
        exercises => {
          this.exercises = exercises;
        }
    );
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.exerciseSub.unsubscribe();
  }

}
