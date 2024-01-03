import { IoManager } from "./managers/IoManager";

export type allowedSubmissions = 0 | 1 | 2 | 3; 

interface Submission {
    problemId: string;
    isCorrect: boolean;
    userId: string;
    optionSelected: allowedSubmissions;
}

interface Problem {
    id: string;
    title: string;
    description: string;
    image: string;
    startTime: number;
    answer: allowedSubmissions;
    options: {
        id: number;
        title: string;
    }[];
    submissions: Submission[];
}

interface User {
    name: string;
    id: string;
    points: number;
}

export class Quiz {
    public roomId: string;
    private hasStarted: boolean;
    private problems: Problem[];
    private activeProblem: number;
    private users: User[];
    private currentState: "leaderboard" | "question" | "not_started" | "ended";

    constructor(roomId: string) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = "not_started";
    }
    addProblem(problem: Problem) {
        this.problems.push(problem);
        console.log(this.problems);
    }

    start() {
        this.hasStarted = true;
        this.setActiveProblem(this.problems[0]);
        this.currentState = "question";
    }

    setActiveProblem(problem: Problem) {
        problem.startTime = new Date().getTime()
        problem.submissions = [];
        IoManager.getIo().emit("CHANGE_PROBLEM",{
            problem,
        })
        setTimeout( () => {
            this.sendLeaderboard();
        }, 20 * 1000);
    }

    sendLeaderboard() {
        const leaderboard = this.getLeaderboard();
        IoManager.getIo().to(this.roomId).emit("leaderboard", {
            leaderboard,
        })
    }

    next() {
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];
        if (problem){
            this.setActiveProblem(problem);
        } else {
            // IoManager.getIo().emit("QUIZ_ENDED", {
            //     problem
            // })
        }
    }

    generateString(length: number) {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    addUser(name: string) {
        const id = this.generateString(7);
        this.users.push({
            name, id,
            points: 0,
        })
        return id;
    }

    submit(userId: string, roomId: string, problemId: string, submission: allowedSubmissions) {
        const problem = this.problems.find( x => x.id == problemId);
        const user = this.users.find( x => x.id == userId);
        if (!problem || !user) {
            return;
        }
        const existingSubmission = problem.submissions.find( x => x.userId == userId);
        if (existingSubmission) {
            return;
        }
        problem.submissions.push({
            problemId,
            isCorrect: problem.answer == submission,
            userId,
            optionSelected: submission,
        })
        user.points += 1000 - 500 * (new Date().getTime() - problem.startTime) / 20;
    }

    getLeaderboard() {
        return this.users.sort( (a, b) => a.points < b.points ? 1 : -1).splice(0, 20);
    }

    getCurrentState() {
        if (this.currentState === "not_started") {
            return {
                type: "not_started",
            }
        }
        if (this.currentState === "ended") {
            return {
                type: "ended",
                leaderboard: this.getLeaderboard(),
            }
        } 
        if (this.currentState === "leaderboard") {
            return {
                type: "leaderboard",
                leaderboard: this.getLeaderboard(),
            }
        }
        if (this.currentState === "question") {
            const problem = this.problems[this.activeProblem]
            return {
                type: "question",
                problem,
            }
        }
        
    }
}   