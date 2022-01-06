
import { createAction } from "./service.js"

let WeiXin = {
  init() {
    this.loginAction = createAction("POST", "/v1/users/login")
  },
}

WeiXin.init()

export default WeiXin