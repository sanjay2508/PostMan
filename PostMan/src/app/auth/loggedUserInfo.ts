export interface LoggedUserInfo {
    _id: string;
    name: string;
    email: string;
    friends: [string];
    friendsRequest: [string];
}
