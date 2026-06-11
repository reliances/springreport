<!--
 * @Description: luckysheetreport预览页面
 * @Version: 1.0
 * @Autor: caiyang
 * @Date: 2022-02-08 07:56:21
 * @LastEditors: caiyang
 * @LastEditTime: 2022-04-01 11:18:22
-->
<template>
<el-scrollbar height="100vh" ref="scroll">
    <div class="pagebox">
    <div
      v-loading="loading"
      class="contentbox"
      style="height: 100%; display: flex; flex-direction: column"
      :element-loading-text="loadingText"
    >
    <div
              id="luckysheet"
              style="margin: 0px; padding: 0px; width: 100%; height: 100%; left: 0px; top: 50px"
            ></div>
    <div
      ref="dragArea"
      class="drag-area"
    >
      <el-tooltip effect="dark" content="快照导出Excel" placement="top">
        <el-button
          type="primary"
          size="small"
          circle
          @click="exportSnapshot"
        ><icon-download/></el-button>
      </el-tooltip>
    </div>
    </div>
  </div>
</el-scrollbar>
</template>
<script src="./snapshotPreview.js"></script>
<style scoped lang="scss">
  .pagebox {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #ffffff;
  }

  .pagebox .toolbox {
    height: 10px;
    min-height: 10px;
    display: flex;
    background: white;
    /* box-shadow: 0 5px 10px #ebebeb; */
    line-height: 60px;
  }

  .contentbox {
    flex: 1;
    display: flex;
  }

  .contentbox .mainbox {
    flex: 1;
    overflow-y: auto;
    overflow-x: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .contentbox .rightbox {
    width: 250px;
    flex: none;
    padding-left: 10px;
    background: white;
    position: relative;
    box-shadow: 0 2px 2px #ebebeb;
  }
  .contentbox .rightbox.collapse {
    width: 30px;
  }
  .clarrow {
    position: absolute;
    top: 50%;
    left: 3px;
    font-size: 20px;
    cursor: pointer;
  }
  .el-tabs :deep(.el-tabs__content) {
    padding-right: 15px;
    padding-bottom: 1px;
    height: 93%;
    overflow-y: auto;
    overflow-x: auto;
  }
  .el-scrollbar :deep(.el-scrollbar__view) {
    height: 100% !important;
  }
  /*去除页眉页脚*/
  @page {
    size: auto; /* auto is the initial value */
    margin: 3mm; /* this affects the margin in the printer settings */
  }

  html {
    background-color: #ffffff;
    margin: 0; /* this affects the margin on the html before sending to printer */
  }

  body {
    border: solid 1px blue;
    margin: 10mm 15mm 10mm 15mm; /* margin you want for the content */
  }
  /*去除页眉页脚*/
  #print_html {
    text-align: 'center';
  }
  #print_html :deep(table) {
    margin: 0 auto;
  }
  .tplname {
    padding: 0px 20px;
    background-color: rgba(208, 208, 208, 0);
    font-size: 19px;
    line-height: 30px;
    color: #17b794;
    font-weight: bold;
    margin: 5px 0;
  }
  ._header {
    height: 45px !important;
    padding: 0px;
    background-color: #fff;
    //   border-bottom: 1px solid #ccc;
    .headerRight {
      padding-right: 24px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.9);
      .role-name {
        margin-right: 8px;
      }
    }
    .el-dropdown-link {
      color: rgba(0, 0, 0, 0.9);
    }
  }
  .drag-area {
    position: fixed;
    right: 5px;
    bottom: 100px;
    z-index: 99999;
    padding: 5px;
    width: fit-content;
    opacity: 1;
    background-color: #17b794;
    border-radius: 8px;
    box-shadow: 0px 2px 15px 0px rgba(9, 41, 77, 0.15);
    // cursor: move;
    user-select: none;
    text-align: center;
  }
  :deep(.hisDialog) {
    pointer-events: none !important;
  }
  :deep(.el-overlay-dialog) {
    flex-direction: column !important;
    overflow: hidden !important;
    pointer-events: none !important;
  }
  :deep(.hisDialog .el-dialog) {
    margin-top: 90px !important;
    margin-right: 14px;
  }
  :deep(.el-dialog) {
    pointer-events: auto !important;
  }
  :deep(.el-dialog__body) {
    height: calc(100% - 90px) !important;
    overflow: auto;
  }
  :deep(.el-dialog-div) {
    max-height: 60vh;
    overflow: auto;
    margin-left: 10px;
  }
  :deep(.el-dialog__title) {
    font-weight: bold;
  }
  .config-panel {
    background: #ffffff;
    // margin-left: 1px;
    top: 10px;
    position: relative;
    width: 254px;
    height: 95%;
    display: flex;
    flex-direction: column;
    overflow: auto;
    z-index: 1999;
    float: right;
    .config-header {
      width: 100%;
      height: 32px;
      // background: #2F343D;
      font-size: 13px;
      font-weight: 400;
      color: #000000;
      line-height: 32px;
      text-align: center;
    }
    .config-box {
      flex: 1;
      padding: 10px;
      overflow: auto;
    }

    /*定义滚动条的宽度*/
    .config-box::-webkit-scrollbar {
      width: 0;
    }
  }
</style>
