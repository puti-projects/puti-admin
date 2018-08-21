import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user',
    method: 'get',
    params: query
  })
}

export function fetchUser(account) {
  return request({
    url: '/user/' + account,
    method: 'get'
  })
}

export function createUser(info) {
  return request({
    url: '/user/' + info.account,
    method: 'post',
    data: info
  })
}

export function updateUser(info) {
  return request({
    url: '/user/' + info.id,
    method: 'put',
    data: info
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}
