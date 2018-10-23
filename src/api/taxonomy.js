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

export function createTaxonomy(info) {
  return request({
    url: '/taxonomy/' + info.name,
    method: 'post',
    data: info
  })
}

export function updateTaxonomy(id, data) {
  return request({
    url: '/taxonomy/' + id,
    method: 'put',
    data: data
  })
}

export function deleteTaxonomy(id, taxonomy) {
  return request({
    url: '/taxonomy/' + id,
    method: 'delete',
    params: taxonomy
  })
}
