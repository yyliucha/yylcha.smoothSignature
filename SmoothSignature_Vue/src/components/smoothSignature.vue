<template>
  <div>
    <el-dialog
      title="签名"
      :visible.sync="ssDialogVisible"
      width="21%"
      :close-on-click-modal="false"
      :showFooter="false"
      center
      destroy-on-close
    >
      <canvas style="border: 1px solid black"></canvas>
      <br />
      <el-button type="primary" @click="handleClear">清空签名</el-button>
      <el-button type="primary" @click="handleUndo">撤销</el-button>
      <br />
      <br />
      <el-button type="primary" @click="handlePreview">确定</el-button>
      <el-button type="primary" @click="handleColor">修改字迹颜色</el-button>
    </el-dialog>
  </div>
</template>
  
<script>
import SmoothSignature from "smooth-signature";
import { v4 as uuidV4 } from "uuid";
export default {
  data() {
    return {
      ssDialogVisible: false,
      signature: "",
      signUrl: "",
    };
  },
  mounted() {},
  methods: {
    init(url) {
      this.ssDialogVisible = true;
      let canvas = document.querySelector("canvas");
      let options = {
        width: Math.min(window.innerWidth, 350),
        height: 200,
        minWidth: 4,
        maxWidth: 12,
        // color: '#1890ff',
        bgColor: "#f6f6f6",
      };
      if (canvas) {
        this.signature = new SmoothSignature(canvas, options);
        //当url不为空的时候，则把前面用户产生的签名带入到canvas中
        if (url) {
          let ctx = this.signature.ctx;
          var img = new Image();
          img.src = url;
          img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          };
        }
      }
    },
    handleClear() {
      this.signature.clear();
    },
    handleUndo() {
      this.signature.undo();
    },
    handleColor() {
      this.signature.color = "#" + Math.random().toString(16).slice(-6);
    },
    handlePreview() {
      const isEmpty = this.signature.isEmpty();
      if (isEmpty) {
        this.$message.error("请填写签名");
        return;
      }
      const pngUrl = this.signature.getPNG();

      const blob = this.dataURLToBlob(pngUrl);
      const url = window.URL.createObjectURL(blob);
      this.$emit("fillSignContent", url);
      this.ssDialogVisible = false;
      //let filename = uuidV4().replace(/-/g, "") + ".png";
      //const a = document.createElement("a");
      //a.style = "display: none";
      //a.href = url;
      //a.download = filename;
      //document.body.appendChild(a);
      //a.click();
      //window.URL.revokeObjectURL(url);
    },
    dataURLToBlob(dataURL) {
      // Code taken from https://github.com/ebidel/filer.js
      const parts = dataURL.split(";base64,");
      const contentType = parts[0].split(":")[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], { type: contentType });
    },
  },
  created() {},
};
</script>

<style>
</style>
