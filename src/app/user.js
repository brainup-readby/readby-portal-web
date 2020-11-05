const USER_TYPES = {
  ADMIN: "admin"
}

class User {
  constructor(user) {
    this.userInfo = { ...user };
  }

  get user() {
    return this.userInfo;
  }

  get email() {
    return this.userInfo && this.userInfo.email;
  }

  get name() {
    return (
      this.userInfo && this.userInfo.name
    );
  }

  get id() {
    return this.userInfo && this.userInfo.userid;
  }

  get role() {
    return this.userInfo && this.userInfo.role;
  }

  get isAdmin() {
    return this.role === USER_TYPES.ADMIN;
  }
}

export default User;
