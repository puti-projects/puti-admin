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

