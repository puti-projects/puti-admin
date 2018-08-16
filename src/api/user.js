import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user',
    ethod: 'get',
    params: query
  })
}
