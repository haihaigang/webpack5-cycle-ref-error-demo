import { getDeviceId } from "."

const createAction = (data) => {
 return data.includes("love") ? 'includes love' : getDeviceId()
}

export default {
  get: (data) => { return 1 },
  a:2,
}

export {
  createAction,
}