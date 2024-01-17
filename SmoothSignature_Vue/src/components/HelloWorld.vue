<template>
  <div>
    <div>
      <div style="margin-bottom: 10px">
        <label class="cssTip">提示:可以不选择,默认格式是PNG</label>

        <el-select v-model="selectType" class="cssDownType">
          <el-option
            v-for="item in downType"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div style="">
        <canvas class="cssCanvas"></canvas>
      </div>
    </div>
    <div class="btnList">
      <el-button type="primary" @click="clearCanvas">清空签名</el-button>
      <el-button type="primary" @click="undoCanvas">撤销</el-button>
      <el-button type="primary" @click="downCanvas">下载签名</el-button>
      <el-button type="primary" @click="changeColor">修改背景颜色</el-button>
      <el-button type="primary" @click="changeLineColor"
        >修改线条颜色</el-button
      >
    </div>
  </div>
</template>

<script>
import SignaturePad from "signature_pad/dist/signature_pad.js";
import { v4 as uuidV4 } from "uuid";
export default {
  data() {
    return {
      selectType: "",
      downType: [
        { label: "PNG", value: "png" },
        { label: "JPG", value: "jpg" },
        { label: "SVG", value: "svg" },
      ],
      signaturePad: null,
    };
  },
  mounted() {
    this.initializeSignaturePad();
  },
  methods: {
    initializeSignaturePad() {
      let canvas = document.querySelector("canvas");
      if (canvas) {
        this.signaturePad = new SignaturePad(canvas, {
          minWidth: 20,
          maxWidth: 20,
          penColor: "rgb(66, 133, 244)",
        });
      }
    },
    //清空签名
    clearCanvas() {
      if (this.signaturePad) {
        this.signaturePad.clear();
      } else {
        this.$message.error("请先提供签名");
      }
    },
    //撤销
    undoCanvas() {
      if (this.signaturePad) {
        let data = this.signaturePad.toData();
        if (data) {
          data.pop();
          this.signaturePad.fromData(data);
        }
      } else {
        this.$message.error("请先提供签名");
      }
    },
    downCanvas() {
      if (this.signaturePad) {
        let selType = this.selectType;
        let formatType = "";
        switch (selType) {
          case "jpg":
            formatType = "image/jpeg";
            break;
          case "svg":
            formatType = "image/svg+xml";
            break;
          case "png":
            formatType = "";
            break;
          default:
            formatType = "";
            break;
        }
        let filename = uuidV4().replace(/-/g, "") + "." + selType;
        let dataUrl = this.signaturePad.toDataURL(formatType);
        this.downLoad(dataUrl, filename);
      } else {
        this.$message.error("请先提供签名");
      }
    },
    //下载方法 dataUrl:签名画布url filename:下载后的文件名称
    downLoad(dataURL, filename) {
      const blob = this.dataURLToBlob(dataURL);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style = "display: none";
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
    },
    // One could simply use Canvas#toBlob method instead, but it's just to show
    // that it can be done using result of SignaturePad#toDataURL.
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
    changeLineColor() {
      const r = Math.round(Math.random() * 255);
      const g = Math.round(Math.random() * 255);
      const b = Math.round(Math.random() * 255);
      const color = "rgb(" + r + "," + g + "," + b + ")";

      this.signaturePad.penColor = color;
    },
    changeColor() {
      const r = Math.round(Math.random() * 255);
      const g = Math.round(Math.random() * 255);
      const b = Math.round(Math.random() * 255);
      const color = "rgb(" + r + "," + g + "," + b + ")";

      this.signaturePad.backgroundColor = color;
      const data = this.signaturePad.toData();
      this.signaturePad.clear();
      this.signaturePad.fromData(data);
    },
  },
  created() {},
};
</script>

<style>
.cssCanvas {
  border: 1px solid black;
}

.cssDownType {
  margin-top: 25px;
  margin-left: 5px;
  width: 100px;
}

.cssTip {
  font-weight: bold;
  color: #ff0000;
  margin-left: 5px;
}
</style>
