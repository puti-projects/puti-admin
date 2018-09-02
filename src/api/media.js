import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/media',
    method: 'get',
    params: query
  })
}
