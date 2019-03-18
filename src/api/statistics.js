import request from '@/utils/request'

export function getDashbordStatistics() {
  return request({
    url: '/statistics/dashboard',
    method: 'get'
  })
}
