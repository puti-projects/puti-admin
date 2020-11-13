import request from '@/utils/request'

export function fetchKnowledgeList() {
  return request({
    url: '/knowledge',
    method: 'get'
  })
}

export function createKnowledge(info) {
  return request({
    url: '/knowledge/' + info.name,
    method: 'post',
    data: info
  })
}

export function fetchKnowledge(id) {
  return request({
    url: '/knowledge/' + id,
    method: 'get'
  })
}

export function updateKnowledge(id, data) {
  return request({
    url: '/knowledge/' + id,
    method: 'put',
    data: data
  })
}
