import Wx from "./wx.js"
import { createAction } from "./service.js"

function getDeviceId() {
  return global.__device_id || "this is device empty"
}

export {
  getDeviceId,
  createAction,
  Wx,
}