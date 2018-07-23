import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(username) {
  return request({
    url: '/api/user/' + username,
    method: 'get'
    // params: {
    //   username
    // }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
