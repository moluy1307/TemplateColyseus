import { Room, Client, ClientArray } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { IncomingMessage } from "http";
import { PlayerState } from "./schema/PlayerState";
import { MyRoomService } from "./MyRoom.services";

export class MyRoom extends Room<MyRoomState> {

  private myRoomService: MyRoomService;
  constructor(){
    super();
    this.myRoomService = new MyRoomService();
  }

  /**
   * Số lượng khách hàng tối đa được phép kết nối vào phòng. 
   * Khi phòng đạt đến giới hạn này, nó sẽ tự động bị khóa. 
   * Trừ khi khóa phòng rõ ràng thông qua phương thức lock(), phòng sẽ được mở khóa ngay khi khách hàng ngắt kết nối khỏi phòng.
   */
  maxClients = 3;

  onCreate (options: any) {
    this.setState(new MyRoomState());

    this.onMessage("SEND_MESSAGE", (client, message) => {
      console.log(client.sessionId, "da gui 1 doan tin nhan: ", message);
      this.broadcast("action-taken", {message: "an action has been taken!", roomId: this.roomId});
    });

    this.onMessage("SEND_POSITION", (client, message) => {
      this.state.players.get(client.sessionId).positionX += message.posX;
    });
  }

  /**
   * Phương thức được thực thi trước onJoin(), được sử dụng để xác minh user trước khi cho họ tham gia phòng
   * Nếu không được triển khai, nó luôn trả về true => cho phép bất kì ai cũng có thể kết nối vào phòng
   * @returns boolean
   * @param client 
   * @param options 
   * @param request 
   */
  // onAuth(client: Client<this["clients"] extends ClientArray<infer U, any> ? U : never, this["clients"] extends ClientArray<infer _, infer U> ? U : never>, options: any, request?: IncomingMessage) {
  //   // const userData = await validateToken(options.accessToken);
  //   // if (userData) {
  //   //     return userData;

  //   // } else {
  //   //     throw new ServerError(400, "bad access token");
  //   // }
  // }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined! in room: ", this.roomId, " has name: ", this.roomName);
    client.send("MY_INFORMATION", {sessionId: client.sessionId, reconnectionToken: client._reconnectionToken});
    this.state.players.set(client.sessionId, new PlayerState());
    // Tạo/Cập nhật thông user chơi game vào database
    this.myRoomService.createOrUpdateUser(options, client);
  }

  async onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left! room: ", this.roomId, " has name: ", this.roomName);
    this.broadcast("LEAVE_ROOM", "co 1 nguoi vua thoat phong, cho ho ket noi lai", {except: client});
    this.state.players.get(client.sessionId).connected = false;
    try {
      if (consented) {
          throw new Error("consented leave");
      }

      // cho phép người chơi bị ngắt kết nối kết nối lại vào phòng này trong 20 giây
      await this.allowReconnection(client, 20);

      this.state.players.get(client.sessionId).connected = true;
    } catch (e) {
      // Xoá người chơi khỏi phòng nếu sau 20 giây người đó không kết nối lại
      this.state.players.delete(client.sessionId);
    }
  }

  /**
   * Phương thức onDispose() được gọi trước khi phòng bị hủy
   * Được sử dụng để lưu trữ dữ liệu vào database sau khi trận đấu kết thúc
   */
  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
