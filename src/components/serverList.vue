// 服务商列表
<template>
    <div class="box">
        <!-- 这是服务商列表 -->
        <div class="shadow"></div>
        <div class="tableBox">
            <div class="tableTitle">
                <p>切换供应商</p>
                <div class="close" @click="closeServerList">X</div>
            </div>
            <div>
                 <Table border :columns="columns1" :data="tableData"></Table>
  
            </div>
        </div>
    </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  name: "ServerList",
  props: ["id"],
  data() {
    return {
      // 表格结构
      columns1: [
        { title: "供应商", key: "supplier", align: "center", width: 160 },
        {
          title: "价格",
          key: "offer",
          align: "center",
          width: 160,
          sortable: true
        },
        {
          title: "操作",
          align: "center",
          width: 160,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.putWay(params.row);
                    }
                  }
                },
                "上架"
              )
            ]);
          }
        }
      ],
      // 表格数据
      tableData: []
    };
  },
  methods: {
    ...mapMutations(["closeServerList", "toggleChangePrice"]),
    putWay(params) {
      // console.log(params);
      window.req.changeServersList(
        this,
        {
          supplier: params.supplier_id
        },
        res => {
          if (res.code == 0) {
            this.closeServerList();
            this.toggleChangePrice();
          } else {
            this.$Message.error("切换供应商失败");
          }
        },
        this.id
      );
    }
  },
  created() {
    window.req.getServersList(
      this,
      { page: 1, page_size: 50 },
      res => {
        if (res.code == 0) {
          console.log(res);
          if (res.code == "0") {
            this.tableData = res.data;
          }
        }
      },
      this.id
    );
  }
};
</script>
<style scoped lang="less">
.box {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 901;
  .shadow {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .tableBox {
    background: #fff;
    padding: 10px;
    position: absolute;
    width: 500px;
    top: 150px;
    left: 50%;
    transform: translate(-50%, 0);
    .tableTitle {
      color: #666;
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      display: flex;
      justify-content: space-between;
      p {
        flex-grow: 1;
        text-align: center;
      }
      .close {
        cursor: pointer;
        color: #ccc;
        width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 16px;
        text-align: center;
        border: 1px solid #fff;
        border-radius: 10px;
        &:hover {
          background: #e81123;
          color: #fff;
        }
      }
    }
  }
}
</style>

