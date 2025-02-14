import User from "../models/User";
import mongoose from "mongoose";
import DailyProblem from "../models/DailyProblem";
import { fetchDailyProblem } from "./problems";
import client from "./codeforcesClient";

export const connectToDb = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected to MongoDB");
};

// store user's discordId and codeforcesHandle
export const linkUser = async (discordId: string, codeforcesHandle: string) => {
  let user = await User.findOne({ discordId });
  if (user) {
    user.codeforcesHandle = codeforcesHandle;
  } else {
    user = new User({ discordId, codeforcesHandle });
  }
  await user.save();
};

// get today's problem from database or fetch from codeforces API
export const getDailyProblem = async () => {
  const existingProblem = await DailyProblem.findOne({
    date: new Date().setHours(0, 0, 0, 0),
  });
  if (existingProblem) return existingProblem;

  const problem = await fetchDailyProblem();
  const newProblem = new DailyProblem(problem);
  await newProblem.save();
  return newProblem;
};

// check if user has solved today's problem
export const checkSolve = async (discordId: string) => {
  const user = await User.findOne({ discordId });
  if (!user)
    return {
      success: false,
      message: "⚠️ You haven't linked your Codeforces account yet",
    };

  const dailyProblem = await getDailyProblem();
  if (!dailyProblem)
    return { success: false, message: "There is no daily problem today" };

  const response = await client.get("/user.status", {
    params: {
      handle: user.codeforcesHandle,
    },
  });

  const submissions = response.data.result;
  const solved = submissions.some(
    (submission: any) =>
      submission.verdict === "OK" &&
      submission.problem.contestId === dailyProblem.contestId &&
      submission.problem.index === dailyProblem.index,
  );

  if (solved) {
    switch (dailyProblem.difficulty) {
      case "easy":
        user.points += 20;
        break;
      case "medium":
        user.points += 50;
        break;
      case "hard":
        user.points += 100;
        break;
    }
    await user.save();
    return {
      success: true,
      message: "💯 Congratulations! You have solved today's problem",
    };
  } else {
    return {
      success: false,
      message: "⚠️ You haven't solved today's problem yet!",
    };
  }
};

export const getLeaderboardData = async () => {
  const users = await User.find().sort({ points: -1 }).limit(10);
  return users;
};
