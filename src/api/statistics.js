import request from '@/utils/request'

export function getDashbordStatistics() {
  return request({
    url: '/statistics/dashboard',
    method: 'get'
  })
}

export function getSystemInfo() {
  return request({
    url: '/statistics/system',
    method: 'get'
  })
}
