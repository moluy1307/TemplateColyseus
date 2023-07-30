import { Schema, Context, type } from "@colyseus/schema";

export class PlayerState extends Schema {

    @type("string") playerName: string;
    @type("boolean") connected: boolean;
    @type("number") positionX: number = 0;

}
