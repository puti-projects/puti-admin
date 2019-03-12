import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/subject',
    method: 'get'
  })
}

export function createSubject(info) {
  return request({
    url: '/subject/' + info.name,
    method: 'post',
    data: info
  })
}

export function fetchSubject(id) {
  return request({
    url: '/subject/' + id,
    method: 'get'
  })
}

export function updateSubject(id, data) {
  return request({
    url: '/subject/' + id,
    method: 'put',
    data: data
  })
}

export function deleteSubject(id) {
  return request({
    url: '/subject/' + id,
    method: 'delete'
  })
}
