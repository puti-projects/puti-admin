import request from '@/utils/request'

export function fetchList(type) {
  return request({
    url: '/taxonomy',
    method: 'get',
    params: type
  })
}

export function fetchTaxonomy(id) {
  return request({
    url: '/taxonomy/' + id,
    method: 'get'
  })
}
