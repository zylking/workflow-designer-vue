import request from "@/utils/request";

// 保存模板流程模板
export function saveModelTemplate(data) {
  return request({
    url: '/flow/model/node/saveModelNode',
    method: 'post',
    data,
    headers: {'Content-Type': 'application/json'}
  });
}

// 获取人员
export function getPersonnel(data) {
  return request({
    url: '/zz/yonghu/getYongHu',
    method: 'post',
    data
  });
}

// 获取组织
export function getOrganize(data) {
  return request({
    url: '/zz/zuzhigl/selectByZuzhilx',
    method: 'post',
    data
  });
}

// 获取岗位
export function getStation(data) {
  return request({
    url: '/zz/zuzhigl/getzzjs',
    method: 'post',
    data
  });
}

// 获取流程节点条件选项
export function getNodeCondition(data) {
  return request({
    url: '/flow/param/getParamPage',
    method: 'post',
    data
  });
}

// 获取节点功能权限
export function getNodeAuthority(data) {
  return request({
    url: '/flow/auth/point/getAuthPointPage',
    method: 'post',
    data
  });
}
