import request from '@/utils/request'

export function fetchList(type) {
  return request({
    url: '/taxonomy',
    method: 'get',
    params: type
  })
}
