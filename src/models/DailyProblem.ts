import mongoose from "mongoose";

export interface IProblem {
  contestId: number;
  index: string;
  name: string;
  url: string;
  tags: string[];
  difficulty: string;
  date?: string;
}

const DailyProblemSchema = new mongoose.Schema<IProblem>({
  contestId: {
    type: Number,
    required: true,
  },
  index: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
  },
  date: {
    type: String,
    required: true,
    default: new Date().setHours(0, 0, 0, 0),
  },
});

const DailyProblem = mongoose.model<IProblem>(
  "DailyProblem",
  DailyProblemSchema,
);
export default DailyProblem;
