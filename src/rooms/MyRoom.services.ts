import { Model } from "mongoose";
import { UserModel } from "../entities/UserEntity";

export class MyRoomService{
    async createOrUpdateUser(data: any, client: any){
        const {faceId, userName, photoUrl, locale} = data;
        const user = await UserModel.findOne({faceId: faceId});
        if(!user){
            const newUser = new UserModel({
                faceId: faceId,
                userName: userName,
                photoUrl: photoUrl,
                locale: locale,
                sessionId: client.sessionId
            });
            await newUser.save();
            return newUser;
        }else{
            user.faceId = faceId;
            user.userName = userName;
            user.photoUrl = photoUrl;
            user.locale = locale;
            user.sessionId = client.sessionId;
            await user.save();
            return user;
        }
    }
    // async getUser(data: any, client: any){
    //     const {userId, userName, createdDate} = data;
    //     const user = await UserModel.find();
    //     return user;
    // }
}