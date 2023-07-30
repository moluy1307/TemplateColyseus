import { Schema, Context, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { PlayerState } from "./PlayerState";

export class MyRoomState extends Schema {

  // @type("string") mySynchronizedProperty: string = "Hello world";
  @type({map: PlayerState}) players = new MapSchema<PlayerState>();

}
