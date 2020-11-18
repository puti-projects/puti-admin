import request from '@/utils/request'

export function fetchKnowledgeItemList(id) {
  return request({
    url: '/knowledge-list/' + id,
    method: 'get'
  })
}

export function createKnowledgeItem(info, token) {
  return request({
    url: '/knowledge-item',
    method: 'post',
    params: { token },
    data: info
  })
}

export function fetchKnowledgeItem(id) {
  return request({
    url: '/knowledge-item/' + id,
    method: 'get'
  })
}

export function updateKnowledgeItem(id, data) {
  return request({
    url: '/knowledge-item/' + id,
    method: 'put',
    data: data
  })
}

export function deleteKnowledgeItem(id) {
  return request({
    url: '/knowledge-item/' + id,
    method: 'delete'
  })
}
