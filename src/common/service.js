import { getDeviceId } from "."

const createAction = () => {
    return getDeviceId()
}

export default {
  get: 1,
  a:2,
}

export {
  createAction,
}