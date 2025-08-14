import express from "express";
import { router as createRoomRoute } from "./create-room";
import { router as joinRoomRoute } from "./join-room";

const mainRouter = express.Router();

mainRouter.use("/create-room", createRoomRoute);
mainRouter.use("/join-room", joinRoomRoute);

export { mainRouter };