import { IProblem } from "../models/DailyProblem";
import client from "./codeforcesClient";

// problem difficulty based on day of the week
const dayToDifficulty: { [key: number]: string } = {
  1: "easy", // Monday
  2: "easy", // Tuesday
  3: "medium", // Wednesday
  4: "easy", // Thursday
  5: "medium", // Friday
  6: "hard", // Saturday
  0: "medium", // Sunday
};

export const fetchDailyProblem = async (): Promise<IProblem | null> => {
  const dayOfWeek = new Date().getDay();
  const difficulty = dayToDifficulty[dayOfWeek];

  const response = await client.get("/problemset.problems");
  const problems = response.data.result.problems;
  const filteredProblems = problems.filter((problem: any) => {
    if (!problem.rating) return false;
    if (difficulty == "easy" && problem.rating < 1400) return true;
    if (
      difficulty == "medium" &&
      problem.rating >= 1400 &&
      problem.rating < 1800
    )
      return true;
    if (difficulty == "hard" && problem.rating >= 1800) return true;
    return false;
  });

  if (filteredProblems.length === 0) {
    console.log("No problems found for difficulty: " + difficulty);
    return null;
  }

  const randomIdx = Math.floor(Math.random() * filteredProblems.length);
  const selectedProblem = filteredProblems[randomIdx];
  const problemUrl = `https://codeforces.com/problemset/problem/${selectedProblem.contestId}/${selectedProblem.index}`;

  return {
    contestId: selectedProblem.contestId,
    index: selectedProblem.index,
    name: selectedProblem.name,
    tags: selectedProblem.tags,
    url: problemUrl,
    difficulty: difficulty,
  };
};
