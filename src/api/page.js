import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/page',
    method: 'get',
    params: query
  })
}

export function fetchPage(id) {
  return request({
    url: '/page/' + id,
    method: 'get'
  })
}

export function createPage(info) {
  return request({
    url: '/page',
    method: 'post',
    data: info
  })
}

export function updatePage(info) {
  return request({
    url: '/page/' + info.id,
    method: 'put',
    data: info
  })
}

export function deletePage(id) {
  return request({
    url: '/page/' + id,
    method: 'delete'
  })
}
