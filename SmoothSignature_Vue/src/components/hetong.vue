<template>
  <div>
    <div class="singPanel" id="overtimeApp">
      <table class="cssTb">
        <tr>
          <td>部门</td>
          <td></td>
          <td>姓名</td>
          <td></td>
          <td>职位</td>
          <td></td>
        </tr>
        <tr>
          <td>加班事由</td>
          <td colspan="5">测试</td>
        </tr>
        <tr>
          <td>加班时间</td>
          <td colspan="5">
            <span
              >日期：__2099__年__12__月__31__日（□工作日 □双休日 □国定假日）</span
            >
            <br />
            <span
              >时间：从__08__点到__18__点</span
            ><br />
            <span>共计__8__小时</span>
          </td>
        </tr>
        <tr>
          <td>换算方式</td>
          <td colspan="5"><span>□调休 □调休延期 □加班费</span></td>
        </tr>
        <tr>
          <td>实际加班时数（由HR填写）</td>
          <td colspan="3"></td>
          <td>人力资源部签收</td>
          <td></td>
        </tr>
      </table>
      <div class="cssWorld">
        <div style="float: left; width: 600px">
          <div style="float: left">申请部门经理签字：</div>
          <div
            class="cssSign"
            v-on:click="signClick"
            style="
              background: rgb(246, 246, 246);
              border: 1px dashed rgb(185, 185, 185);
              margin: 0.3rem;
              border-radius: 0.2rem;
              overflow: hidden;
            "
            v-html="signContent"
          ></div>
        </div>
        <div style="float: right; width: 150px">
          &nbsp;&nbsp;2099年&nbsp;&nbsp;12月&nbsp;&nbsp;31日
        </div>
      </div>
    </div>
    <div class="cssBtn">
      <el-button type="primary" v-on:click="okClick">确认</el-button>
    </div>
    <SmoothSignature
      ref="refSmoothSignature"
      @fillSignContent="fillSignContent"
    />
  </div>
</template>
<script>
import PdfLoader from "./htmlToPdfNew.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SmoothSignature from "./smoothSignature.vue";
export default {
  components: { SmoothSignature },
  data() {
    return {
      signContent: "",
      signUrl: "",
    };
  },
  mounted() {},
  methods: {
    init() {},
    //生成签名图片..
    handleGenerate() {
      this.$refs.esign
        .generate()
        .then((res) => {
          this.handleReset();
          this.signSuccess ? this.signSuccess(res) : "";
        })
        .catch((err) => {
          console.log(err);
          // this.$message.error('请签名之后提交！')
          alert("请签名之后提交");
        });
    },
    handleReset() {
      this.signContent = "";
    },
    signClick() {
      this.$refs.refSmoothSignature.init(this.signUrl);
    },
    fillSignContent(sign) {
      this.signUrl = sign;
      this.signContent = `<img src='${sign}'></img>`;
    },
    oldFunc(ele, loading) {
      let pdf = new PdfLoader(ele, "加班申请单", "itemClass");
      pdf.getPDF();
      loading.close();
    },
    savePdf(el, loading, title) {
      html2canvas(el, {
        useCORS: true,
        allowTaint: true,
      })
        .then((canvas) => {
          debugger;
          // 内容的宽度
          const contentWidth = canvas.width;
          // 内容高度
          const contentHeight = canvas.height;
          // 一页pdf显示html页面生成的canvas高度,a4纸的尺寸[595.28,841.89];
          const pageHeight = (contentWidth / 592.28) * 841.89;
          // 未生成pdf的html页面高度
          let leftHeight = contentHeight;
          // 页面偏移
          let position = 0;
          // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          const imgWidth = 595.28;
          const imgHeight = (592.28 / contentWidth) * contentHeight;
          // canvas转图片数据
          const pageData = canvas.toDataURL("image/jpeg", 1.0);
          // 新建JsPDF对象
          const PDF = new jsPDF("", "pt", "a4");
          // 判断是否分页
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                PDF.addPage();
              }
            }
          }
          // 保存文件
          PDF.save(title + ".pdf");
        })
        .catch(() => {})
        .finally(() => {
          loading.close();
        });
    },

    okClick() {
      const loading = this.$loading({
        lock: true,
        text: "正在生成PDF文件...",
        spinner: "el-icon-loading",
        background: "hsla(0,0%,100%,.9)",
      });
      let html = this.getPdfPage();
     /* console.log(html);
      html2canvas(html, {
        useCORS: true, //允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。
      }).then(async (canvas) => {
        debugger;
        let dataURL = canvas.toDataURL();
        var link = document.createElement("a");
        link.href = dataURL;
        link.download = "image.png";
        document.body.appendChild(link);
        link.click();
        loading.close();
      });*/
      this.oldFunc(html, loading);
      //this.savePdf(html, loading, `加班申请单.pdf`);
    },
    getPdfPage() {
      return document.getElementById("overtimeApp"); //需要导出的标签页
    },
  },
  created() {},
};
</script>
<style>
.cssSign {
  height: 200px;
  width: 440px;
  float: right;
}

.cssTb {
  margin: auto;
  width: 40%;
}
.cssWorld {
  margin: auto;
  width: 40%;
}

table,
td {
  border: 1px solid black;
  width: 500px;
}

.cssBtn {
  margin-top: 300px;
}
.singPanel {
  width: 100%;
  height: 400px;
}
</style>