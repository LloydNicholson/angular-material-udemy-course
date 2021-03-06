import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  onGoingTraining = false;
  exerciseSub: Subscription;

  constructor(private trainingService: TrainingService) {
  }

  ngOnInit() {
    this.exerciseSub = this.trainingService.exerciseChanged.subscribe(
        (exercise) => {
          exercise ? this.onGoingTraining = true : this.onGoingTraining = false;
        }
    );
  }

  ngOnDestroy() {
    this.exerciseSub.unsubscribe();
  }
}
