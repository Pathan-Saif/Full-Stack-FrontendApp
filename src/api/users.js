import api from './axios'
import { unwrapApiList } from './apiResponse'

export async function getUsers() {
  return unwrapApiList(await api.get('/users'))
}
