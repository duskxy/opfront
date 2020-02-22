import axios from '@/libs/api.request'

export const getGroupList = (params) => {
    return axios.request({
        url: 'api/group/',
        method: 'get',
        params
      })
}

export const createGroup = (data) => {
  return axios.request({
      url: 'api/group/',
      method: 'post',
      data
    })
}

export const deleteGroup = (id) => {
  return axios.request({
      url: 'api/group/' + id + '/',
      method: 'delete',
    })
}

export const getPermissionList = () => {
  return axios.request({
    url: 'api/permission/',
    method: 'get'
  })
}
