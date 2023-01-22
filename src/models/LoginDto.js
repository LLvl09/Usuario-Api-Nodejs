class Login  {
    constructor(value) {
        this.email = value.email != null ? value.email: '';
        this.password = value.password != null ? value.password: '';
    }
}

module.exports = Login;