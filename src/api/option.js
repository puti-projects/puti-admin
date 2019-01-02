import request from '@/utils/request'

export function fetchOptions(query) {
  return request({
    url: '/option',
    method: 'get',
    params: query
  })
}

export function updateOption(info) {
  return request({
    url: '/option',
    method: 'put',
    data: info
  })
}
