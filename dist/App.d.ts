import express from "express";
export default class App {
    app: express.Application;
    path: string;
    constructor();
    listen(): Promise<void>;
    private initializeHelmet;
    private initializeMiddleware;
    private initializeController;
}
