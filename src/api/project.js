import axios from '@/libs/api.request'

export const getProjectList = (params) => {
    return axios.request({
        url: 'api/project/',
        method: 'get',
        params
      })
}

export const createProject = (data) => {
  return axios.request({
      url: 'api/project/',
      method: 'post',
      data
    })
}

export const deleteProject = (id) => {
  return axios.request({
      url: 'api/project/' + id + '/',
      method: 'delete',
    })
}

