export interface ExerciseData {
  images: string[];
  instructions: string[];
}

export const exerciseService = {
  async getExerciseData(term: string): Promise<ExerciseData | null> {
    if (!term) return null;

    try {
      const response = await fetch(`/api/localdb/image?term=${encodeURIComponent(term)}`);

      if (!response.ok) return null;

      const data = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  },

  async searchExerciseId(term: string): Promise<number | null> {
    return null;
  },
};
