import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/media',
    method: 'get',
    params: query
  })
}

export function fetchMedia(id) {
  return request({
    url: '/media/' + id,
    method: 'get'
  })
}

export function deleteMedia(id) {
  return request({
    url: '/media/' + id,
    method: 'delete'
  })
}

export function updateMedia(id, data) {
  return request({
    url: '/media/' + id,
    method: 'put',
    data: data
  })
}
