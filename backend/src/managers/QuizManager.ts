import { Quiz, allowedSubmissions } from "../Quiz";
import { IoManager } from "./IoManager";

let globalProblemId = 0;

export class QuizManager {
    private quizes: Quiz[];

    constructor() {
        this.quizes = []; 
    }

    public start(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.start();
    }

    public addProblem(roomId: string, problem: {
        title: string;
        description: string;
        image: string;
        answer: allowedSubmissions;
        options: {
            id: number;
            title: string;
        }[];
    }) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.addProblem({
            ...problem,
            startTime: new Date().getTime(),
            id: (globalProblemId++).toString(),
            submissions: [],
        })
    }

    public next(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.next();
    }

    addUser(roomId: string, name: string) {
        this.getQuiz(roomId)?.addUser(name);
    }

    submit(userId: string,roomId: string,problemId:string, submission: 0 | 1 | 2 | 3) {
        this.getQuiz(roomId)?.submit(userId, roomId, problemId, submission)
    }

    getQuiz(roomId: string) {
        return this.quizes.find( x => x.roomId === roomId) ?? null;
    }

    getCurrentState(roomId: string) {
        const quiz = this.quizes.find ( x => x.roomId === roomId);
        if (!quiz){
            return null;
        }
        quiz.getCurrentState();
    }

    addQuiz(roomId: string) {
        const quiz = new Quiz(roomId);
        this.quizes.push(quiz);
    }
    
}