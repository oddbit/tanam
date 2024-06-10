type NotificationType = "warning" | "success" | "error";

class UserNotification {
  constructor(
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly message: string,
  ) {}
}
