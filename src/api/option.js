import request from '@/utils/request'

export function fetchOptions(query) {
  return request({
    url: '/option',
    method: 'get',
    params: query
  })
}

export function updateOptions(query, info) {
  return request({
    url: '/option',
    method: 'put',
    params: query,
    data: info
  })
}
