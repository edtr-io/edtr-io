export enum ExerciseState {
  Default = 1,
  SolvedRight,
  SolvedWrong
}

export const handleWrongAnswer = (
  setExerciseState: (e: ExerciseState) => void
) => {
  setTimeout(() => {
    setExerciseState(ExerciseState.Default)
  }, 2000)
  setExerciseState(ExerciseState.SolvedWrong)
}

export const getColor = (
  colorset: { defaultColor: string; correctColor: string; wrongColor: string },
  exerciseState: ExerciseState
) => {
  switch (exerciseState) {
    case ExerciseState.Default: {
      return colorset.defaultColor
    }
    case ExerciseState.SolvedRight: {
      return colorset.correctColor
    }
    case ExerciseState.SolvedWrong: {
      return colorset.wrongColor
    }
  }
}
