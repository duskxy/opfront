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
            @on-change="handleGetDeployList"
            @on-click="handleGetDeployList"
            @on-enter="handleGetDeployList"
          />
        </Col>
      </Row>
    </div>
    <Table border :columns="columnsDeploy" :data="deployList"></Table>
    <div class="page">
      <Page
        :total="total"
        show-sizer
        :current="getParams.page"
        @on-change="pageChange"
        @on-page-size-change="sizeChange"
      />
    </div>

    
  </div>
</template>

<script>
import {
  getDeployList,
} from "@/api/deploy";
import { Button } from "iview";
export default {
  name: "deploy",
  data() {
    return {
      getParams: {
        search: "",
        page: 1,
        pagesize: 10,
        statusmax: 2
      },
      total: 1,
      deployList: [],
      ostatus: [
        { color: "info", desc: "待审核" },
        { color: "primary", desc: "已审核" },
        { color: "success", desc: "已上线" },
        { color: "warning", desc: "已放弃" }
      ],
      cstatus: [
        { color: "info", desc: "审核" },
        { color: "primary", desc: "待上线" },
        { color: "success", desc: "已完成" },
        { color: "success", desc: "放弃" }
      ],
      ruleCustom: {
        // name: [{ required: true, message: "发布名不能为空", trigger: "blur" }]
      },
      columnsDeploy: [
                {
          title: "ID",
          key: "id"},
        {
          title: "项目",
          key: "projectname",
          render: (h, params) => {
            return h("Tag", {}, params.row.projectname.name);
          }
        },
        {
          title: "web",
          key: "webname",
          render: (h, params) => {
            return h("Tag", {}, params.row.webname.name);
          }
        },
        {
          title: "申请人",
          key: "applicant",
          render: (h, params) => {
            return h("span", {}, params.row.applicant.name);
          }
        },
        {
          title: "发布版本",
          key: "version"
        },
        {
          title: "备注",
          key: "info",
          render: (h,params) => {
              return h('span',{},params.row.info.slice(0,6) + '...') 
          },
        },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            return h("div", [
              h(
                Button,
                {
                  props: {
                    type: this.ostatus[params.row.status].color,
                    shape: "circle",
                    size: "small"
                  }
                },
                this.ostatus[params.row.status].desc
              )
            ]);
          }
        },
        {
          title: "申请时间",
          key: "apply_time",
          render: (h,params) => {
            return h('span',{},params.row.apply_time.moment())
          }
        },
        {
          title: "操作",
          width: 150,
          align: "center",
          render: (h, params) => {
           if (params.row.status == 3) {
                return 
                // h("div",[h(Button,{
                //   props: {
                //     type: this.cstatus[params.row.status].color,
                //     size: "small"
                //   },
                // },this.cstatus[params.row.status].desc)])
              }
            if (params.row.status == 2) {
                return 
                // h("div",[h(Button,{
                //   props: {
                //     type: this.cstatus[params.row.status].color,
                //     size: "small"
                //   },
                // },this.cstatus[params.row.status].desc)])
              }
            return h("div", [
              h(
                Button,
                {
                  props: {
                    type: this.cstatus[params.row.status].color,
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editDeploy = true;
                      this.current = params.row.status;
                      this.formDeployEdit.id = params.row.id
                      this.formDeployEdit.projectname = params.row.projectname.name;
                      this.formDeployEdit.webname = params.row.webname.name
                      this.formDeployEdit.applicant = params.row.applicant.name
                      this.formDeployEdit.version = params.row.version
                      this.formDeployEdit.info = params.row.info
                      this.formDeployEdit.status = params.row.status
                    }
                  }
                },
                this.cstatus[params.row.status].desc
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
                      this.handDeleteDeploy(params.row.id, params.row.name);
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
                    "取消"
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
    this.handleGetDeployList();
  },
  methods: {
    notice(title, msg) {
      this.$Notice.success({
        title: title,
        duration: 6,
        desc: msg
      });
    },

    handleGetDeployList() {
      getDeployList(this.getParams).then(resp => {
        this.total = resp.data.count;
        this.deployList = resp.data.results;
      });
    },

    pageChange(page) {
      this.getParams.page = page;
      this.handleGetDeployList();
    },

    sizeChange(size) {
      this.getParams.pagesize = size;
      this.handleGetDeployList();
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