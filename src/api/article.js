import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/article',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/' + id,
    method: 'get'
  })
}

export function createArticle(info, token) {
  return request({
    url: '/article',
    method: 'post',
    params: { token },
    data: info
  })
}

export function updateArticle(info) {
  return request({
    url: '/article/' + info.id,
    method: 'put',
    data: info
  })
}

export function deleteArticle(id) {
  return request({
    url: '/article/' + id,
    method: 'delete'
  })
}
