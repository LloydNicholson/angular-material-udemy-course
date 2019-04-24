import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private currentExercise: Exercise;

  constructor(private db: AngularFirestore) {
  }

  fetchAvailableExercises() {
    this.db
    .collection('availableExercises')
    .snapshotChanges()
    .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
    )
    .subscribe((exercises: Exercise[]) => {
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises]);
    }, error => console.log(error));
  }

  startExercise(selectedId: string) {
    this.db.doc('availableExercises/' + selectedId).update({ lastSelected: new Date() }); // adding a field to an object
    this.currentExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.currentExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.currentExercise,
      date: new Date(),
      state: 'completed'
    });
    this.currentExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.currentExercise,
      date: new Date(),
      duration: this.currentExercise.duration * (progress / 100),
      calories: this.currentExercise.calories * (progress / 100),
      state: 'cancelled'
    });
    this.currentExercise = null;
    this.exerciseChanged.next(null);
  }

  getCurrentExercise() {
    return { ...this.currentExercise };
  }

  fetchCompletedOrCancelledExercises() {
    this.db.collection('finishedExercises')
    .valueChanges()
    .subscribe((exercises: Exercise[]) => {
      this.finishedExercisesChanged.next(exercises);
    }, error => console.log(error));
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
