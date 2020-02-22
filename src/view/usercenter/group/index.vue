<template>
  <div>
    <div class="head-sea">
      <Row>
        <Col span="12">
          <Input
            v-model="getParams.search"
            search
            enter-button
            placeholder="搜索"
            style="width: 300px"
            @on-change="handleGetGroupList"
            @on-click="handleGetGroupList"
            @on-enter="handleGetGroupList"
          />
        </Col>
        <Col span="12" style="text-align:right">
          <Button type="success" @click="addGroup = true">新增组</Button>
        </Col>
      </Row>
    </div>
    <Table border :columns="columnsGroup" :data="groupList"></Table>
    <div class="page">
      <Page
        :total="total"
        show-sizer
        :current="getParams.page"
        @on-change="pageChange"
        @on-page-size-change="sizeChange"
      />
    </div>
    <Modal
      v-model="addGroup"
      title="新增组"
      width="800px"
      @on-ok="handleCreateGroup"
      @on-cancel="cancel"
    >
      <Form ref="formGroupCreate" :model="formGroupCreate" :rules="ruleCustom" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="组名：" prop="name">
              <Input type="text" v-model="formGroupCreate.name"></Input>
            </FormItem>
          </Col>
          <Divider />
        </Row>
        <FormItem label="权限：" prop="permissions">
          <Transfer
            :data="permissionList"
            :target-keys="formGroupCreate.permissions"
            filterable
            :filter-method="filterMethod"
            :list-style="listStyle"
            @on-change="handleChangePerm"
            :titles="transferTitles"
          ></Transfer>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { getGroupList, createGroup, getPermissionList,deleteGroup } from '@/api/group';
import { Button, } from 'iview';
export default {
  name: "group",
  data() {
    return {
      getParams: {
        search: "",
        page: 1,
        pagesize: 10
      },
      total: 1,
      groupList: [],
      addGroup: false,
      formGroupCreate: {
        name: "",
        permissions: []
      },
      permissionList: [],
      transferTitles: ["可选", "已选"],
      listStyle: {
        width: "300px",
        height: "300px"
      },
      ruleCustom: {
        name: [{ required: true, message: "组名不能为空", trigger: "blur" }]
      },
      columnsGroup: [
        {
          title: "组名",
          render: (h, params) => {
            return h("Tag", {}, params.row.name);
          }
        },
        {
          title: "操作",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                Button,
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "12px"
                  },
                  on: {
                    click: () => {
                      // this.updateModal = true;
                      // this.updateGroupForm.id = params.row.id;
                      // this.updateGroupForm.name = params.row.name;
                      // // 组的权限数据
                      // let perms = [];
                      // const groupperms = params.row.perms;
                      // groupperms.map(item => {
                      //   perms.push(item.id);
                      // });
                      // this.updateGroupForm.db_id_list = perms;
                      // // 系统的权限数据
                      // let sourceperms = [];
                      // this.permissionList.map(item => {
                      //   if (contains(groupperms, item.id) == false) {
                      //     sourceperms.push(item);
                      //   }
                      // });
                      // this.updateGroupForm.sourcePerms = sourceperms;
                    }
                  }
                },
                "修改"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要删除吗?"
                  },
                  on: {
                    "on-ok": () => {
                      this.handDeleteGroup(params.row.id, params.row.username);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "warning",
                        size: "small"
                      }
                    },
                    "删除"
                  )
                ]
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {
    this.handleGetGroupList();
    this.handleGetPermissionList();
  },
  methods: {
    notice(title, msg) {
      this.$Notice.success({
        title: title,
        duration: 6,
        desc: msg
      });
    },
    handleGetGroupList() {
      getGroupList(this.getParams).then(resp => {
        this.total = resp.data.count;
        this.groupList = resp.data.results;
      });
    },
    handleCreateGroup() {
      this.$refs.formGroupCreate.validate(valid => {
        if (!valid) {
          return false;
        }
      });
      let data = this.formGroupCreate;
      createGroup(data).then(resp => {
        let httpstatus = resp.status;
        if (httpstatus == 201) {
          let title = "服务器提示";
          let msg = "组 " + resp.data.name + " 创建成功";
          this.notice(title, msg);
        }
        this.handleGetGroupList();
        this.$refs.formGroupCreate.resetFields();
      });
    },
    handleChangePerm() {},
    permsFormat(permissonlist) {
      let permlist = [];
      permissonlist.map(item => {
        permlist.push({
          key: item.id,
          label: item.name,
          description: item.codename
        });
      });
      return permlist;
    },
    handleGetPermissionList() {
      getPermissionList().then(resp => {
        this.permissionList = this.permsFormat(resp.data);
      });
    },
    handDeleteGroup(id,name) {
      deleteGroup(id).then(resp => {
        let httpstatus = resp.status;
        if (httpstatus == 204) {
          let title = "服务器提示";
          let msg = "用户 " + name + " 删除成功";
          this.notice(title, msg);
          }
          let totalPage = Math.ceil((this.total - 1) / this.getParams.pagesize) // 总页数
          this.getParams.page = this.getParams.page > totalPage ? totalPage : this.getParams.page
          this.getParams.page = this.getParams.page < 1 ? 1 : this.getParams.page
          this.handleGetGroupList();

      });
    },
    handleChangePerm(newTargetKeys) {
      this.formGroupCreate.permissions = newTargetKeys;
    },
    pageChange(page) {
      this.getParams.page = page;
      this.handleGetGroupList();
    },

    sizeChange(size) {
      this.getParams.pagesize = size;
      this.handleGetGroupList();
    },
    filterMethod(data, query) {
      return data.label.indexOf(query) > -1;
    },
    cancel() {
          this.$Message.info("Clicked cancel");
    }
  }
};
</script>

<style>
.head-sea {
  margin-bottom: 10px;
}
.page {
  margin-top: 10px;
}
</style>