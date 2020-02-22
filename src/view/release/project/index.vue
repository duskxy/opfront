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
            @on-change="handleGetProjectList"
            @on-click="handleGetProjectList"
            @on-enter="handleGetProjectList"
          />
        </Col>
        <Col span="12" style="text-align:right">
          <Button type="success" @click="addProject = true">新增项目</Button>
        </Col>
      </Row>
    </div>
    <Table border :columns="columnsProject" :data="projectList"></Table>
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
      v-model="addProject"
      title="新增项目"
      width="500px"
      @on-ok="handleCreateProject"
      @on-cancel="cancel"
    >
      <Form ref="formProjectCreate" :model="formProjectCreate" :rules="ruleCustom" :label-width="80">
            <FormItem label="项目名：" prop="name">
              <Input type="text" v-model="formProjectCreate.name"></Input>
            </FormItem>
        <FormItem label="备注：" prop="desc">
             <Input type="text" v-model="formProjectCreate.desc"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { getProjectList, createProject, deleteProject } from '@/api/project';
import { Button, } from 'iview';
export default {
  name: "project",
  data() {
    return {
      getParams: {
        search: "",
        page: 1,
        pagesize: 10
      },
      total: 1,
      projectList: [],
      addProject: false,
      formProjectCreate: {
        name: "",
        desc: ""
      },
      ruleCustom: {
        name: [{ required: true, message: "项目名不能为空", trigger: "blur" }]
      },
      columnsProject: [
        {
          title: "项目名",
          render: (h,params) => {
              return h('Tag',{},params.row.name)
          }
        },
        {
          title: "备注",
          key: "desc"
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
                      this.handDeleteProject(params.row.id, params.row.name);
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
    this.handleGetProjectList();
  },
  methods: {
    notice(title, msg) {
      this.$Notice.success({
        title: title,
        duration: 6,
        desc: msg
      });
    },
    handleGetProjectList() {
      getProjectList(this.getParams).then(resp => {
        this.total = resp.data.count;
        this.projectList = resp.data.results;
      });
    },
    handleCreateProject() {
      this.$refs.formProjectCreate.validate(valid => {
        if (!valid) {
          return false;
        }
      });
      let data = this.formProjectCreate;
      createProject(data).then(resp => {
        let httpstatus = resp.status;
        if (httpstatus == 201) {
          let title = "服务器提示";
          let msg = "项目 " + resp.data.name + " 创建成功";
          this.notice(title, msg);
        }
        this.handleGetProjectList();
        this.$refs.formProjectCreate.resetFields();
      });
    },
    handDeleteProject(id,name) {
      deleteProject(id).then(resp => {
        let httpstatus = resp.status;
        if (httpstatus == 204) {
          let title = "服务器提示";
          let msg = "用户 " + name + " 删除成功";
          this.notice(title, msg);
          }
          let totalPage = Math.ceil((this.total - 1) / this.getParams.pagesize) // 总页数
          this.getParams.page = this.getParams.page > totalPage ? totalPage : this.getParams.page
          this.getParams.page = this.getParams.page < 1 ? 1 : this.getParams.page
          this.handleGetProjectList();

      });
    },
    pageChange(page) {
      this.getParams.page = page;
      this.handleGetProjectList();
    },

    sizeChange(size) {
      this.getParams.pagesize = size;
      this.handleGetProjectList();
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